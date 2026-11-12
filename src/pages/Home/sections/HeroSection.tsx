import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { REVEAL_OPTIONS, revealClass, revealDelay, useInViewOnce } from '@/hooks/useInViewOnce'
import { submitLead } from '@/lib/supabase'
import heroHome from '/assets/images/hero-home.webp'
import heroHomeMobile from '/assets/images/hero-home-mobile.webp'
import heroPlane from '/assets/images/hero-plane.webp'

// Digits only, with country code and no "+" (e.g. 919876543210). Replace when you have the number.
const WHATSAPP_NUMBER = '91XXXXXXXXXX'
const WHATSAPP_MESSAGE = 'Hi, I would like to talk to an engineer about my project.'
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const bai = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hanken = { fontFamily: '"Hanken Grotesk", sans-serif' }

const fieldLabel = 'flex w-full flex-col gap-2 text-sm font-medium leading-5 text-[#403D39]'
const fieldInput =
  'w-full rounded-md border border-[#CCC5B9] bg-[#FFFCF2] py-3.5 pl-4 pr-3.5 text-base leading-6 text-[#403D39] outline-none placeholder:text-[#403D39]/70 focus:border-[#6F1D1B]'

// Only opacity/transform, so it never fights the bar's size/position animation
const REVEAL_BAR =
  'transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'

// Width of the white fields panel when the floating bar is expanded in the corner
const CORNER_PANEL_MAX_W = 780
const CORNER_PANEL_VW = 0.62

// Floating bar sizing minimums
const LEFT_MIN = 210
const EXPANDED_EXTRA = 156

// Floating bar: corner offset and scroll range over which it smoothly collapses
const FLOAT_OFFSET = 16
const SCROLL_DIST_MIN = 200
const SCROLL_DIST_MAX = 300
const SCROLL_DIST_VH = 0.28

// How far the hero must scroll away before the bar starts collapsing (fraction of viewport height).
// 0 = when the next section first appears, 0.5 = hero's bottom edge at mid-screen, 1 = hero fully scrolled past.
const COLLAPSE_START_VH = 0.5

// Frame-rate independent damping speeds (higher = snappier, lower = softer)
const SCROLL_DAMPING = 16
const EXPAND_DAMPING = 10

// Sits above everything on the page
const FLOAT_Z = 2147483000

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const round2 = (n: number) => Math.round(n * 100) / 100
// Blends linear + smoothstep: immediate visual response on scroll start, soft settle at ends
const easeScroll = (t: number) => 0.45 * t + 0.55 * (t * t * (3 - 2 * t))

const EMPTY_SUBSCRIBE = () => () => {}

