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

  const handlePrev = useCallback(() => {
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : items.length - 1
    scrollToCard(nextIdx)
  }, [activeIndex, items.length, scrollToCard])

  const handleNext = useCallback(() => {
    const nextIdx = activeIndex < items.length - 1 ? activeIndex + 1 : 0
    scrollToCard(nextIdx)
  }, [activeIndex, items.length, scrollToCard])

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
        'relative w-full bg-[#FFFCF2] pt-[4rem] pb-[5rem] lg:pt-[5.0625rem] lg:pb-[6.3125rem] overflow-x-clip focus:outline-none',
        className
      )}
    >
      <div className="w-full flex flex-col gap-[2.5rem] sm:gap-[3.5rem] lg:gap-[5rem]">
        {/* Header: 96px (6rem) left & right padding */}
        <div
          ref={setHeaderRef}
          className={cn(
            'w-full px-6 sm:px-12 md:px-[96px] lg:px-[6rem] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
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
                  aria-label="Previous testimonial"
                  className="flex size-[3.25rem] items-center justify-center rounded-[0.5rem] border border-[#CCC5B9] bg-transparent text-[#252422] transition-colors hover:border-[#252422] active:bg-[#252422]/5 cursor-default select-none"
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
                  aria-label="Next testimonial"
                  className="flex size-[3.25rem] items-center justify-center rounded-[0.5rem] bg-[#6F1D1B] text-white transition-colors hover:bg-[#5A1716] active:bg-[#481211] cursor-default select-none shadow-sm"
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
            className="relative w-full flex items-stretch gap-[24px] overflow-x-auto scroll-smooth px-6 sm:px-12 md:px-[96px] lg:px-[6rem] scroll-px-6 sm:scroll-px-12 md:scroll-px-[96px] lg:scroll-px-[6rem] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Cards (Figma: width 720px, height 620px, no box-shadow) */}
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
                    'w-[86vw] sm:w-[36rem] lg:w-[720px] min-h-[34rem] sm:min-h-[36rem] lg:h-[620px]',
                    isActive
                      ? 'bg-[#252422] text-[#FFFCF2]'
                      : 'bg-white border border-[#CCC5B9] text-[#252422]'
                  )}
                >
                  {/* Card Content Top Body (Figma Node 211:5428) */}
                  <div className="flex flex-1 flex-col justify-between p-[1.5rem] sm:p-[2.25rem] lg:p-[48px]">
                    {/* Quote Block (Figma Node 211:5431 / 211:5453)
                      GCC/Quote/L: Bai Jamjuree, Medium, 30px, 42px line-height, -0.15px letter-spacing
                  */}
                    <blockquote className="m-0 cursor-text select-text">
                      <p
                        style={{
                          fontFamily: '"Bai Jamjuree", sans-serif',
                          fontSize: '30px',
                          lineHeight: '42px',
                          letterSpacing: '-0.15px',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          color: isActive ? '#FFFCF2' : '#403D39',
                        }}
                        className="m-0 cursor-text select-text"
                      >
                        {item.quote}
                      </p>
                    </blockquote>

                    {/* Metrics Row (Figma Node 211:5432 / 211:5454 - gap 56px) */}
                    <div className="flex flex-wrap gap-[2rem] sm:gap-[3.5rem] lg:gap-[56px] pt-[1.5rem] sm:pt-[2rem] cursor-text select-text">
                      {/* Metric 1 */}
                      <div className="flex flex-col gap-[4px] cursor-text select-text">
                        {/* GCC/Stat/M: Bai Jamjuree, SemiBold, 28px, 36px line-height, -0.14px letter-spacing */}
                        <span
                          style={{
                            fontFamily: '"Bai Jamjuree", sans-serif',
                            fontSize: '28px',
                            lineHeight: '36px',
                            letterSpacing: '-0.14px',
                            fontWeight: 600,
                            fontStyle: 'normal',
                            color: isActive ? '#FB8B24' : '#99582A',
                          }}
                          className="cursor-text select-text"
                        >
                          {item.metric1.value}
                        </span>
                        {/* GCC/Body/S: Hanken Grotesk, 14px, 500, 20px line-height */}
                        <span
                          style={{
                            fontFamily: '"Hanken Grotesk", sans-serif',
                            fontSize: '14px',
                            lineHeight: '20px',
                            fontWeight: 500,
                            fontStyle: 'normal',
                            color: isActive ? '#CCC5B9' : '#403D39',
                          }}
                          className="cursor-text select-text"
                        >
                          {item.metric1.label}
                        </span>
                      </div>

                      {/* Metric 2 */}
                      <div className="flex flex-col gap-[4px] cursor-text select-text">
                        {/* GCC/Stat/M: Bai Jamjuree, SemiBold, 28px, 36px line-height, -0.14px letter-spacing */}
                        <span
                          style={{
                            fontFamily: '"Bai Jamjuree", sans-serif',
                            fontSize: '28px',
                            lineHeight: '36px',
                            letterSpacing: '-0.14px',
                            fontWeight: 600,
                            fontStyle: 'normal',
                            color: isActive ? '#FB8B24' : '#99582A',
                          }}
                          className="cursor-text select-text"
                        >
                          {item.metric2.value}
                        </span>
                        {/* GCC/Body/S: Hanken Grotesk, 14px, 500, 20px line-height */}
                        <span
                          style={{
                            fontFamily: '"Hanken Grotesk", sans-serif',
                            fontSize: '14px',
                            lineHeight: '20px',
                            fontWeight: 500,
                            fontStyle: 'normal',
                            color: isActive ? '#CCC5B9' : '#403D39',
                          }}
                          className="cursor-text select-text"
                        >
                          {item.metric2.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Author Bar (Figma Node 211:5439 / 211:5461) */}
                  <div
                    className={cn(
                      'flex items-stretch justify-between border-t border-solid overflow-clip',
                      isActive ? 'border-[#403D39]' : 'border-[#CCC5B9]'
                    )}
                  >
                    {/* Author Details (Figma: pl-48px, pr-24px) */}
                    <div className="flex flex-1 flex-col justify-center gap-[4px] pl-[1.5rem] sm:pl-[2.25rem] lg:pl-[48px] pr-[1rem] sm:pr-[1.5rem] lg:pr-[24px] py-[1rem] sm:py-[1.5rem] cursor-text select-text">
                      {/* GCC/Name: Hanken Grotesk, SemiBold, 20px, 28px line-height, -0.2px letter-spacing */}
                      <h4
                        style={{
                          fontFamily: '"Hanken Grotesk", sans-serif',
                          fontSize: '20px',
                          lineHeight: '28px',
                          letterSpacing: '-0.2px',
                          fontWeight: 600,
                          fontStyle: 'normal',
                          color: isActive ? '#FFFCF2' : '#252422',
                        }}
                        className="m-0 cursor-text select-text"
                      >
                        {item.author}
                      </h4>
                      {/* GCC/Body/S: Hanken Grotesk, 14px, 20px line-height */}
                      <p
                        style={{
                          fontFamily: '"Hanken Grotesk", sans-serif',
                          fontSize: '14px',
                          lineHeight: '20px',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          color: isActive ? '#CCC5B9' : '#403D39',
                        }}
                        className="m-0 cursor-text select-text"
                      >
                        {item.role}
                      </p>
                    </div>

                    {/* Portrait Photo or Silhouette (Figma Node 211:5443: size 136px) */}
                    <div
                      className={cn(
                        'relative shrink-0 size-[6rem] sm:size-[7.5rem] lg:size-[136px] overflow-clip',
                        isActive ? 'bg-[#403D39]' : 'bg-[#CCC5B9]'
                      )}
                    >
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.author}
                          className="h-full w-full object-cover object-top block"
                        />
                      ) : (
                        <Silhouette className="size-full text-current" />
                      )}
                    </div>
                  </div>

                  {/* Accent Stripe at bottom (Figma Node 211:5448: height 10px, orange when active like card 1, tan when idle) */}
                  <div
                    className="h-[10px] w-full shrink-0 block transition-colors duration-300"
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
