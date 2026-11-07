import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const baiJamjuree = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hankenGrotesk = { fontFamily: '"Hanken Grotesk", sans-serif' }

type Stat = {
  value: number
  decimals: number
  suffix: string
  index: string
  caption: string
}

const stats: Stat[] = [
  { value: 12, decimals: 0, suffix: '', index: '01', caption: 'Years designing and building homes' },
  { value: 250, decimals: 0, suffix: '+', index: '02', caption: 'Homes handed over to families' },
  { value: 1.8, decimals: 1, suffix: 'M', index: '03', caption: 'Square feet constructed' },
  { value: 96, decimals: 0, suffix: '%', index: '04', caption: 'Homes handed over on or before the agreed date' },
]

/** Counts from 0 to `target` once the element scrolls into view. */
function useCountUp<T extends HTMLElement>(
  target: number,
  decimals: number,
  { duration = 2000, delay = 0 }: { duration?: number; delay?: number } = {},
) {
  const ref = useRef<T>(null)
  const [started, setStarted] = useState(false)
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      const timer = setTimeout(() => setValue(target), 0)
      return () => clearTimeout(timer)
    }

    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const p = Math.min(Math.max((now - t0) / duration, 0), 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(target * eased)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started, target, duration, delay])

  return { ref, started, display: value.toFixed(decimals) }
}

function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

function StatRow({ stat, order }: { stat: Stat; order: number }) {
  const { ref, started, display } = useCountUp<HTMLDivElement>(stat.value, stat.decimals, {
    duration: 1200,
    delay: order * 90,
  })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${order * 80}ms` }}
      className={`flex flex-col gap-3 border-t border-[#403D39] bg-[#252422] py-6 sm:py-[28px] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:flex-row sm:items-start sm:gap-8 ${
        started ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <p
        style={baiJamjuree}
        className="min-w-0 flex-1 text-[54px] sm:text-[76px] lg:text-[104px] font-light leading-none tracking-[-0.03em] text-[#FFFCF2] tabular-nums"
      >
        <span>{display}</span>
        {stat.suffix && <span className="text-[#FFE6A7]">{stat.suffix}</span>}
      </p>

      <div
        style={hankenGrotesk}
        className="flex w-full flex-col gap-2 pt-0 sm:w-[280px] sm:shrink-0 sm:pt-3.5"
      >
        <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFE6A7]">
          {stat.index}
        </p>
        <p className="text-[14px] sm:text-[16px] font-normal leading-6 text-[#CCC5B9]">
          {stat.caption}
        </p>
      </div>
    </div>
  )
}

export function AboutStatsSection() {
  const [sectionRef, inView] = useInViewOnce<HTMLElement>(0.15)

  return (
    <section
      id="about-stats"
      ref={sectionRef}
      className="bg-[#252422] px-6 md:px-12 lg:px-[92px] py-16 sm:py-20 lg:py-[87px]"
    >
      <div className="mx-auto flex w-full max-w-[1252px] flex-col gap-12 sm:gap-[62px]">
        {/* Statement: Eyebrow + Headline on Left, Link on Right */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="flex flex-col gap-6 sm:gap-[32px] items-start">
            {/* Eyebrow */}
            <div
              className={`flex items-center gap-3 transition-all duration-700 ease-out ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              <div className="size-2 bg-[#FFE6A7] shrink-0" aria-hidden="true" />
              <p
                style={hankenGrotesk}
                className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFFCF2]"
              >
                About us
              </p>
            </div>

            {/* Headline (Figma Node 211:5161) */}
            <h2
              style={baiJamjuree}
              className="text-[32px] sm:text-[48px] lg:text-[66px] font-medium uppercase leading-[1.05] tracking-[-0.66px]"
            >
              <span
                className={`block text-[#FFFCF2] transition-all duration-700 delay-100 ease-out ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                Built by engineers.
              </span>
              <span
                className={`block text-[#FFE6A7] transition-all duration-700 delay-200 ease-out ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                Trusted by families.
              </span>
            </h2>
          </div>

          {/* Link / Read our story (Figma Node 211:5164) */}
          <Link
            to="/about"
            style={hankenGrotesk}
            className={`group flex shrink-0 items-center gap-2 text-[18px] font-bold leading-7 tracking-[-0.36px] text-[#FFE6A7] transition-all duration-700 delay-300 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <span>Read our story</span>
            <svg
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>

        {/* Stats Container (Figma Node 211:5167): Left Intro Column + Right Stat Rows */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[48px] w-full pt-2">
          {/* Left Intro (Figma Node 211:5168) */}
          <div
            className={`flex flex-col gap-4 w-full lg:w-[352px] shrink-0 pt-0 lg:pt-[28px] transition-all duration-700 delay-150 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <p
              style={hankenGrotesk}
              className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFFCF2]"
            >
              By the numbers
            </p>
            <p
              style={hankenGrotesk}
              className="text-[16px] font-normal leading-6 text-[#CCC5B9]"
            >
              A decade of building independent homes across Haryana and Delhi NCR — measured in keys handed over, square feet built and promises kept.
            </p>
          </div>

          {/* Right Rows (Figma Node 211:5172) */}
          <div className="flex-1 flex flex-col w-full border-b border-[#403D39]">
            {stats.map((stat, i) => (
              <StatRow key={stat.index} stat={stat} order={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutStatsSection
