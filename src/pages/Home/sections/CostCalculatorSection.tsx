import { useState, useId, useEffect, useRef, useMemo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useInViewOnce } from '@/hooks/useInViewOnce'

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#cost-calculator { padding-left: 16px; padding-right: 16px; }
@media (min-width: 640px)  { #cost-calculator { padding-left: 24px; padding-right: 24px; } }
@media (min-width: 1024px) { #cost-calculator { padding-left: 96px; padding-right: 96px; } }

/* Area slider (Figma node 230:7425): 6px track, 26px knob */
.gcc-range { -webkit-appearance: none; appearance: none; width: 100%; height: 28px; background: transparent; cursor: pointer; margin: 0; }
.gcc-range:focus { outline: none; }
.gcc-range::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: linear-gradient(to right, #6F1D1B var(--p, 0%), #CCC5B9 var(--p, 0%)); }
.gcc-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; margin-top: -10px; border-radius: 999px; background: #fff; border: 3px solid #6F1D1B; box-shadow: 0 2px 6px rgba(37,36,34,.25); }
.gcc-range::-moz-range-track { height: 6px; border-radius: 3px; background: #CCC5B9; }
.gcc-range::-moz-range-progress { height: 6px; border-radius: 3px; background: #6F1D1B; }
.gcc-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 999px; background: #fff; border: 3px solid #6F1D1B; box-shadow: 0 2px 6px rgba(37,36,34,.25); }
.gcc-range:focus-visible::-webkit-slider-thumb { outline: 2px solid #E06422; outline-offset: 2px; }
.gcc-range:focus-visible::-moz-range-thumb { outline: 2px solid #E06422; outline-offset: 2px; }

/* Mobile bottom sheet (Figma node 203:4156): slider fill fades tan -> maroon */
@media (max-width: 1023px) {
  .gcc-range::-webkit-slider-runnable-track { background: linear-gradient(to right, #BB9457 0%, #6F1D1B var(--p, 0%), #CCC5B9 var(--p, 0%)); }
  .gcc-range::-moz-range-progress { background: linear-gradient(to right, #BB9457, #6F1D1B); }
}

/* Bottom sheet slide-up */
@keyframes gccSheetUp { from { transform: translateY(32px); opacity: 0; } to { transform: none; opacity: 1; } }
.gcc-sheet-in { animation: gccSheetUp .28s ease-out; }
@media (prefers-reduced-motion: reduce) { .gcc-sheet-in { animation: none; } }
`

/* -------------------------------------------------------------------------
   Estimator model (plinth-area rate method)
   Cost = built-up area x rate per sq ft, plus per-room fit-out amounts.
   All rates are INR placeholders based on Nagpur 2026 market ranges.
   Tune them in RATES below.
   ------------------------------------------------------------------------- */
type ProjectType = 'villa' | 'farmhouse' | 'renovation'

const AREA_MIN = 500
const AREA_MAX = 10000
const AREA_STEP = 100
const COUNT_MIN = 1
const COUNT_MAX = 10

const RATES = {
  construction: 2100, // ₹/sq ft, standard civil rate (Nagpur)
  finishing: 735, // ₹/sq ft, adds up to ~2,835 (premium) when interiors are on
  bedroomBuild: 30000, // per bedroom: doors, windows, electrical points
  bathroomBuild: 60000, // per bathroom: plumbing, waterproofing, wall/floor tiling
  bedroomFinish: 50000, // per bedroom: wardrobe, false ceiling, paint (interiors on)
  bathroomFinish: 80000, // per bathroom: sanitaryware, fittings, vanity (interiors on)
  permitsPct: 0.03, // of construction + finishing (rough placeholder)
  landPerSqFt: 2200, // ₹/sq ft of plot, replace with your local rate
  plotFactor: 1.6, // plot area = footprint x factor (setbacks, parking, garden)
} as const

const TYPE_MULTIPLIER: Record<ProjectType, number> = {
  villa: 1.0,
  farmhouse: 1.08,
  renovation: 0.55,
}

interface Estimate {
  land: number
  construction: number
  finishing: number
  permits: number
  total: number
}

const EMPTY_ESTIMATE: Estimate = { land: 0, construction: 0, finishing: 0, permits: 0, total: 0 }

const roundTo = (n: number, step = 1000) => Math.round(n / step) * step

function computeEstimate(input: {
  type: ProjectType
  area: number
  floors: number
  bedrooms: number
  bathrooms: number
  interior: boolean
}): Estimate {
  const { type, area, floors, bedrooms, bathrooms, interior } = input
  if (area < AREA_MIN) return EMPTY_ESTIMATE

  const mult = TYPE_MULTIPLIER[type]

  const construction = roundTo(
    (area * RATES.construction + bedrooms * RATES.bedroomBuild + bathrooms * RATES.bathroomBuild) * mult
  )
  const finishing = interior
    ? roundTo(
        (area * RATES.finishing + bedrooms * RATES.bedroomFinish + bathrooms * RATES.bathroomFinish) * mult
      )
    : 0
  // Renovations happen on land you already own
  const land = type === 'renovation' ? 0 : roundTo((area / floors) * RATES.plotFactor * RATES.landPerSqFt)
  const permits = roundTo((construction + finishing) * RATES.permitsPct)

  return { land, construction, finishing, permits, total: land + construction + finishing + permits }
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
const inrSpaced = (n: number) => `₹ ${n.toLocaleString('en-IN')}` // mobile sheet shows "₹ 4,50,000"

/* -------------------------------------------------------------------------
   Viewport helper: below 1024px the estimator is a two-page bottom sheet
   ------------------------------------------------------------------------- */
const MOBILE_QUERY = '(max-width: 1023px)'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

/* -------------------------------------------------------------------------
   Fonts
   ------------------------------------------------------------------------- */
const DISPLAY = { fontFamily: '"Bai Jamjuree", sans-serif' } as const
const BODY = { fontFamily: '"Hanken Grotesk", sans-serif' } as const

/* -------------------------------------------------------------------------
   Icons (24px stroke icons, recoloured through currentColor)
   ------------------------------------------------------------------------- */
function Icon({ size = 24, children, className }: { size?: number; children: ReactNode; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const HomeIcon = () => (
  <Icon>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20h14V9.5" />
    <path d="M10 20v-6h4v6" />
  </Icon>
)
const FarmhouseIcon = () => (
  <Icon>
    <path d="M2 11.5 12 4l10 7.5" />
    <path d="M4 10v10h16V10" />
    <path d="M9 20v-5h6v5" />
    <path d="M12 7.5v.01" />
  </Icon>
)
const RenovationIcon = () => (
  <Icon>
    <path d="m14.5 6.5 3 3" />
    <path d="M16 4.5 19.5 8 9 18.5 4.5 19.5 5.5 15z" />
  </Icon>
)
const CheckIcon = ({ size = 14 }: { size?: number }) => (
  <Icon size={size}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)
const MinusIcon = () => (
  <Icon size={20}>
    <path d="M5 10h10" />
  </Icon>
)
const PlusIcon = () => (
  <Icon size={20}>
    <path d="M10 5v10M5 10h10" />
  </Icon>
)
const CloseIcon = () => (
  <Icon>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)
const LockIcon = ({ size = 20 }: { size?: number }) => (
  <Icon size={size}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
)
const ShieldIcon = ({ size = 22 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M12 3 19 6v5.5c0 4.2-2.9 7.3-7 9-4.1-1.7-7-4.8-7-9V6z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Icon>
)
const ChevronRightIcon = () => (
  <Icon>
    <path d="m9 6 6 6-6 6" />
  </Icon>
)
const ChevronLeftIcon = () => (
  <Icon>
    <path d="m15 6-6 6 6 6" />
  </Icon>
)

/* -------------------------------------------------------------------------
   Small controls
   ------------------------------------------------------------------------- */
const PROJECT_OPTIONS: { id: ProjectType; label: string; icon: ReactNode }[] = [
  { id: 'villa', label: 'Villa', icon: <HomeIcon /> },
  { id: 'farmhouse', label: 'Farmhouse', icon: <FarmhouseIcon /> },
  { id: 'renovation', label: 'Renovation', icon: <RenovationIcon /> },
]

function OptionCard({
  label,
  icon,
  selected,
  onSelect,
}: {
  label: string
  icon: ReactNode
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex h-[96px] min-w-0 flex-1 cursor-pointer flex-col items-start gap-3 rounded-[10px] text-left transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E06422]',
        selected
          ? 'border-2 border-[#6F1D1B] bg-[#FFE6A7] p-[15px] text-[#6F1D1B]'
          : 'border border-[#CCC5B9] bg-[#FFFCF2] p-4 text-[#252422] hover:border-[#6F1D1B]/50'
      )}
    >
      <span className="flex w-full items-center justify-between">
        {icon}
        {selected ? (
          <span className="flex rounded-full bg-[#6F1D1B] p-[3px] text-white">
            <CheckIcon />
          </span>
        ) : (
          <span className="size-[20px] rounded-full border-[1.5px] border-[#CCC5B9]" />
        )}
      </span>
      <span
        style={BODY}
        className="truncate text-[16px] font-semibold leading-[28px] tracking-[-0.2px] sm:text-[20px]"
      >
        {label}
      </span>
    </button>
  )
}

/* Mobile: full-width row with icon, label and radio (Figma 203:4160) */
function SheetOption({
  label,
  icon,
  selected,
  onSelect,
}: {
  label: string
  icon: ReactNode
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-[10px] text-left transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E06422]',
        selected
          ? 'border-2 border-[#6F1D1B] bg-[#FFE6A7] p-[14px] text-[#6F1D1B]'
          : 'border border-[#CCC5B9] bg-[#FFFCF2] p-[15px] text-[#252422]'
      )}
    >
      {icon}
      <span style={BODY} className="min-w-0 flex-1 text-[16px] font-semibold leading-[28px] tracking-[-0.16px]">
        {label}
      </span>
      <span
        className={cn(
          'flex size-[20px] shrink-0 items-center justify-center rounded-full border-[1.5px]',
          selected ? 'border-[#6F1D1B] bg-white' : 'border-[#CCC5B9]'
        )}
      >
        {selected && <span className="size-[8px] rounded-full bg-[#6F1D1B]" />}
      </span>
    </button>
  )
}

function ChoicePill({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      style={BODY}
      className={cn(
        'flex h-[48px] w-[64px] cursor-pointer items-center justify-center rounded-full border px-5 py-3 text-[20px] font-semibold leading-[28px] tracking-[-0.2px] transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E06422]',
        selected
          ? 'border-2 border-[#6F1D1B] bg-[#FFE6A7] text-[#6F1D1B]'
          : 'border-[#CCC5B9] bg-[#FFFCF2] text-[#252422] hover:border-[#6F1D1B]/50'
      )}
    >
      {label}
    </button>
  )
}

/* Mobile: equal-width pill, selected = solid maroon (Figma 203:4189) */
function SheetPill({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      style={BODY}
      className={cn(
        'flex h-[48px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full border text-[16px] font-semibold leading-[28px] tracking-[-0.16px] transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E06422]',
        selected
          ? 'border-[#6F1D1B] bg-[#6F1D1B] text-white'
          : 'border-[#CCC5B9] bg-[#FFFCF2] text-[#252422]'
      )}
    >
      {label}
    </button>
  )
}

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  compact = false,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
  compact?: boolean
}) {
  const atMin = value <= min
  const atMax = value >= max
  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-[54px] w-full items-center justify-between rounded-[10px] border border-[#CCC5B9] bg-[#FFFCF2] p-[6px]"
    >
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={atMin}
        onClick={() => onChange(value - 1)}
        className="flex cursor-pointer rounded-[8px] border border-[#CCC5B9] bg-white p-[9px] text-[#252422] transition-opacity enabled:hover:bg-[#F5F0E6] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E06422]"
      >
        <MinusIcon />
      </button>
      <span
        aria-live="polite"
        style={DISPLAY}
        className={cn(
          'font-semibold leading-[28px] text-[#252422]',
          compact ? 'text-[18px] tracking-[-0.09px]' : 'text-[22px] tracking-[-0.11px]'
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={atMax}
        onClick={() => onChange(value + 1)}
        className="flex cursor-pointer rounded-[8px] bg-[#6F1D1B] p-[9px] text-white transition-opacity enabled:hover:bg-[#5a1716] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E06422]"
      >
        <PlusIcon />
      </button>
    </div>
  )
}

function Toggle({ checked, onChange, labelId }: { checked: boolean; onChange: (v: boolean) => void; labelId: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[28px] w-[48px] shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E06422]',
        checked ? 'bg-[#6F1D1B]' : 'bg-[#CCC5B9]'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] size-[22px] rounded-full bg-white shadow transition-all',
          checked ? 'left-[23px]' : 'left-[3px]'
        )}
      />
    </button>
  )
}

const FieldLabel = ({ children, id }: { children: ReactNode; id?: string }) => (
  <p id={id} style={BODY} className="text-[14px] font-medium leading-[20px] text-[#403D39]">
    {children}
  </p>
)

/* -------------------------------------------------------------------------
   Estimator modal
   Desktop (>=1024px): two panels, Figma node 230:7408
   Mobile (<1024px): bottom sheet, page 1 = 203:4156, page 2 = 203:4201
   ------------------------------------------------------------------------- */
const BREAKDOWN: { key: keyof Omit<Estimate, 'total'>; label: string; color: string }[] = [
  { key: 'land', label: 'Land Acquisition', color: '#FFE6A7' },
  { key: 'construction', label: 'Construction', color: '#FB8B24' },
  { key: 'finishing', label: 'Finishing & Interiors', color: '#BB9457' },
  { key: 'permits', label: 'Permits & Fees', color: 'rgba(255,252,242,0.55)' },
]

function EstimatorModal({ onClose }: { onClose: () => void }) {
  const isMobile = useIsMobile()
  const [page, setPage] = useState<1 | 2>(1) // mobile sheet only
  const [areaError, setAreaError] = useState(false)

  const [type, setType] = useState<ProjectType>('villa')
  const [area, setArea] = useState(0) // 0 = untouched, matches the Figma empty state
  const [areaDraft, setAreaDraft] = useState<string | null>(null)
  const [floors, setFloors] = useState<number | null>(null)
  const [bedrooms, setBedrooms] = useState(4)
  const [bathrooms, setBathrooms] = useState(3)
  const [interior, setInterior] = useState(true)

  const titleId = useId()
  const areaLabelId = useId()
  const floorsLabelId = useId()
  const interiorLabelId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const areaFieldRef = useRef<HTMLDivElement>(null)

  const estimate = useMemo(
    () => computeEstimate({ type, area, floors: floors ?? 1, bedrooms, bathrooms, interior }),
    [type, area, floors, bedrooms, bathrooms, interior]
  )
  const ready = estimate.total > 0

  // Lock page scroll, focus the dialog, restore focus on close
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ;(closeRef.current ?? dialogRef.current)?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [])

  // Escape to close + simple focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled])'
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const commitAreaDraft = () => {
    if (areaDraft === null) return
    const n = parseInt(areaDraft.replace(/[^\d]/g, ''), 10)
    if (Number.isNaN(n) || n === 0) setArea(0)
    else setArea(Math.min(AREA_MAX, Math.max(AREA_MIN, n)))
    setAreaDraft(null)
  }

  const sliderPct = area < AREA_MIN ? 0 : ((area - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100

  /* ======================================================================
     MOBILE: bottom sheet
     ====================================================================== */
  if (isMobile) {
    const showAreaError = areaError && area < AREA_MIN

    const handleCalculate = () => {
      if (!ready) {
        setAreaError(true)
        areaFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      setPage(2)
    }

    return createPortal(
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          style={{ maxHeight: '92dvh' }}
          className={cn(
            'gcc-sheet-in fixed inset-x-0 bottom-0 flex max-h-[92vh] flex-col overflow-hidden rounded-t-[16px] border border-b-0 border-[#CCC5B9] outline-none',
            page === 1 ? 'bg-white' : 'bg-gradient-to-b from-[#6F1D1B] to-[#3A0F0E]'
          )}
        >
          {page === 1 ? (
            <>
              {/* ---------- Page 1: Project Details (203:4156) ---------- */}
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6 pt-6">
                <p
                  id={titleId}
                  style={DISPLAY}
                  className="text-[22px] font-semibold leading-[28px] tracking-[-0.11px] text-[#252422]"
                >
                  Project Details
                </p>

                {/* Project type */}
                <div className="flex flex-col gap-[10px]" role="radiogroup" aria-label="Project Type">
                  <FieldLabel>Project Type</FieldLabel>
                  {PROJECT_OPTIONS.map((o) => (
                    <SheetOption
                      key={o.id}
                      label={o.label}
                      icon={o.icon}
                      selected={type === o.id}
                      onSelect={() => setType(o.id)}
                    />
                  ))}
                </div>

                {/* Total area */}
                <div ref={areaFieldRef} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <FieldLabel id={areaLabelId}>Total Area (Sq Ft)</FieldLabel>
                    <div
                      className={cn(
                        'flex items-baseline gap-[6px] rounded-[8px] border bg-[#FFFCF2] px-[14px] py-2 focus-within:border-[#6F1D1B]',
                        showAreaError ? 'border-[#C0392B]' : 'border-[#CCC5B9]'
                      )}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        aria-labelledby={areaLabelId}
                        value={areaDraft ?? (area ? area.toLocaleString('en-IN') : '0')}
                        onFocus={(e) => {
                          setAreaDraft(area ? String(area) : '')
                          e.currentTarget.select()
                        }}
                        onChange={(e) => setAreaDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
                        onBlur={commitAreaDraft}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.currentTarget.blur()
                        }}
                        style={DISPLAY}
                        className="w-[64px] bg-transparent text-right text-[22px] font-semibold leading-[28px] tracking-[-0.11px] text-[#252422] outline-none"
                      />
                      <span style={BODY} className="text-[14px] font-medium leading-[20px] text-[#403D39]">
                        sq ft
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="gcc-range"
                    aria-labelledby={areaLabelId}
                    min={AREA_MIN}
                    max={AREA_MAX}
                    step={AREA_STEP}
                    value={Math.max(area, AREA_MIN)}
                    style={{ ['--p' as string]: `${sliderPct}%` }}
                    onChange={(e) => {
                      setAreaDraft(null)
                      setArea(Number(e.target.value))
                    }}
                  />
                  <div
                    style={BODY}
                    className="flex justify-between text-[14px] font-medium leading-[20px] text-[#403D39]"
                  >
                    <span>{AREA_MIN.toLocaleString('en-IN')}</span>
                    <span>{AREA_MAX.toLocaleString('en-IN')}</span>
                  </div>
                  {showAreaError && (
                    <p role="alert" style={BODY} className="text-[13px] font-medium leading-[18px] text-[#C0392B]">
                      Please choose an area of at least {AREA_MIN} sq ft.
                    </p>
                  )}
                </div>

                {/* Floors */}
                <div className="flex flex-col gap-[10px]" role="radiogroup" aria-labelledby={floorsLabelId}>
                  <FieldLabel id={floorsLabelId}>Number of Floors</FieldLabel>
                  <div className="flex gap-[10px]">
                    {[1, 2, 3, 4].map((f) => (
                      <SheetPill key={f} label={String(f)} selected={floors === f} onSelect={() => setFloors(f)} />
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="flex flex-col gap-[10px]">
                  <FieldLabel>Number of Bedrooms</FieldLabel>
                  <Stepper
                    compact
                    label="bedrooms"
                    value={bedrooms}
                    min={COUNT_MIN}
                    max={COUNT_MAX}
                    onChange={setBedrooms}
                  />
                </div>

                {/* Bathrooms */}
                <div className="flex flex-col gap-[10px]">
                  <FieldLabel>Number of Bathrooms</FieldLabel>
                  <Stepper
                    compact
                    label="bathrooms"
                    value={bathrooms}
                    min={COUNT_MIN}
                    max={COUNT_MAX}
                    onChange={setBathrooms}
                  />
                </div>

                {/* Interior finishing */}
                <div className="flex items-center gap-3">
                  <Toggle checked={interior} onChange={setInterior} labelId={interiorLabelId} />
                  <span id={interiorLabelId} style={BODY} className="text-[14px] leading-[24px] text-[#252422]">
                    Include Interior Finishing
                  </span>
                </div>
              </div>

              {/* Sticky Calculate button (203:4712) */}
              <div
                className="shrink-0 bg-white p-4 shadow-[0_-8px_16px_rgba(37,36,34,0.06)]"
                style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
              >
                <button
                  type="button"
                  onClick={handleCalculate}
                  style={BODY}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[#6F1D1B] py-[15px] pl-6 pr-5 text-[18px] font-bold leading-[28px] tracking-[-0.36px] text-white transition-colors hover:bg-[#5a1716] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E06422]"
                >
                  Calculate
                  <ChevronRightIcon />
                </button>
              </div>
            </>
          ) : (
            /* ---------- Page 2: Rough Estimate (203:4201) ---------- */
            <div
              className="flex flex-1 flex-col gap-[18px] overflow-y-auto px-5 pt-6"
              style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    aria-label="Back to project details"
                    className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 text-[#FFFCF2] transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFE6A7]"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <p
                    id={titleId}
                    style={DISPLAY}
                    className="text-[22px] font-semibold leading-[28px] tracking-[-0.11px] text-[#FFFCF2]"
                  >
                    Rough Estimate
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close estimator"
                  className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 text-[#FFFCF2] transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFE6A7]"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col gap-[2px]" aria-live="polite">
                <p style={BODY} className="text-[14px] font-medium leading-[20px] text-[#FFFCF2]/70">
                  Total Estimated Cost
                </p>
                <p
                  style={DISPLAY}
                  className="whitespace-nowrap text-[36px] font-semibold leading-[50px] tracking-[-0.88px] text-[#FFFCF2] min-[380px]:text-[44px]"
                >
                  ₹ {ready ? estimate.total.toLocaleString('en-IN') : '00'}
                </p>
              </div>

              {/* Split bar */}
              <div className="flex h-[10px] w-full gap-[3px] overflow-hidden rounded-[3px]" aria-hidden="true">
                {ready ? (
                  BREAKDOWN.filter((b) => estimate[b.key] > 0).map((b) => (
                    <div
                      key={b.key}
                      className="h-full rounded-[3px]"
                      style={{ width: `${(estimate[b.key] / estimate.total) * 100}%`, background: b.color }}
                    />
                  ))
                ) : (
                  <div className="h-full w-full rounded-[3px] bg-[#CCC5B9]" />
                )}
              </div>

              {/* Breakdown */}
              <div className="flex w-full flex-col">
                {BREAKDOWN.map((b) => (
                  <div key={b.key} className="flex items-center justify-between border-b border-[#FFFCF2]/[0.14] py-3">
                    <div className="flex items-center gap-[10px]">
                      <span className="size-[10px] shrink-0 rounded-[2px]" style={{ background: b.color }} />
                      <span style={BODY} className="text-[16px] leading-[24px] text-[#FFFCF2]/85">
                        {b.label}
                      </span>
                    </div>
                    <span style={BODY} className="whitespace-nowrap text-[16px] leading-[24px] text-[#FFFCF2]">
                      {inrSpaced(estimate[b.key])}
                    </span>
                  </div>
                ))}
              </div>

              {/* Locked detail */}
              <div className="flex w-full items-center gap-[10px] rounded-[8px] border border-dashed border-[#FFFCF2]/25 bg-white/5 px-[14px] py-3">
                <span className="text-[#FB8B24]">
                  <LockIcon size={20} />
                </span>
                <span
                  style={BODY}
                  className="whitespace-nowrap text-[14px] font-medium leading-[20px] text-[#FFFCF2]/85"
                >
                  Detailed breakdown
                </span>
              </div>

              {/* Disclaimer */}
              <div className="flex flex-col gap-[6px] rounded-[8px] bg-white/[0.08] p-[14px]">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[#FB8B24]">
                    <ShieldIcon size={20} />
                  </span>
                  <span style={BODY} className="text-[14px] font-medium leading-[20px] text-[#FFE6A7]">
                    Disclaimer
                  </span>
                </div>
                <p style={BODY} className="text-[14px] font-medium leading-[20px] text-[#FFFCF2]/75">
                  This is a rough estimate. Final costs may vary based on site conditions, material selections, and
                  local regulations.
                </p>
              </div>

              {/* CTA */}
              {ready ? (
                <a
                  href="#contact-cta"
                  onClick={onClose}
                  style={BODY}
                  className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#FFFCF2] py-[15px] pl-6 pr-5 text-[18px] font-bold leading-[28px] tracking-[-0.36px] text-[#252422] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE6A7]"
                >
                  Get Detailed Quote
                  <ChevronRightIcon />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  style={BODY}
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[8px] bg-[#CCC5B9] py-[15px] pl-6 pr-5 text-[18px] font-bold leading-[28px] tracking-[-0.36px] text-[#403D39] opacity-50"
                >
                  Get Detailed Quote
                  <ChevronRightIcon />
                </button>
              )}
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  }

  /* ======================================================================
     DESKTOP: two panels (unchanged)
     ====================================================================== */
  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          data-node-id="230:7408"
          className="relative flex w-full max-w-[1248px] flex-col overflow-hidden rounded-[16px] border border-[#CCC5B9] shadow-[0_2px_6px_rgba(37,36,34,0.06),0_16px_40px_rgba(37,36,34,0.1)] outline-none lg:flex-row"
        >
          {/* ========================= Project Details ========================= */}
          <div data-node-id="230:7409" className="flex min-w-0 flex-1 flex-col gap-8 bg-white p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <h2
                id={titleId}
                style={DISPLAY}
                className="text-[28px] font-semibold leading-[36px] tracking-[-0.36px] text-[#252422] sm:text-[36px] sm:leading-[44px]"
              >
                Home Construction Estimator
              </h2>
              {/* Close for small screens, where the estimate panel sits below */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close estimator"
                className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#252422]/10 text-[#252422] lg:hidden"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex w-full flex-col gap-[26px]">
              <p style={DISPLAY} className="text-[22px] font-semibold leading-[28px] tracking-[-0.11px] text-[#252422]">
                Project Details
              </p>

              {/* Project type */}
              <div className="flex flex-col gap-3" role="radiogroup" aria-label="Project Type">
                <FieldLabel>Project Type</FieldLabel>
                <div className="flex gap-3">
                  {PROJECT_OPTIONS.map((o) => (
                    <OptionCard
                      key={o.id}
                      label={o.label}
                      icon={o.icon}
                      selected={type === o.id}
                      onSelect={() => setType(o.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Total area */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FieldLabel id={areaLabelId}>Total Area (Sq Ft)</FieldLabel>
                  <div className="flex items-baseline gap-[6px] rounded-[8px] border border-[#CCC5B9] bg-[#FFFCF2] px-[14px] py-2 focus-within:border-[#6F1D1B]">
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-labelledby={areaLabelId}
                      value={areaDraft ?? (area ? area.toLocaleString('en-IN') : '0')}
                      onFocus={(e) => {
                        setAreaDraft(area ? String(area) : '')
                        e.currentTarget.select()
                      }}
                      onChange={(e) => setAreaDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
                      onBlur={commitAreaDraft}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur()
                      }}
                      style={DISPLAY}
                      className="w-[64px] bg-transparent text-right text-[22px] font-semibold leading-[28px] tracking-[-0.11px] text-[#252422] outline-none"
                    />
                    <span style={BODY} className="text-[14px] font-medium leading-[20px] text-[#403D39]">
                      sq ft
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  className="gcc-range"
                  aria-labelledby={areaLabelId}
                  min={AREA_MIN}
                  max={AREA_MAX}
                  step={AREA_STEP}
                  value={Math.max(area, AREA_MIN)}
                  style={{ ['--p' as string]: `${sliderPct}%` }}
                  onChange={(e) => {
                    setAreaDraft(null)
                    setArea(Number(e.target.value))
                  }}
                />
                <div style={BODY} className="flex justify-between text-[14px] font-medium leading-[20px] text-[#403D39]">
                  <span>{AREA_MIN.toLocaleString('en-IN')}</span>
                  <span>{AREA_MAX.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Floors */}
              <div className="flex flex-col gap-3" role="radiogroup" aria-labelledby={floorsLabelId}>
                <FieldLabel id={floorsLabelId}>Number of Floors</FieldLabel>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((f) => (
                    <ChoicePill key={f} label={String(f)} selected={floors === f} onSelect={() => setFloors(f)} />
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-3">
                  <FieldLabel>Number of Bedrooms</FieldLabel>
                  <Stepper label="bedrooms" value={bedrooms} min={COUNT_MIN} max={COUNT_MAX} onChange={setBedrooms} />
                </div>
                <div className="flex min-w-0 flex-col gap-3">
                  <FieldLabel>Number of Bathrooms</FieldLabel>
                  <Stepper label="bathrooms" value={bathrooms} min={COUNT_MIN} max={COUNT_MAX} onChange={setBathrooms} />
                </div>
              </div>

              {/* Interior finishing */}
              <div className="flex items-center gap-3">
                <Toggle checked={interior} onChange={setInterior} labelId={interiorLabelId} />
                <span id={interiorLabelId} style={BODY} className="text-[16px] leading-[24px] text-[#252422]">
                  Include Interior Finishing
                </span>
              </div>
            </div>
          </div>

          {/* ========================= Rough Estimate ========================= */}
          <div
            data-node-id="230:7449"
            className="flex w-full shrink-0 flex-col gap-6 bg-gradient-to-b from-[#6F1D1B] to-[#3A0F0E] p-6 sm:p-10 lg:w-[560px]"
          >
            <div className="flex items-center justify-between">
              <p style={DISPLAY} className="text-[22px] font-semibold leading-[28px] tracking-[-0.11px] text-[#FFFCF2]">
                Rough Estimate
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close estimator"
                className="hidden size-[32px] cursor-pointer items-center justify-center rounded-full bg-white/20 text-[#FFFCF2] transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFE6A7] lg:flex"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col gap-1" aria-live="polite">
              <p style={BODY} className="text-[14px] font-medium leading-[20px] text-[#FFFCF2]/70">
                Total Estimated Cost
              </p>
              <p
                style={DISPLAY}
                className="whitespace-nowrap text-[40px] font-semibold leading-[48px] tracking-[-1.2px] text-[#FFFCF2] sm:text-[60px] sm:leading-[64px]"
              >
                ₹ {ready ? estimate.total.toLocaleString('en-IN') : '00'}
              </p>
            </div>

            {/* Split bar */}
            <div className="flex h-[10px] w-full gap-[2px] overflow-hidden rounded-[3px]" aria-hidden="true">
              {ready ? (
                BREAKDOWN.filter((b) => estimate[b.key] > 0).map((b) => (
                  <div
                    key={b.key}
                    className="h-full rounded-[3px] transition-[width] duration-500 ease-out"
                    style={{ width: `${(estimate[b.key] / estimate.total) * 100}%`, background: b.color }}
                  />
                ))
              ) : (
                <div className="h-full w-full rounded-[3px] bg-[#CCC5B9]" />
              )}
            </div>

            {/* Breakdown */}
            <div className="flex w-full flex-col">
              {BREAKDOWN.map((b) => (
                <div key={b.key} className="flex items-center justify-between border-b border-[#FFFCF2]/[0.14] py-3">
                  <div className="flex items-center gap-[10px]">
                    <span className="size-[10px] shrink-0 rounded-[2px]" style={{ background: b.color }} />
                    <span style={BODY} className="text-[16px] leading-[24px] text-[#FFFCF2]/85">
                      {b.label}
                    </span>
                  </div>
                  <span style={BODY} className="text-[16px] leading-[24px] text-[#FFFCF2]">
                    {inr(estimate[b.key])}
                  </span>
                </div>
              ))}
            </div>

            {/* Locked detail */}
            <div className="flex w-full items-center gap-3 rounded-[8px] border border-dashed border-[#FFFCF2]/25 bg-white/5 px-[14px] py-3">
              <span className="text-[#FB8B24]">
                <LockIcon />
              </span>
              <span style={BODY} className="whitespace-nowrap text-[14px] font-medium leading-[20px] text-[#FFFCF2]/85">
                Detailed breakdown
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-[6px]" aria-hidden="true">
                <span className="h-[8px] w-[56px] rounded-[4px] bg-[#FFFCF2]/[0.22] blur-[1px]" />
                <span className="h-[8px] w-[88px] rounded-[4px] bg-[#FFFCF2]/[0.22] blur-[1px]" />
                <span className="h-[8px] w-[40px] rounded-[4px] bg-[#FFFCF2]/[0.22] blur-[1px]" />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex flex-col gap-[6px] rounded-[8px] bg-white/[0.08] p-[14px]">
              <div className="flex items-center gap-2">
                <span className="text-[#FB8B24]">
                  <ShieldIcon size={22} />
                </span>
                <span style={BODY} className="text-[14px] font-medium leading-[20px] text-[#FFE6A7]">
                  Disclaimer
                </span>
              </div>
              <p style={BODY} className="text-[14px] font-medium leading-[20px] text-[#FFFCF2]/75">
                This is a rough estimate. Final costs may vary based on site conditions, material selections, and local
                regulations.
              </p>
            </div>

            {/* CTA: disabled until an area is chosen */}
            {ready ? (
              <a
                href="#contact-cta"
                onClick={onClose}
                style={BODY}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#FFFCF2] py-[14px] pl-6 pr-5 text-[18px] font-bold leading-[28px] tracking-[-0.36px] text-[#252422] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE6A7]"
              >
                Get Detailed Quote
                <ChevronRightIcon />
              </a>
            ) : (
              <button
                type="button"
                disabled
                style={BODY}
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[8px] bg-[#CCC5B9] py-[14px] pl-6 pr-5 text-[18px] font-bold leading-[28px] tracking-[-0.36px] text-[#403D39] opacity-50"
              >
                Get Detailed Quote
                <ChevronRightIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* -------------------------------------------------------------------------
   Section (banner unchanged)
   ------------------------------------------------------------------------- */
export function CostCalculatorSection() {
  const [bannerRef, bannerIn] = useInViewOnce<HTMLDivElement>(0.2)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="cost-calculator"
        data-node-id="211:6073"
        aria-label="Home Construction Cost Estimator"
        className="relative z-10 -mt-px w-full bg-[#FFFCF2] pt-8 pb-[72px] sm:pt-12 sm:pb-[80px] lg:py-14 px-4 sm:px-6 md:px-[96px] lg:px-[6rem]"
      >
        <div ref={bannerRef} className="mx-auto max-w-[1248px] w-full">
          {/* MOBILE CARD LAYOUT (Figma Node 214:6149) */}
          <div
            data-node-id="214:6149"
            className={`md:hidden relative w-full max-w-[350px] mx-auto h-[464px] rounded-[12px] bg-[#701E1C] overflow-hidden p-[20px] flex flex-col justify-between shadow-md transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              bannerIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {/* Background Arch Pattern (Figma Node 214:6150) */}
            <div
              data-node-id="214:6150"
              className="pointer-events-none absolute -bottom-[50px] left-0 w-[626px] h-[157px] select-none overflow-hidden"
              aria-hidden="true"
            >
              <img
                src="/assets/images/how-we-build/calculator-design.webp"
                alt=""
                className="w-full h-full object-contain object-left-bottom pointer-events-none select-none"
                loading="lazy"
              />
            </div>

            <div
              data-node-id="214:6180"
              className="relative z-10 w-full h-[136px] rounded-[8px] overflow-hidden shrink-0 bg-[#E1DCDC] shadow-inner"
            >
              <img
                src="/assets/images/how-we-build/calculator-img.webp"
                alt="Home Construction Cost Preview"
                className="w-full h-full object-cover object-center block select-none pointer-events-none"
                loading="lazy"
              />
            </div>

            <div className="relative z-10 flex flex-col items-start">
              <h3
                data-node-id="214:6184"
                style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                className="m-0 text-white text-[36px] font-semibold leading-[44px] tracking-[-0.36px] text-left"
              >
                Home <br />
                Construction <br />
                Estimator
              </h3>
            </div>

            <div className="relative z-10 w-full">
              <button
                type="button"
                data-node-id="214:6185"
                onClick={() => setIsModalOpen(true)}
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                className="w-full h-[56px] rounded-[8px] bg-[#FFFCF2] hover:bg-white active:bg-[#F5F0E6] text-[#252422] text-[18px] font-bold leading-[28px] tracking-[-0.36px] flex items-center justify-center gap-[8px] shadow-sm transition-colors cursor-pointer border-none"
              >
                <span>Calculate now</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[20px]"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* DESKTOP BANNER LAYOUT (Figma Node 211:6073) */}
          <div
            data-node-id="211:6073"
            className={`hidden md:flex relative w-full min-h-[160px] rounded-[12px] bg-[#701E1C] overflow-hidden flex-row items-center justify-between py-[12px] pl-[12px] pr-4 sm:pr-[30px] gap-6 md:gap-[30px] shadow-md transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              bannerIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div
              className="pointer-events-none absolute right-0 top-0 h-full select-none overflow-hidden"
              aria-hidden="true"
            >
              <img
                src="/assets/images/how-we-build/calculator-design.webp"
                alt=""
                className="h-full w-auto max-w-none object-cover object-right"
                loading="lazy"
              />
            </div>

            <div className="relative z-10 flex flex-row items-center gap-[30px] w-auto">
              <div className="relative w-[206px] h-[136px] rounded-[12px] overflow-hidden shrink-0 bg-[#E1DCDC] shadow-inner">
                <img
                  src="/assets/images/how-we-build/calculator-img.webp"
                  alt="Home Construction Cost Preview"
                  className="w-full h-full object-cover object-left block select-none pointer-events-none"
                  loading="lazy"
                />
              </div>

              <h3
                style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                className="text-white text-[30px] lg:text-[36px] font-semibold leading-[1.2] lg:leading-[44px] tracking-[-0.36px] text-left shrink-0 max-w-[340px]"
              >
                Home Construction <br />
                Estimator
              </h3>
            </div>

            <div className="relative z-10 w-auto flex justify-end shrink-0">
              <Button
                variant="on-dark"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-[226px] h-[56px] text-[18px] font-bold rounded-[8px] tracking-[-0.36px] shadow-sm cursor-pointer"
              >
                Calculate now
              </Button>
            </div>
          </div>
        </div>

        {isModalOpen && <EstimatorModal onClose={() => setIsModalOpen(false)} />}
      </section>
    </>
  )
}

export default CostCalculatorSection