import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { useInViewOnce } from '@/hooks/useInViewOnce'

export interface TestimonialMetric {
  value: string
  label: string
}

export interface TestimonialItem {
  id: string
  quote: string
  metric1: TestimonialMetric
  metric2: TestimonialMetric
  author: string
  role: string
  photo?: string
  accentColor?: string
}

export interface TestimonialsSectionProps {
  items?: TestimonialItem[]
  className?: string
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: '01',
    quote:
      '“We’d heard every horror story about building a home — delays, surprise bills, endless site visits. Garg Core sent us weekly site photos, stuck to the price we signed, and handed over our keys 18 days early.”',
    metric1: {
      value: '18 days',
      label: 'Early handover',
    },
    metric2: {
      value: '₹0',
      label: 'Over the quoted price',
    },
    author: 'Rohit & Neha Malhotra',
    role: 'Homeowners · 4BHK Villa, Gurugram',
    photo: '/assets/images/testimonials/01_testimonial.webp',
    accentColor: '#E06422',
  },
  {
    id: '03',
    quote:
      '“Our parents wanted a retirement home with ramps, wide doors and lots of light. The team designed every detail around them — and the structure feels solid as a rock.”',
    metric1: {
      value: '11 months',
      label: 'Design to handover',
    },
    metric2: {
      value: '0',
      label: 'Change-order surprises',
    },
    author: 'Priya Nair',
    role: 'Homeowner · G+1 Home, Panchkula',
    photo: '/assets/images/testimonials/03_testimonial.webp',
    accentColor: '#BB9457',
  },
  {
    id: '02',
    quote:
      '“Living in Dubai, we couldn’t visit the site even once. Weekly video walkthroughs and a live payment tracker made it feel like we were standing there. Every rupee was accounted for.”',
    metric1: {
      value: '42',
      label: 'Video walkthroughs',
    },
    metric2: {
      value: '100%',
      label: 'Payments tracked online',
    },
    author: 'Vikram & Anjali Sethi',
    role: 'NRI Homeowners · Farmhouse, Sohna',
    photo: '/assets/images/testimonials/02_testimonial.webp',
    accentColor: '#BB9457',
  },
]

function Silhouette({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 136 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="136" height="136" fill="#403D39" />
      <circle cx="68" cy="52" r="24" fill="#6A6660" />
      <path
        d="M24 136c0-24.3 19.7-44 44-44s44 19.7 44 44H24z"
        fill="#6A6660"
      />
    </svg>
  )
}

