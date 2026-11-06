import { useState } from 'react'
import '@fontsource/bai-jamjuree/300.css'
import '@fontsource/bai-jamjuree/500.css'
import '@fontsource/bai-jamjuree/600.css'
import '@fontsource/bai-jamjuree/700.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'

interface WhyItem {
  id: string
  number: string
  title: string
  titleLines: [string, string]
  shortDesc: string
  fullDesc: string
  image: string
}

const whyItems: WhyItem[] = [
  {
    id: 'engineering-strength',
    number: '01',
    title: 'Engineering Strength',
    titleLines: ['Engineering', 'Strength'],
    shortDesc: 'Precision structural drawings and licensed engineering protocols.',
    fullDesc:
      'Structural engineering and detailed drawings that ensure the design is built right from the start.',
    image: '/assets/images/card-01.png',
  },
  {
    id: 'built-for-long-term',
    number: '02',
    title: 'Built for the Long Term',
    titleLines: ['Built for', 'the Long Term'],
    shortDesc: 'Construction focused on durability, quality, reliability and lasting value.',
    fullDesc:
      'Construction focused on durability, quality, reliability and lasting value.',
    image: '/assets/images/card-02.png',
  },
  {
    id: 'end-to-end-ownership',
    number: '03',
    title: 'End-to-End Ownership',
    titleLines: ['End-to-End', 'Ownership'],
    shortDesc: 'One team taking responsibility from the first plan to final handover.',
    fullDesc:
      'One team taking responsibility from the first plan to final handover.',
    image: '/assets/images/card-03.png',
  },
  {
    id: 'transparent-execution',
    number: '04',
    title: 'Transparent Execution',
    titleLines: ['Transparent', 'Execution'],
    shortDesc: 'Clear milestone schedules, material specs, and real-time site updates.',
    fullDesc:
      'Complete visibility into costs, timelines, material grades, and construction milestones without hidden surprises.',
    image: '/assets/images/card-04.png',
  },
]

export function WhyGccSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeItem = whyItems[activeIndex]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? whyItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === whyItems.length - 1 ? 0 : prev + 1))
  }

  return (
    <section
      id="why-gcc"
      className="relative w-full overflow-hidden bg-[#6F1D1B] text-[#FFFCF2] py-[5rem] md:py-[7rem] px-[1.5rem] md:px-[3rem] lg:px-[6rem]"
      style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65rem] h-[35rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,139,36,0.18)_0%,rgba(111,29,27,0)_70%)] blur-[60px]"
      />

      <div className="relative mx-auto flex w-full max-w-[90rem] flex-col items-center">
        {/* Header Block */}
        <div className="flex flex-col items-center gap-[1.5rem] text-center mb-[3rem] md:mb-[4rem]">
          {/* Eyebrow */}
          <div className="flex items-center gap-[0.75rem]">
            <div className="size-[0.375rem] rounded-full bg-[#FB8B24]" />
            <span className="text-[0.75rem] font-semibold uppercase leading-[1rem] tracking-[0.06rem] text-[#FFE6A7]">
              Why GCC
            </span>
            <div className="size-[0.375rem] rounded-full bg-[#FB8B24]" />
          </div>

          {/* Title */}
          <h2
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
            className="text-[2rem] sm:text-[2.625rem] font-medium leading-[1.15] tracking-[-0.04rem] text-[#FFFCF2]"
          >
            The GCC Difference
          </h2>

          {/* Index Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-[0.5rem] pt-[0.5rem]">
            {whyItems.map((item, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-[0.5rem] px-[1rem] py-[0.625rem] rounded-[0.5rem] text-[0.875rem] font-medium leading-[1.25rem] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFFCF2] text-[#6F1D1B] shadow-md'
                      : 'bg-[#6F1D1B] border border-white/20 text-[#FFFCF2] hover:bg-[#5C1715]'
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      isActive ? 'text-[#E06422]' : 'text-[#FFE6A7]'
                    }`}
                  >
                    {item.number}
                  </span>
                  <span>{item.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Carousel / Active Card Presentation */}
        <div className="w-full flex justify-center items-center">
          {/* Main Card (Figma Node 211:5223 - w: 860px, rounded: 8px) */}
          <div className="w-full max-w-[53.75rem] rounded-[0.5rem] overflow-hidden bg-[#FFFCF2] text-[#252422] shadow-2xl flex flex-col md:flex-row items-stretch">
            {/* Left: Text Panel */}
            <div className="w-full md:w-1/2 p-[2rem] sm:p-[2.5rem] lg:pt-[2.75rem] lg:pb-[2.5rem] lg:px-[3rem] flex flex-col justify-between gap-[2.5rem]">
              <div className="flex flex-col gap-[1.5rem]">
                {/* Big Index Numeral */}
                <div
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                  className="text-[5rem] sm:text-[7.5rem] font-light leading-none tracking-[-0.15rem] text-[#6F1D1B]"
                >
                  {activeItem.number}
                </div>

                {/* Card Title */}
                <h3
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                  className="text-[1.75rem] sm:text-[2.25rem] font-semibold leading-[2.75rem] tracking-[-0.02rem] text-[#252422]"
                >
                  {activeItem.title}
                </h3>

                {/* Card Description */}
                <p className="text-[1rem] sm:text-[1.25rem] font-normal leading-[1.75rem] text-[#403D39]">
                  {activeItem.fullDesc}
                </p>
              </div>

              {/* Progress Indicator Dots */}
              <div className="flex items-center gap-[0.5rem] pt-[1rem]">
                {whyItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-[0.375rem] rounded-full transition-all cursor-pointer ${
                      i === activeIndex
                        ? 'w-[2rem] bg-[#6F1D1B]'
                        : 'w-[0.5rem] bg-[#403D39]/30 hover:bg-[#403D39]/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Image Panel */}
            <div className="w-full md:w-1/2 min-h-[16rem] md:min-h-auto relative overflow-hidden bg-white">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center gap-[1.5rem] mt-[2.5rem] md:mt-[3rem]">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous reason"
            className="flex items-center justify-center p-[0.875rem] rounded-[0.5rem] bg-[#6F1D1B] border border-white/20 text-[#FFE6A7] hover:bg-[#5C1715] hover:text-white transition-colors cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[1.5rem]"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            aria-label="Next reason"
            className="flex items-center justify-center p-[0.875rem] rounded-[0.5rem] bg-[#FFFCF2] text-[#6F1D1B] hover:bg-[#FFE6A7] transition-colors shadow-md cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[1.5rem]"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default WhyGccSection
