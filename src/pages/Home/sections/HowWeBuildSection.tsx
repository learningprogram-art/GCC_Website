import { useState, useEffect, useRef, type ElementType, type CSSProperties } from 'react'
import { cn } from '@/utils/cn'

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#how-we-build { padding-left: 16px; padding-right: 16px; }
@media (min-width: 768px)  { #how-we-build { padding-left: 48px; padding-right: 48px; } }
@media (min-width: 1024px) { #how-we-build { padding-left: 96px; padding-right: 96px; } }
`

export interface StepItem {
  number: string
  stepOf: string
  title: string
  description: string
  deliverables: string[]
  tone: 'White' | 'Sand' | 'Tan' | 'Maroon'
  imageCaption: string
}

const STEPS: StepItem[] = [
  {
    number: '01',
    stepOf: 'Step 1 of 4',
    title: 'Plan & Design',
    description:
      'We understand your plot, your needs and your budget, and turn them into a clear design and plan.',
    deliverables: ['Site visit', 'Floor plans', '3D elevation'],
    tone: 'White',
    imageCaption: 'Architect walking the plot with the family',
  },
  {
    number: '02',
    stepOf: 'Step 2 of 4',
    title: 'Engineer',
    description:
      'Structural engineering and detailed drawings that give your home a stronger foundation.',
    deliverables: ['Structural design', 'Working drawings', 'Soil report'],
    tone: 'Sand',
    imageCaption: 'Engineer marking up structural drawings',
  },
  {
    number: '03',
    stepOf: 'Step 3 of 4',
    title: 'Build',
    description:
      'Execution managed by one team, with quality checks at every stage.',
    deliverables: ['Weekly updates', 'Stage QA checks', 'Milestone billing'],
    tone: 'Tan',
    imageCaption: 'Construction site quality control & progress',
  },
  {
    number: '04',
    stepOf: 'Step 4 of 4',
    title: 'Hand Over',
    description:
      'Keys handed over with deep cleaning, full documentation, and ongoing structural warranty.',
    deliverables: ['Keys & documentation', 'Warranty certificate', 'AMC portal access'],
    tone: 'Maroon',
    imageCaption: 'Family receiving keys with structural warranty',
  },
]

/* ------------------------------------------------------------------ */
/* Bottom-up reveal-on-scroll helpers                                  */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect() // reveal only once
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

interface RevealTextProps {
  children: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  delay?: number // ms before the first word starts
  stagger?: number // ms between words
}

function RevealText({
  children,
  as: Tag = 'p',
  className,
  style,
  delay = 0,
  stagger = 40,
}: RevealTextProps) {
  const [ref, inView] = useInView<HTMLElement>()
  const words = children.split(' ')

  return (
    <Tag ref={ref} aria-label={children} className={className} style={style}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          {/* mask: extra padding/negative margin stops descenders from being clipped */}
          <span className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
            <span
              className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:!translate-y-0"
              style={{
                transform: inView ? 'translateY(0)' : 'translateY(110%)',
                transitionDelay: `${delay + i * stagger}ms`,
              }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Illustrations                                                       */
/* ------------------------------------------------------------------ */

function StepIllustration({ tone }: { tone: string }) {
  if (tone === 'White') {
    return (
      <div className="relative size-full flex flex-col justify-between p-[1.5rem] sm:p-[2rem] overflow-hidden">
        {/* Architectural drafting grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#403D39 1px, transparent 1px), linear-gradient(90deg, #403D39 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-['Hanken_Grotesk',sans-serif] text-[0.75rem] font-semibold uppercase tracking-[0.06rem] text-[#403D39]">
            Architectural Schematic
          </span>
          <span className="font-['Bai_Jamjuree',sans-serif] text-[0.875rem] font-bold text-[#6F1D1B]">
            PLOT V-104
          </span>
        </div>
        {/* Floorplan visual schematic */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-3">
          <svg
            viewBox="0 0 160 100"
            className="w-[12rem] sm:w-[14rem] h-auto stroke-[#252422]"
            fill="none"
            strokeWidth="1.5"
          >
            <rect x="10" y="10" width="140" height="80" rx="2" strokeDasharray="4 2" />
            <rect x="20" y="20" width="60" height="60" fill="#252422" fillOpacity="0.06" />
            <rect x="85" y="20" width="55" height="35" fill="#252422" fillOpacity="0.04" />
            <rect x="85" y="60" width="55" height="20" fill="#252422" fillOpacity="0.04" />
            <path d="M40 80v-15a15 15 0 0 1 15-15" stroke="#E06422" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between font-['Hanken_Grotesk',sans-serif] text-[0.8125rem] text-[#403D39]">
          <span>Floorplan & Elevations</span>
          <span className="font-semibold text-[#6F1D1B]">01 / Concept Approved</span>
        </div>
      </div>
    )
  }

  if (tone === 'Sand') {
    return (
      <div className="relative size-full flex flex-col justify-between p-[1.5rem] sm:p-[2rem] overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-['Hanken_Grotesk',sans-serif] text-[0.75rem] font-semibold uppercase tracking-[0.06rem] text-[#252422]">
            Structural Load Modeling
          </span>
          <span className="font-['Bai_Jamjuree',sans-serif] text-[0.875rem] font-bold text-[#6F1D1B]">
            IS 456 COMPLIANT
          </span>
        </div>
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 160 100"
            className="w-[12rem] sm:w-[14rem] h-auto stroke-[#252422]"
            fill="none"
            strokeWidth="1.5"
          >
            <path d="M20 90h120M30 90V30l50-15 50 15v60M55 90V38M80 90V25M105 90V38" />
            <circle cx="80" cy="25" r="4" fill="#E06422" stroke="none" />
            <circle cx="55" cy="38" r="3" fill="#E06422" stroke="none" />
            <circle cx="105" cy="38" r="3" fill="#E06422" stroke="none" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between font-['Hanken_Grotesk',sans-serif] text-[0.8125rem] text-[#252422]">
          <span>RCC & Foundation Blueprint</span>
          <span className="font-semibold text-[#6F1D1B]">02 / Safety Verified</span>
        </div>
      </div>
    )
  }

  if (tone === 'Tan') {
    return (
      <div className="relative size-full flex flex-col justify-between p-[1.5rem] sm:p-[2rem] overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-['Hanken_Grotesk',sans-serif] text-[0.75rem] font-semibold uppercase tracking-[0.06rem] text-[#252422]">
            Site Execution & Quality
          </span>
          <span className="font-['Bai_Jamjuree',sans-serif] text-[0.875rem] font-bold text-[#6F1D1B]">
            STAGE 3 ON SCHEDULE
          </span>
        </div>
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 160 100"
            className="w-[12rem] sm:w-[14rem] h-auto stroke-[#252422]"
            fill="none"
            strokeWidth="1.6"
          >
            <path d="M20 85h120M35 85V45h35v40M75 85V25h50v60M85 40h15M85 55h15M110 40h15M110 55h15" />
            <path d="M50 20l25-10v15" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between font-['Hanken_Grotesk',sans-serif] text-[0.8125rem] text-[#252422]">
          <span>Daily QA Audits & Live Camera</span>
          <span className="font-semibold text-[#252422]">03 / Precision Build</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative size-full flex flex-col justify-between p-[1.5rem] sm:p-[2rem] overflow-hidden">
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-['Hanken_Grotesk',sans-serif] text-[0.75rem] font-semibold uppercase tracking-[0.06rem] text-[#FFFCF2]/80">
          Handover & Living
        </span>
        <span className="font-['Bai_Jamjuree',sans-serif] text-[0.875rem] font-bold text-[#FB8B24]">
          10-YEAR WARRANTY
        </span>
      </div>
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 160 100"
          className="w-[12rem] sm:w-[14rem] h-auto stroke-[#FFFCF2]"
          fill="none"
          strokeWidth="1.6"
        >
          <path d="M80 15L35 45v45h90V45L80 15z" />
          <path d="M68 90V60h24v30" />
          <circle cx="80" cy="40" r="8" stroke="#FB8B24" strokeWidth="2" />
          <path d="M80 44v8M76 48h8" stroke="#FB8B24" strokeWidth="2" />
        </svg>
      </div>
      <div className="relative z-10 flex items-center justify-between font-['Hanken_Grotesk',sans-serif] text-[0.8125rem] text-[#FFFCF2]">
        <span>Deep Cleaning & Key Handover</span>
        <span className="font-semibold text-[#FB8B24]">04 / Lifetime Trust</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function HowWeBuildSection() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Base top offset below floating navbar (~6.75rem / 108px) + stacked tab offset (4.25rem / 68px)
  const baseStickyRem = 6.75
  const stepOffsetRem = 4.25

  useEffect(() => {
    const onScroll = () => {
      const rem =
        typeof window !== 'undefined'
          ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
          : 16

      let activeIdx = 0
      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i]
        if (el) {
          const rect = el.getBoundingClientRect()
          const stickyPinTop = (baseStickyRem + i * stepOffsetRem) * rem
          if (rect.top <= stickyPinTop + 15) {
            activeIdx = i
          }
        }
      }
      setActiveStepIndex(activeIdx)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="how-we-build"
        data-node-id="211:5236"
        aria-label="How We Build"
        className="relative w-full bg-[#FFFCF2] pt-[4rem] pb-[6rem] lg:pt-[7.5rem] lg:pb-[7.5rem] overflow-visible"
      >
        <div className="mx-auto max-w-[78rem] flex flex-col gap-[3rem] lg:gap-[4.5rem]">
          {/* Header (Figma Node 211:5237) */}
          <div className="flex flex-col gap-[1.5rem] items-start">
            {/* Eyebrow */}
            <div className="flex items-center gap-[0.75rem]">
              <span className="size-[0.5rem] bg-[#E06422]" aria-hidden="true" />
              <RevealText
                as="span"
                className="font-['Hanken_Grotesk',sans-serif] text-[0.75rem] font-semibold uppercase tracking-[0.06rem] text-[#99582A]"
              >
                How we build
              </RevealText>
            </div>

            {/* Headline & Subhead Row (Figma Node 211:5241) */}
            <div className="flex flex-col gap-[1.5rem] lg:flex-row lg:items-end lg:justify-between w-full">
              <div className="font-['Bai_Jamjuree',sans-serif] text-[2rem] sm:text-[2.625rem] lg:text-[3rem] font-bold uppercase leading-[1.2]">
                <RevealText as="p" className="m-0 text-[#252422]">
                  One team.
                </RevealText>
                <RevealText as="p" className="m-0 text-[#6F1D1B]" delay={150}>
                  The Way We Build
                </RevealText>
              </div>
              <RevealText
                as="p"
                delay={300}
                stagger={20}
                className="font-['Hanken_Grotesk',sans-serif] text-[1rem] sm:text-[1.125rem] lg:text-[1.25rem] font-normal leading-[1.75rem] text-[#403D39] max-w-[26rem] m-0"
              >
                You deal with one team that owns the whole project — not a chain of contractors you have to coordinate yourself.
              </RevealText>
            </div>
          </div>

          {/* Sticky Stacking Step Cards Container */}
          <div className="relative flex flex-col gap-[2rem] lg:gap-[3rem] w-full pt-[1.5rem] sm:pt-[2rem] lg:pt-[2.5rem]">
            {STEPS.map((step, index) => {
              const isMaroon = step.tone === 'Maroon'
              const isTan = step.tone === 'Tan'
              const isSand = step.tone === 'Sand'
              const isWhite = step.tone === 'White'
              const isActive = activeStepIndex === index

              // CSS Sticky offset per card: pins top below floating navbar (~6.75rem / 108px) + tab offset
              const stickyTop = `${baseStickyRem + index * stepOffsetRem}rem`

              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  style={{ top: stickyTop }}
                  className={cn(
                    'sticky flex flex-col justify-between overflow-hidden rounded-[12px] transition-all duration-300 w-full min-h-[30rem] lg:h-[514px] shadow-[0px_-10px_28px_0px_rgba(37,36,34,0.14)]',
                    isActive ? 'bg-white' : 'bg-[#FFFCF2]'
                  )}
                >
                  {/* Step Card Header / Pin Tab (Figma Node 211:5247) */}
                  <div
                    onClick={() => setActiveStepIndex(index)}
                    className="flex items-center justify-between w-full px-6 sm:px-[40px] pt-[18px] pb-[18px] shrink-0 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-[16px]">
                      {/* Badge (Figma Node 211:5249 - active is black #252422, inactive below/stacked is brown #6F1D1B) */}
                      <div
                        className={cn(
                          'flex items-center justify-center rounded-[4px] px-[10px] py-[6px] shrink-0 transition-colors duration-200',
                          isActive
                            ? 'bg-[#252422] text-[#FFFCF2]'
                            : 'bg-[#6F1D1B] text-white'
                        )}
                      >
                        <span className="font-['Hanken_Grotesk',sans-serif] text-[12px] font-semibold uppercase tracking-[0.96px] leading-none block">
                          {step.number}
                        </span>
                      </div>

                      {/* Step Title (Figma Node 211:5251) */}
                      <RevealText
                        as="h3"
                        style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                        className="m-0 text-[26px] sm:text-[32px] lg:text-[36px] font-semibold leading-[44px] tracking-[-0.36px] text-[#252422]"
                      >
                        {step.title}
                      </RevealText>
                    </div>

                    {/* Step of 4 Indicator (Figma Node 211:5252) */}
                    <span
                      style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                      className="text-[14px] font-medium leading-[20px] text-[rgba(37,36,34,0.7)]"
                    >
                      {step.stepOf}
                    </span>
                  </div>

                  {/* Divider Rule (Figma Node 211:5253) */}
                  <div className="h-px w-full bg-[rgba(37,36,34,0.2)] shrink-0" />

                  {/* Card Body (Figma Node 211:5254) */}
                  <div className="flex flex-col lg:flex-row items-stretch flex-1 w-full overflow-hidden">
                    {/* Left Column: Copy + Deliverables (Figma Node 211:5255) */}
                    <div className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-[40px] py-6 sm:py-[32px] relative z-10">
                      <RevealText
                        as="p"
                        delay={150}
                        stagger={20}
                        style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                        className="m-0 text-[18px] sm:text-[20px] font-normal leading-[28px] text-[rgba(37,36,34,0.8)] max-w-[460px]"
                      >
                        {step.description}
                      </RevealText>

                      {/* Deliverables Chip Row (Figma Node 211:5259) */}
                      <div className="flex flex-wrap gap-[8px] items-center pt-8">
                        {step.deliverables.map((chip) => (
                          <span
                            key={chip}
                            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                            className="rounded-full px-[12px] py-[6px] bg-[rgba(230,230,230,0.55)] text-[14px] font-medium leading-[20px] text-[#252422] whitespace-nowrap"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Visual Frame (Figma Node 211:5268) */}
                    <div
                      className={cn(
                        'w-full lg:w-1/2 min-h-[220px] sm:min-h-[280px] lg:min-h-0 flex-1 relative flex flex-col justify-between overflow-hidden',
                        isMaroon && 'bg-[#403D39]',
                        isTan && 'bg-[#99582A]',
                        isSand && 'bg-[#BB9457]',
                        isWhite && 'bg-[#CCC5B9]'
                      )}
                    >
                      <StepIllustration tone={step.tone} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default HowWeBuildSection