export function TestimonialsSection({
  items = DEFAULT_TESTIMONIALS,
  className,
}: TestimonialsSectionProps) {
  const [headRef, headIn] = useInViewOnce<HTMLDivElement>(0.2)
  const [carouselRef, carouselIn] = useInViewOnce<HTMLDivElement>(0.15)
  const [activeIndex, setActiveIndex] = useState(0)
  const headerContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const isScrollingRef = useRef(false)

  const setHeaderRef = useCallback(
    (el: HTMLDivElement | null) => {
      headerContainerRef.current = el
      headRef.current = el
    },
    [headRef]
  )

  // Smoothly scroll to a specific card
  const scrollToCard = useCallback(
    (targetIndex: number) => {
      const container = containerRef.current
      if (!container) return

      isScrollingRef.current = true
      setActiveIndex(targetIndex)

      const maxScroll = container.scrollWidth - container.clientWidth

      let targetScroll = 0
      if (targetIndex === 0) {
        targetScroll = 0
      } else if (targetIndex === items.length - 1) {
        targetScroll = maxScroll
      } else {
        const targetCard = cardRefs.current[targetIndex]
        if (targetCard) {
          const pad = parseFloat(window.getComputedStyle(container).paddingLeft) || 96
          targetScroll = Math.min(
            maxScroll,
            Math.max(0, targetCard.offsetLeft - pad)
          )
        }
      }

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      })

      setTimeout(() => {
        isScrollingRef.current = false
      }, 500)
    },
    [items.length]
  )

  const canPrev = activeIndex > 0
  const canNext = activeIndex < items.length - 1

  const handlePrev = useCallback(() => {
    if (!canPrev) return
    scrollToCard(activeIndex - 1)
  }, [canPrev, activeIndex, scrollToCard])

  const handleNext = useCallback(() => {
    if (!canNext) return
    scrollToCard(activeIndex + 1)
  }, [canNext, activeIndex, scrollToCard])

  // Keyboard navigation (ArrowLeft & ArrowRight)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    },
    [handlePrev, handleNext]
  )

  // Detect which card is currently active on manual scroll (touch, drag, trackpad, mouse wheel)
  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return
    const container = containerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const maxScroll = container.scrollWidth - container.clientWidth

    if (scrollLeft <= 16) {
      if (activeIndex !== 0) setActiveIndex(0)
      return
    }
    if (scrollLeft >= maxScroll - 16) {
      const lastIndex = items.length - 1
      if (activeIndex !== lastIndex) setActiveIndex(lastIndex)
      return
    }

    const pad = parseFloat(window.getComputedStyle(container).paddingLeft) || 96

    let closestIdx = 0
    let minDistance = Infinity

    cardRefs.current.forEach((card, idx) => {
      if (!card) return
      const cardRect = card.getBoundingClientRect()
      const distance = Math.abs(cardRect.left - pad)
      if (distance < minDistance) {
        minDistance = distance
        closestIdx = idx
      }
    })

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx)
    }
  }, [activeIndex, items.length])

  // Attach global keyboard listener when mouse hovers over section
  useEffect(() => {
    const sectionElement = document.getElementById('testimonials')
    if (!sectionElement) return

    let isHovered = false
    const onMouseEnter = () => {
      isHovered = true
    }
    const onMouseLeave = () => {
      isHovered = false
    }

    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isHovered) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    sectionElement.addEventListener('mouseenter', onMouseEnter)
    sectionElement.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('keydown', onGlobalKeyDown)

    return () => {
      sectionElement.removeEventListener('mouseenter', onMouseEnter)
      sectionElement.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('keydown', onGlobalKeyDown)
    }
  }, [handlePrev, handleNext])

  return (
    <section
      id="testimonials"
      data-node-id="211:5404"
      aria-label="Client Testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative z-10 -mt-[2px] w-full bg-[#FFFCF2] pt-[4rem] pb-[5rem] lg:pt-[5.0625rem] lg:pb-[6.3125rem] overflow-x-clip focus:outline-none',
        className
      )}
    >
      <div className="w-full flex flex-col gap-[1.75rem] sm:gap-[2.5rem] lg:gap-[3rem]">
        {/* Header: 96px (6rem) left & right padding */}
        <div
          ref={setHeaderRef}
          className={cn(
            'w-full px-[1.5rem] sm:px-[3rem] md:px-[6rem] lg:px-[6rem] lg:!pl-[5.125rem] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
            headIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <div className="flex flex-col gap-[1.5rem] lg:flex-row lg:items-end lg:justify-between">
            {/* Title Area (Figma Node 211:5406) */}
            <div className="flex flex-col gap-[1.5rem] items-start">
              {/* Tag / Category Badge (Figma Node 211:5407) */}
              <div className="bg-[#99582A] px-[0.75rem] py-[0.5rem]">
                <span className="font-['Hanken_Grotesk',sans-serif] text-[0.75rem] font-semibold uppercase leading-[1rem] tracking-[0.06rem] text-white">
                  Client stories
                </span>
              </div>

              {/* Headline with Highlighting (Figma Node 211:5409) */}
              <div className="font-['Bai_Jamjuree',sans-serif] text-[2rem] sm:text-[2.625rem] lg:text-[3rem] font-bold uppercase leading-[1.2] text-[#252422] cursor-text select-text">
                <p className="m-0 cursor-text select-text">Homes built on</p>
                <div className="flex flex-wrap items-center mt-[0.25rem] cursor-text select-text">
                  {/* Highlighted 'TRUST,' Box (Figma Node 211:5412) */}
                  <span className="relative inline-block mr-[0.625rem] cursor-text select-text">
                    {/* Highlight Yellow Backdrop (Figma Node 211:5413) */}
                    <span
                      className="absolute inset-y-0 -inset-x-[0.5rem] bg-[#FFE6A7] top-[0.125rem] h-[calc(100%-0.25rem)] pointer-events-none"
                      aria-hidden="true"
                    />
                    {/* Accent Corner Dots (Figma Nodes 211:5415 & 211:5416) */}
                    <span
                      className="absolute -left-[0.6875rem] -top-[0.0625rem] size-[0.375rem] bg-[#E06422] pointer-events-none"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute -right-[0.6875rem] -bottom-[0.0625rem] size-[0.375rem] bg-[#E06422] pointer-events-none"
                      aria-hidden="true"
                    />
                    <span className="relative text-[#6F1D1B] cursor-text select-text">
                      trust,
                    </span>
                  </span>
                  <span className="cursor-text select-text">not promises.</span>
                </div>
              </div>
            </div>

            {/* Controls & Counter (Figma Node 211:5418) */}
            <div className="flex items-center justify-between gap-[1.5rem] sm:justify-start lg:justify-end">
              {/* Number Indicator (Figma Node 211:5420) */}
              <div className="font-['Bai_Jamjuree',sans-serif] text-[1.5rem] font-medium leading-[2rem] text-[#252422] cursor-text select-text">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="text-[#CCC5B9]">{` / ${String(items.length).padStart(2, '0')}`}</span>
              </div>

              {/* Navigation Arrows (Figma Node 211:5421) */}
              <div className="flex items-center gap-[0.75rem]">
                {/* Prev Button (Figma Node 211:5422) */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!canPrev}
                  aria-label="Previous testimonial"
                  data-active={canPrev}
                  className={cn(
                    'flex size-[3.25rem] items-center justify-center rounded-[0.5rem] border transition-colors duration-200 select-none',
                    canPrev
                      ? 'border-[#6F1D1B] bg-[#6F1D1B] text-white hover:bg-[#5A1716] active:bg-[#481211] shadow-sm cursor-pointer'
                      : 'border-[#CCC5B9] bg-[#FFFCF2] text-[#252422] cursor-not-allowed'
                  )}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[1.5rem] pointer-events-none"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {/* Next Button (Figma Node 211:5424) */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canNext}
                  aria-label="Next testimonial"
                  data-active={canNext}
                  className={cn(
                    'flex size-[3.25rem] items-center justify-center rounded-[0.5rem] border transition-colors duration-200 select-none',
                    canNext
                      ? 'border-[#6F1D1B] bg-[#6F1D1B] text-white hover:bg-[#5A1716] active:bg-[#481211] shadow-sm cursor-pointer'
                      : 'border-[#CCC5B9] bg-[#FFFCF2] text-[#252422] cursor-not-allowed'
                  )}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[1.5rem] pointer-events-none"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-bleed Scrollable Carousel Track (Figma Node 211:5426)
            1. Initially: card 0 aligns with header (gutter spacer on left), 0 right padding (bleeds off right screen)
            2. In middle: cards pass edge-to-edge with 0 padding on both sides
            3. At the end: last card aligns with header right edge (gutter spacer on right), 0 left padding
        */}
        <div
          ref={carouselRef}
          style={{ transitionDelay: carouselIn ? '150ms' : '0ms' }}
          className={cn(
            'relative w-full transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
            carouselIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="relative w-full flex items-stretch gap-[0.75rem] sm:gap-[1.5rem] overflow-x-auto overflow-y-hidden scroll-smooth px-[1.25rem] sm:px-[3rem] md:px-[6rem] lg:px-[6.375rem] lg:!pl-[5.125rem] scroll-px-[1.25rem] sm:scroll-px-[3rem] md:scroll-px-[6rem] lg:scroll-px-[5.5rem] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pan-y',
              overscrollBehaviorX: 'contain',
              overscrollBehaviorY: 'auto',
            }}
          >
            {/* Cards: scaled in rem + svh so the full card stays visible in mobile and desktop viewports */}
            {items.map((item, idx) => {
              const isActive = idx === activeIndex
              return (
                <article
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el
                  }}
                  onClick={() => scrollToCard(idx)}
                  className={cn(
                    'relative flex flex-col justify-between shrink-0 overflow-clip transition-all duration-300 cursor-default select-none',
                    'w-[min(80vw,22rem)] sm:w-[min(82vw,37.5rem)] min-h-[25rem] sm:min-h-[29rem] md:h-[min(31rem,68svh)]',
                    isActive
                      ? 'bg-[#252422] text-[#FFFCF2]'
                      : 'bg-white border border-[#CCC5B9] text-[#252422]'
                  )}
                >
                  {/* Card Content Top Body (Figma Node 211:5428) */}
                  <div className="flex flex-1 flex-col justify-between p-[1.125rem] sm:p-[2.25rem]">
                    {/* Quote Block (Figma Node 211:5429 / 211:5431) */}
                    <blockquote className="m-0 cursor-text select-text">
                      <p
                        style={{
                          fontFamily: '"Bai Jamjuree", sans-serif',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          color: isActive ? '#FFFCF2' : '#403D39',
                        }}
                        className="m-0 cursor-text select-text text-[1.0625rem] leading-[1.55rem] tracking-[-0.00625rem] sm:text-[1.5rem] sm:leading-[2.125rem] sm:tracking-[-0.009375rem]"
                      >
                        {item.quote}
                      </p>
                    </blockquote>

                    {/* Metrics Row (Figma Node 211:5432) */}
                    <div className="grid grid-cols-2 gap-x-[0.875rem] gap-y-[0.5rem] sm:flex sm:flex-wrap sm:gap-[2.75rem] pt-[0.75rem] sm:pt-0 cursor-text select-text">
                      {[item.metric1, item.metric2].map((metric, metricIdx) => (
                        <div
                          key={metricIdx}
                          className="flex flex-col gap-[0.125rem] sm:gap-[0.25rem] cursor-text select-text"
                        >
                          <span
                            style={{
                              fontFamily: '"Bai Jamjuree", sans-serif',
                              fontWeight: 600,
                              fontStyle: 'normal',
                              color: isActive ? '#FB8B24' : '#99582A',
                            }}
                            className="cursor-text select-text text-[1.25rem] leading-[1.75rem] tracking-[-0.00875rem] sm:text-[1.5rem] sm:leading-[2rem]"
                          >
                            {metric.value}
                          </span>
                          <span
                            style={{
                              fontFamily: '"Hanken Grotesk", sans-serif',
                              fontWeight: 500,
                              fontStyle: 'normal',
                              color: isActive ? '#CCC5B9' : '#403D39',
                            }}
                            className="cursor-text select-text text-[0.75rem] leading-[1rem] sm:text-[0.8125rem] sm:leading-[1.125rem]"
                          >
                            {metric.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Author Bar (Figma Node 211:5439) */}
                  <div
                    className={cn(
                      'flex items-stretch justify-between border-t border-solid overflow-clip h-[5.75rem] sm:h-[6.75rem] shrink-0',
                      isActive ? 'border-[#403D39]' : 'border-[#CCC5B9]'
                    )}
                  >
                    {/* Author Details */}
                    <div className="flex flex-1 flex-col justify-center gap-[0.125rem] sm:gap-[0.25rem] pl-[1.125rem] sm:pl-[2.25rem] pr-[0.75rem] sm:pr-[1.25rem] py-[0.75rem] sm:py-[1rem] cursor-text select-text">
                      <h4
                        style={{
                          fontFamily: '"Hanken Grotesk", sans-serif',
                          fontWeight: 600,
                          fontStyle: 'normal',
                          color: isActive ? '#FFFCF2' : '#252422',
                        }}
                        className="m-0 cursor-text select-text text-[0.9375rem] leading-[1.35rem] tracking-[-0.0125rem] sm:text-[1.125rem] sm:leading-[1.5rem]"
                      >
                        {item.author}
                      </h4>
                      <p
                        style={{
                          fontFamily: '"Hanken Grotesk", sans-serif',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          color: isActive ? '#CCC5B9' : '#403D39',
                        }}
                        className="m-0 cursor-text select-text text-[0.75rem] leading-[1.25] sm:text-[0.875rem] sm:leading-[1.25rem]"
                      >
                        {item.role}
                      </p>
                    </div>

                    {/* Portrait Photo or Silhouette */}
                    <div
                      className={cn(
                        'relative shrink-0 size-[5.75rem] sm:size-[6.75rem] overflow-clip',
                        isActive ? 'bg-[#403D39]' : 'bg-[#CCC5B9]'
                      )}
                    >
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.author}
                          className="h-full w-full object-cover object-top block"
                          loading="lazy"
                        />
                      ) : (
                        <Silhouette className="size-full text-current" />
                      )}
                    </div>
                  </div>

                  {/* Accent Stripe at bottom */}
                  <div
                    className="h-[0.4375rem] sm:h-[0.5rem] w-full shrink-0 block transition-colors duration-300"
                    style={{
                      backgroundColor: isActive ? '#E06422' : '#BB9457',
                    }}
                    aria-hidden="true"
                  />
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
