import { useState, useEffect, useRef, type ElementType, type CSSProperties } from 'react'
import { cn } from '@/utils/cn'

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#how-we-build { padding-left: 1.25rem; padding-right: 1.25rem; }
@media (min-width: 768px)  { #how-we-build { padding-left: 3rem; padding-right: 3rem; } }
@media (min-width: 1024px) { #how-we-build { padding-left: 6rem; padding-right: 6rem; } }
`

export interface StepItem {
  number: string
  stepOf: string
  title: string
  description: string
  deliverables: string[]
}

const STEPS: StepItem[] = [
  {
    number: '01',
    stepOf: 'Step 1 of 4',
    title: 'Plan & Design',
    description:
      'We understand your plot, your needs and your budget, and turn them into a clear design and plan.',
    deliverables: ['Site visit', 'Floor plans', '3D elevation'],
  },
  {
    number: '02',
    stepOf: 'Step 2 of 4',
    title: 'Engineer',
    description:
      'Structural engineering and detailed drawings that give your home a stronger foundation.',
    deliverables: ['Structural design', 'Working drawings', 'Soil report'],
  },
  {
    number: '03',
    stepOf: 'Step 3 of 4',
    title: 'Build',
    description:
      'Execution managed by one team, with quality checks at every stage.',
    deliverables: ['Weekly updates', 'Stage QA checks', 'Milestone billing'],
  },
  {
    number: '04',
    stepOf: 'Step 4 of 4',
    title: 'Hand Over',
    description:
      'Keys handed over with deep cleaning, full documentation, and ongoing structural warranty.',
    deliverables: ['Keys & documentation', 'Warranty certificate', 'AMC portal access'],
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
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function HowWeBuildSection() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIdxRef = useRef<number>(0)
  const tickingRef = useRef(false)
  const cachedRemRef = useRef(16)

  // Base top offset below floating navbar (~4.75rem / 76px) + stacked tab offset (3.25rem / 52px)
  const baseStickyRem = 4.75
  const stepOffsetRem = 3.25

  useEffect(() => {
    const updateRem = () => {
      if (typeof window !== 'undefined') {
        cachedRemRef.current = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      }
    }

    updateRem()
    window.addEventListener('resize', updateRem, { passive: true })

    const updateActive = () => {
      let activeIdx = 0
      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i]
        if (el) {
          const rect = el.getBoundingClientRect()
          const stickyPinTop = (baseStickyRem + i * stepOffsetRem) * cachedRemRef.current
          if (rect.top <= stickyPinTop + 15) {
            activeIdx = i
          }
        }
      }
      if (activeIdxRef.current !== activeIdx) {
        activeIdxRef.current = activeIdx
        setActiveStepIndex(activeIdx)
      }
      tickingRef.current = false
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(updateActive)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateActive()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateRem)
    }
  }, [])

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="how-we-build"
        data-node-id="211:5236"
        aria-label="How We Build"
        className="relative w-full bg-[#FFFCF2] pt-[3rem] pb-[2rem] sm:pb-[5rem] lg:pt-[5rem] lg:pb-[6rem] overflow-visible"
      >
        <div className="mx-auto max-w-[78rem] flex flex-col gap-[2.5rem] lg:gap-[3.5rem]">
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
          <div className="relative flex flex-col gap-[1.5rem] lg:gap-[2.5rem] w-full pt-[1rem] sm:pt-[1.5rem] lg:pt-[1.5rem]">
            {STEPS.map((step, index) => {
              const isActive = activeStepIndex === index

              // CSS Sticky offset per card: pins top below floating navbar (~4.75rem / 76px) + tab offset
              const stickyTop = `${baseStickyRem + index * stepOffsetRem}rem`

              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  style={{ top: stickyTop }}
                  className={cn(
                    'sticky flex flex-col justify-between overflow-hidden rounded-[12px] transition-all duration-300 w-full min-h-[26rem] sm:min-h-[28rem] lg:h-[clamp(440px,52vh,514px)] shadow-[0px_-10px_28px_0px_rgba(37,36,34,0.14)]',
                    isActive ? 'bg-white' : 'bg-[#FFFCF2]'
                  )}
                >
                  {/* Step Card Header / Pin Tab (Figma Node 211:5247) */}
                  <div
                    onClick={() => setActiveStepIndex(index)}
                    className="flex items-center justify-between w-full px-6 sm:px-[40px] pt-[14px] pb-[14px] lg:pt-[16px] lg:pb-[16px] shrink-0 cursor-pointer select-none"
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
                        className="m-0 text-[24px] sm:text-[30px] lg:text-[34px] font-semibold leading-[40px] tracking-[-0.36px] text-[#252422]"
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
                    <div className="flex flex-col justify-between w-full lg:w-1/2 px-6 sm:px-[40px] py-4 sm:py-5 lg:py-6 relative z-10">
                      <RevealText
                        as="p"
                        delay={150}
                        stagger={20}
                        style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                        className="m-0 text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-[24px] sm:leading-[26px] lg:leading-[28px] text-[rgba(37,36,34,0.8)] max-w-[460px]"
                      >
                        {step.description}
                      </RevealText>

                      {/* Deliverables Chip Row (Figma Node 211:5259) */}
                      <div className="flex flex-wrap gap-[8px] items-center pt-3 sm:pt-4">
                        {step.deliverables.map((chip) => (
                          <span
                            key={chip}
                            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                            className="rounded-full px-[12px] py-[5px] bg-[rgba(230,230,230,0.55)] text-[13px] sm:text-[14px] font-medium leading-[20px] text-[#252422] whitespace-nowrap"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Visual Frame (Figma Node 211:5268) */}
                    <div
                      aria-hidden="true"
                      className="w-full lg:w-1/2 min-h-[12.5rem] sm:min-h-[15rem] lg:min-h-0 flex-1 bg-[#99582A]"
                    />
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