function HeroMobile() {
  const [headRef, headIn] = useInViewOnce<HTMLDivElement>(0.2, REVEAL_OPTIONS)
  const [formRef, formIn] = useInViewOnce<HTMLFormElement>(0.2, REVEAL_OPTIONS)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    const result = await submitLead({
      fullName: (formData.get('name') as string) || '',
      phone: (formData.get('phone') as string) || '',
      locationPin: (formData.get('pincode') as string) || '',
      projectType: (formData.get('type') as string) || '',
      source: 'hero_mobile',
    })

    setIsSubmitting(false)
    if (result.success) {
      setSubmitted(true)
      form.reset()
      setTimeout(() => setSubmitted(false), 5000)
    } else {
      setSubmitError(result.error || 'Failed to submit enquiry. Please try again.')
    }
  }

  return (
    <section
      id="hero-mobile"
      style={hanken}
      className="relative z-[1] -mb-px bg-[#FFFCF2] px-3 pb-10 pt-3 lg:hidden"
    >
      {/* Image card (Figma: 366 x 701, radius 12) */}
      <div className="relative isolate h-[701px] w-full overflow-hidden rounded-xl bg-[#347DA6]">
        <img
          src={heroHomeMobile}
          alt="Engineer holding a model home above a family playing on the lawn"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[46%_0%] pointer-events-none select-none"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          draggable={false}
        />
        {/* Shade */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(37,36,34,0.72) 0%, rgba(37,36,34,0.15) 42%, rgba(37,36,34,0) 70%, rgba(37,36,34,0.35) 100%)',
          }}
        />

        {/* Headline (Figma top: 96px; nav above it is your existing navbar) */}
        <div
          ref={headRef}
          className="absolute inset-x-4 top-24 flex flex-col items-center gap-3.5 text-center text-white"
        >
          <h1
            style={bai}
            className="text-[40px] font-bold uppercase leading-none tracking-[-0.4px]"
          >
            <span
              style={revealDelay(headIn, 150)}
              className={`block ${revealClass(headIn)}`}
            >
              Engineered
            </span>
            <span
              style={revealDelay(headIn, 300)}
              className={`block text-[#FFE6A7] ${revealClass(headIn)}`}
            >
              right.
            </span>
            <span
              style={revealDelay(headIn, 450)}
              className={`block ${revealClass(headIn)}`}
            >
              Executed
            </span>
            <span
              style={revealDelay(headIn, 600)}
              className={`block text-[#FFE6A7] ${revealClass(headIn)}`}
            >
              responsibly.
            </span>
          </h1>
          <p
            style={revealDelay(headIn, 800)}
            className={`text-base leading-6 ${revealClass(headIn)}`}
          >
            One team. Every stage. From engineering to construction and handover.
          </p>
        </div>
      </div>

      {/* Lead form, overlaps the image by 88px */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={revealDelay(formIn, 0)}
        className={`relative z-10 mx-3 -mt-[88px] flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_6px_rgba(37,36,34,0.06),0_16px_40px_rgba(37,36,34,0.1)] ${revealClass(formIn)}`}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase leading-4 tracking-[0.96px] text-[#E06422]">
            Let’s talk
          </p>
          <p style={bai} className="text-[22px] font-semibold leading-7 tracking-[-0.11px] text-[#252422]">
            Talk to an engineer
          </p>
          <p className="text-sm font-medium leading-5 text-[#403D39]">Free 30-min consultation</p>
        </div>

        {submitError && (
          <div className="rounded-md border border-red-500/30 bg-red-50 p-2 text-xs text-red-700">
            {submitError}
          </div>
        )}

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#22C55E]/20 text-[#22C55E]">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-[#252422]">Thank you! Enquiry received.</p>
            <p className="text-xs text-[#403D39]">Our engineer will connect with you shortly.</p>
          </div>
        ) : (
          <>
            <label className={fieldLabel}>
              Type
              <span className="relative block">
                <select
                  name="type"
                  defaultValue="Villa House"
                  className={`${fieldInput} appearance-none pr-11 text-[#403D39]/70`}
                >
                  <option value="Villa House">Villa House</option>
                  <option value="Farmhouse">Farmhouse</option>
                  <option value="Renovation">Renovation</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#403D39]"
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </label>

            <label className={fieldLabel}>
              Name
              <input
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={60}
                pattern="^[A-Za-z\s.'-]+$"
                title="Please enter your full name (letters and spaces only)"
                autoComplete="name"
                placeholder="Enter your full name"
                className={fieldInput}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s.'-]/g, '')
                }}
              />
            </label>

            <label className={fieldLabel}>
              Phone Number
              <input
                name="phone"
                type="tel"
                required
                inputMode="numeric"
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                title="Please enter a valid 10-digit mobile number"
                autoComplete="tel-national"
                placeholder="e.g. 98765 43210"
                className={fieldInput}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10)
                }}
              />
            </label>

            <label className={fieldLabel}>
              Pin Code
              <input
                name="pincode"
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                pattern="[1-9][0-9]{5}"
                title="Please enter a valid 6-digit Indian PIN code"
                placeholder="Enter 6-digit code"
                className={fieldInput}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 6)
                }}
              />
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              className={isSubmitting ? 'opacity-70 cursor-wait' : ''}
            >
              {isSubmitting ? 'Submitting...' : 'Book a Consultation'}
            </Button>
          </>
        )}
      </form>
    </section>
  )
}

const EMPTY_FORM = { type: 'Villa House', name: '', phone: '', pincode: '' }

/**
 * left / docBottom / width : where the hero slot is in the DOCUMENT (used while the bar sits in the hero,
 *                            so it scrolls natively with the page and never lags).
 * right / bottom           : where the hero slot is in the VIEWPORT (used only for the moment the bar
 *                            switches to fixed, and for the glide back).
 */
export function HeroSection() {
  const [headRef, headIn] = useInViewOnce<HTMLDivElement>(0.2, REVEAL_OPTIONS)
  const [slotRef, barIn] = useInViewOnce<HTMLDivElement>(0.2, REVEAL_OPTIONS) // empty slot in the hero that holds the bar's space
  const innerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const waRef = useRef<HTMLAnchorElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const animRef = useRef({
    scrollP: 0,
    targetScrollP: 0,
    cornerExpand: 0,
    cornerOpen: false,
    hovered: false,
    focused: false,
    floating: false,
    panelInteractive: true,
    initialized: false,
    rafId: 0,
    lastTime: 0,
  })
  const wakeAnimRef = useRef<() => void>(() => {})

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Field values live here so they survive the bar changing state
  const [values, setValues] = useState(EMPTY_FORM)
  const setField = (key: keyof typeof EMPTY_FORM, value: string) =>
    setValues((v) => ({ ...v, [key]: value }))

  // Discrete states synced only when crossing thresholds (never on scroll frames)
  const mounted = useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => true,
    () => false,
  )
  const [floating, setFloating] = useState(false)
  const [panelInteractive, setPanelInteractive] = useState(true)
  const [barHeight, setBarHeight] = useState(0)

  // Continuous scroll-linked + hover/click-expand animation loop (direct DOM updates, zero scroll-frame React re-renders)
  useEffect(() => {
    if (!mounted) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const anim = animRef.current
    const cachedSizes = {
      leftW: LEFT_MIN,
      waW: 117,
      rootFs: parseFloat(getComputedStyle(document.documentElement).fontSize) || 16,
    }

    // Last known mouse position (viewport coords). Hover is evaluated inside step().
    const mouse = { x: -1, y: -1 }

    const measureParts = () => {
      if (leftRef.current) {
        cachedSizes.leftW = Math.max(LEFT_MIN, Math.ceil(leftRef.current.offsetWidth))
      }
      if (waRef.current) {
        cachedSizes.waW = Math.ceil(waRef.current.offsetWidth) || 117
      }
      cachedSizes.rootFs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    }

    const step = (now: number, snap = false) => {
      anim.rafId = 0
      const slot = slotRef.current
      const inner = innerRef.current
      const panel = panelRef.current
      if (!slot || !inner || !panel) return

      // --- READ PHASE ---
      const r = slot.getBoundingClientRect()
      if (r.width === 0) {
        inner.style.display = 'none'
        inner.style.position = 'fixed'
        inner.style.visibility = 'hidden'
        inner.style.pointerEvents = 'none'
        return
      }
      if (inner.style.display === 'none') {
        inner.style.display = 'block'
        measureParts()
      }

      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight
      const scrollX = window.scrollX
      const scrollY = window.scrollY

      const slotDocLeft = r.left + scrollX
      const slotDocBottom = r.bottom + scrollY
      const slotWidth = r.width
      const slotRight = vw - r.right

      // Begin collapsing only after the hero has mostly scrolled away
      const heroEl = heroRef.current
      const heroDocBottom = heroEl
        ? heroEl.getBoundingClientRect().bottom + scrollY
        : slotDocBottom
      const scrollStart = Math.max(0, heroDocBottom - vh + vh * COLLAPSE_START_VH)
      const scrollDist = Math.min(SCROLL_DIST_MAX, Math.max(SCROLL_DIST_MIN, Math.round(vh * SCROLL_DIST_VH)))
      const targetScrollP = clamp01((scrollY - scrollStart) / scrollDist)
      anim.targetScrollP = targetScrollP

      const liveSlotBottom = vh - r.bottom
      const slotBottomAtStart = vh - (slotDocBottom - scrollStart)

      const { leftW, waW, rootFs } = cachedSizes
      // Exact collapsed width: 9px form left pad + left block + 0.75rem form gap + 0.375rem form right pad + 0.75rem outer gap + WhatsApp card + 2px buffer
      const collapsedWidth = Math.ceil(leftW + waW + 9 + 1.875 * rootFs + 2)
      const cornerExpandedWidth = Math.min(
        vw - FLOAT_OFFSET * 2,
        leftW + EXPANDED_EXTRA + Math.min(vw * CORNER_PANEL_VW, CORNER_PANEL_MAX_W),
      )

      // --- ANIMATE PHASE ---
      const instant = snap || !anim.initialized || reducedMotion.matches
      const dt = anim.lastTime ? Math.min(0.05, Math.max(0.001, (now - anim.lastTime) / 1000)) : 1 / 60
      anim.lastTime = now

      if (instant) {
        anim.scrollP = targetScrollP
        anim.initialized = true
      } else {
        const scrollAlpha = 1 - Math.exp(-SCROLL_DAMPING * dt)
        anim.scrollP += (targetScrollP - anim.scrollP) * scrollAlpha
        if (Math.abs(targetScrollP - anim.scrollP) < 0.0005) {
          anim.scrollP = targetScrollP
        }
      }

      // Reset toggle/focus once docked back inside the hero
      if (anim.scrollP === 0 && targetScrollP === 0 && (anim.cornerOpen || anim.focused)) {
        anim.cornerOpen = false
        anim.focused = false
      }

      // Hover: is the mouse currently over the bar (only matters while it floats in the corner)?
      if (anim.scrollP > 0.02 && mouse.x >= 0) {
        const b = inner.getBoundingClientRect()
        anim.hovered =
          mouse.x >= b.left && mouse.x <= b.right && mouse.y >= b.top && mouse.y <= b.bottom
      } else {
        anim.hovered = false
      }

      const targetExpand =
        (anim.cornerOpen || anim.focused || anim.hovered) && anim.scrollP > 0.02 ? 1 : 0
      if (instant) {
        anim.cornerExpand = targetExpand
      } else {
        const expandAlpha = 1 - Math.exp(-EXPAND_DAMPING * dt)
        anim.cornerExpand += (targetExpand - anim.cornerExpand) * expandAlpha
        if (Math.abs(targetExpand - anim.cornerExpand) < 0.0005) {
          anim.cornerExpand = targetExpand
        }
      }

      // --- WRITE PHASE ---
      const easedP = easeScroll(anim.scrollP)
      const openness = clamp01(1 - easedP * (1 - anim.cornerExpand))
      const panelOpacity = clamp01((openness - 0.18) / 0.82)

      if (anim.scrollP === 0) {
        inner.style.position = 'absolute'
        inner.style.left = `${round2(slotDocLeft)}px`
        inner.style.top = `${round2(slotDocBottom)}px`
        inner.style.right = 'auto'
        inner.style.bottom = 'auto'
        inner.style.transform = 'translateY(-100%)'
        inner.style.width = `${round2(slotWidth)}px`
        inner.style.maxWidth = 'none'
      } else {
        const expandedW = lerp(slotWidth, cornerExpandedWidth, easedP)
        const currentWidth = lerp(collapsedWidth, expandedW, openness)
        const currentRight = lerp(slotRight, FLOAT_OFFSET, easedP)
        const anchorBottom = Math.min(liveSlotBottom, slotBottomAtStart)
        const currentBottom = lerp(anchorBottom, FLOAT_OFFSET, easedP)

        inner.style.position = 'fixed'
        inner.style.left = 'auto'
        inner.style.top = 'auto'
        inner.style.right = `${round2(currentRight)}px`
        inner.style.bottom = `${round2(currentBottom)}px`
        inner.style.transform = 'none'
        inner.style.width = `${round2(currentWidth)}px`
        inner.style.maxWidth = `calc(100vw - ${FLOAT_OFFSET * 2}px)`
      }

      inner.style.visibility = 'visible'
      inner.style.pointerEvents = 'auto'

      panel.style.opacity = `${round2(panelOpacity)}`
      const isInteractive = openness > 0.35
      panel.style.pointerEvents = isInteractive ? 'auto' : 'none'

      // Sync discrete React booleans only when they actually flip
      const nextFloating = anim.scrollP > 0.02
      if (nextFloating !== anim.floating) {
        anim.floating = nextFloating
        setFloating(nextFloating)
      }
      if (isInteractive !== anim.panelInteractive) {
        anim.panelInteractive = isInteractive
        setPanelInteractive(isInteractive)
      }

      const needsMoreFrames =
        !instant &&
        (Math.abs(targetScrollP - anim.scrollP) > 0.0005 ||
          Math.abs(targetExpand - anim.cornerExpand) > 0.0005)

      if (needsMoreFrames) {
        anim.rafId = requestAnimationFrame((t) => step(t, false))
      } else {
        anim.lastTime = 0
      }
    }

    const schedule = () => {
      if (!anim.rafId) {
        anim.rafId = requestAnimationFrame((t) => step(t, false))
      }
    }

    const handleResize = () => {
      measureParts()
      step(performance.now(), true)
    }

    // Track the mouse; step() decides whether it is over the bar
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      schedule()
    }
    const onMouseLeaveDoc = () => {
      mouse.x = -1
      mouse.y = -1
      schedule()
    }

    wakeAnimRef.current = schedule
    measureParts()
    step(performance.now(), true)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onMouseLeaveDoc)

    const ro = new ResizeObserver(() => {
      measureParts()
      schedule()
    })
    if (slotRef.current) ro.observe(slotRef.current)
    if (heroRef.current) ro.observe(heroRef.current)
    if (leftRef.current) ro.observe(leftRef.current)
    if (waRef.current) ro.observe(waRef.current)

    return () => {
      wakeAnimRef.current = () => {}
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseLeaveDoc)
      ro.disconnect()
      if (anim.rafId) {
        cancelAnimationFrame(anim.rafId)
        anim.rafId = 0
      }
    }
  }, [mounted, slotRef])

  // Remember the bar's height so the hero slot keeps its exact space
  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const measure = () => setBarHeight(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mounted])

  // Collapse when clicking/tapping outside the floating bar
  useEffect(() => {
    if (!floating) return
    const onPointerDown = (e: PointerEvent) => {
      if (innerRef.current && !innerRef.current.contains(e.target as Node)) {
        animRef.current.cornerOpen = false
        animRef.current.focused = false
        wakeAnimRef.current()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [floating])

  const handleDesktopSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    const result = await submitLead({
      fullName: values.name,
      phone: values.phone,
      locationPin: values.pincode,
      projectType: values.type,
      source: 'hero_desktop',
    })

    setIsSubmitting(false)
    if (result.success) {
      setSubmitted(true)
      setValues(EMPTY_FORM)
      // The focused input is removed from the DOM, so its blur never fires: reset manually
      animRef.current.focused = false
      wakeAnimRef.current()
      setTimeout(() => setSubmitted(false), 5000)
    } else {
      setSubmitError(result.error || 'Failed to submit enquiry. Please try again.')
    }
  }

  // Click "Talk to an engineer" in the corner to expand or collapse (hover already expands it,
  // so a click while hovering does nothing and the bar never gets "stuck" open)
  const handleToggleCorner = () => {
    if (!animRef.current.floating) return
    if (animRef.current.hovered && !animRef.current.cornerOpen && !animRef.current.focused) return
    const nextOpen = !(animRef.current.cornerOpen || animRef.current.focused)
    animRef.current.cornerOpen = nextOpen
    if (!nextOpen) {
      animRef.current.focused = false
      const activeEl = document.activeElement
      if (activeEl instanceof HTMLElement && panelRef.current?.contains(activeEl)) {
        activeEl.blur()
      }
    }
    wakeAnimRef.current()
  }

  const tab = panelInteractive ? 0 : -1

  // Reveal on first view (if the page loads already scrolled past the hero, show it straight away)
  const barShown = barIn || floating

  const bar = (
    <div
      ref={innerRef}
      style={{ position: 'fixed', zIndex: FLOAT_Z, visibility: 'hidden', pointerEvents: 'none' }}
    >
      <div
        style={revealDelay(barShown, 500)}
        className={`flex w-full flex-row items-stretch gap-3 ${revealClass(barShown, REVEAL_BAR)}`}
      >
        {/* gap and padding are constant, so only the width animates (no layout shifting) */}
        <form
          onSubmit={handleDesktopSubmit}
          className="flex min-w-0 flex-1 flex-row items-center gap-3 overflow-hidden rounded-lg bg-[#FFE4A0] p-1.5 pl-[9px] shadow-lg"
        >
          {/* Left: image placeholder + heading (sizes to its text, never wraps or clips) */}
          <button
            ref={leftRef}
            type="button"
            onClick={handleToggleCorner}
            tabIndex={floating ? 0 : -1}
            aria-expanded={floating ? panelInteractive : undefined}
            className={`flex w-max min-w-[210px] shrink-0 items-center gap-[18px] whitespace-nowrap pr-2 text-left focus:outline-none ${
              floating ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-md bg-[#252422] text-[#FFE4A0] shadow-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 20a10 10 0 0 1 20 0" />
                <circle cx="12" cy="10" r="4" />
                <path d="M12 2v2" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-700">
                Let&apos;s talk
              </p>
              <p className="text-sm font-semibold text-slate-900">Talk to an engineer</p>
              <p className="text-[11px] text-slate-700">Free 30-min consultation</p>
            </div>
          </button>

          {/* Right: fields panel. Its width simply follows the bar's width, which is what animates.
              The content is a fixed, non-shrinking width and just gets clipped, so nothing reflows mid-animation. */}
          <div
            ref={panelRef}
            aria-hidden={!panelInteractive}
            onFocusCapture={() => {
              if (!animRef.current.floating) return
              animRef.current.focused = true
              animRef.current.cornerOpen = true
              wakeAnimRef.current()
            }}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                animRef.current.focused = false
                wakeAnimRef.current()
              }
            }}
            className="flex min-w-0 flex-1 overflow-hidden rounded-md [&>*]:min-w-[500px] [&>*]:shrink-0 [&>*]:grow"
          >
            {submitted ? (
              <div className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white p-4 text-xs font-semibold text-[#252422]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/20 text-[#22C55E]">
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Thank you! We have received your consultation request.</span>
              </div>
            ) : submitError ? (
              <div className="flex flex-1 items-center justify-between rounded-md bg-white p-3 text-xs text-red-700">
                <span>{submitError}</span>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  tabIndex={tab}
                  className="ml-2 font-medium text-[#6B1A1A] underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="flex flex-1 flex-row items-stretch gap-2 rounded-md bg-white p-2.5">
                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Type
                  <select
                    name="type"
                    value={values.type}
                    onChange={(e) => setField('type', e.target.value)}
                    tabIndex={tab}
                    className="h-7 rounded-md bg-[#EEF2F6] px-2.5 text-[10px] text-slate-800 outline-none"
                  >
                    <option value="Villa House">Villa House</option>
                    <option value="Farmhouse">Farmhouse</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Name
                  <input
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={60}
                    pattern="^[A-Za-z\s.'-]+$"
                    title="Please enter your full name (letters and spaces only)"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    tabIndex={tab}
                    value={values.name}
                    onChange={(e) => setField('name', e.target.value.replace(/[^a-zA-Z\s.'-]/g, ''))}
                    className="h-7 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-[10px] text-slate-800 outline-none placeholder:text-[#9A9A9A] focus:border-[#6B1A1A]"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Phone Number
                  <input
                    name="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    title="Please enter a valid 10-digit mobile number"
                    autoComplete="tel-national"
                    placeholder="e.g. 98765 43210"
                    tabIndex={tab}
                    value={values.phone}
                    onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="h-7 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-[10px] text-slate-800 outline-none placeholder:text-[#9A9A9A] focus:border-[#6B1A1A]"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Pin Code
                  <input
                    name="pincode"
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    pattern="[1-9][0-9]{5}"
                    title="Please enter a valid 6-digit Indian PIN code"
                    placeholder="Enter 6-digit code"
                    tabIndex={tab}
                    value={values.pincode}
                    onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-7 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-[10px] text-slate-800 outline-none placeholder:text-[#9A9A9A] focus:border-[#6B1A1A]"
                  />
                </label>

                {/* Stretches to the full label + input height */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Submit enquiry"
                  tabIndex={tab}
                  className={`flex w-[58px] items-center justify-center rounded-md bg-[#6B1A1A] text-white transition hover:bg-[#561414] ${
                    isSubmitting ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17L17 7M8.5 7H17v8.5" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* WhatsApp contact card */}
        <a
          ref={waRef}
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          className="flex w-[117px] shrink-0 flex-col justify-between overflow-hidden rounded-lg bg-[#0D8C27] px-4 py-3 text-white transition hover:bg-[#0b7a22]"
        >
          <div className="flex items-start justify-between">
            {/* WhatsApp logo */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>

            {/* Arrow up-right */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M8.5 7H17v8.5" />
            </svg>
          </div>

          <p className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.96px]">
            Contact
          </p>
        </a>
      </div>
    </div>
  )

  return (
    <>
      <HeroMobile />

      {/* Desktop: your original section, unchanged except `hidden … lg:flex` */}
      <section
        ref={heroRef}
        id="hero"
        className="relative isolate hidden min-h-[640px] flex-col overflow-hidden lg:flex lg:min-h-0 lg:aspect-[3/2]"
      >
        {/* Background */}
        <img
          src={heroHome}
          alt="Engineer holding a model home above a family playing on the lawn"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top pointer-events-none select-none"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          draggable={false}
        />

        {/* Plane */}
        <img
          src={heroPlane}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[87.5%] top-[28%] w-[4.5%] select-none"
        />

        {/* Headline */}
        <div
          ref={headRef}
          className="mx-auto max-w-5xl px-6 pt-28 text-center lg:pt-[9vw]"
        >
          <h1
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
            className="text-center text-4xl font-bold uppercase leading-[1.06] text-white sm:text-5xl lg:text-[length:min(4.3vw,62px)]"
          >
            <span
              style={revealDelay(headIn, 150)}
              className={`block ${revealClass(headIn)}`}
            >
              Engineered <span className="text-[#FFE29A]">Right.</span>
            </span>
            <span
              style={revealDelay(headIn, 300)}
              className={`block ${revealClass(headIn)}`}
            >
              Executed <span className="text-[#FFE29A]">Responsibly.</span>
            </span>
          </h1>
          <p
            style={revealDelay(headIn, 500)}
            className={`mt-3 text-xs text-white/90 sm:text-sm lg:text-[0.9vw] ${revealClass(headIn)}`}
          >
            One team. Every stage. From engineering to construction and handover.
          </p>
        </div>

        {/* Empty slot: keeps the bar's space in the hero. The real bar lives in a portal on <body>
            and sits over this slot (scrolling with the page) until you scroll into the next section. */}
        <div className="mt-auto w-full px-4 pb-4 lg:pb-[2.6vw]">
          <div
            ref={slotRef}
            style={{ height: barHeight || undefined }}
            className="mx-auto w-full lg:w-[87%]"
          />
        </div>
      </section>

      {mounted ? createPortal(bar, document.body) : null}
    </>
  )
}