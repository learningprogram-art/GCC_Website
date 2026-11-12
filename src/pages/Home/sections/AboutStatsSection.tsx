import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInViewOnce } from '@/hooks/useInViewOnce'

const baiJamjuree = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hankenGrotesk = { fontFamily: '"Hanken Grotesk", sans-serif' }

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#about-stats { padding-left: 1.25rem; padding-right: 1.25rem; }
@media (min-width: 640px)  { #about-stats { padding-left: 3rem; padding-right: 3rem; } }
@media (min-width: 1024px) { #about-stats { padding-left: 6rem; padding-right: 6rem; } }
`

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

function StatRow({ stat, order }: { stat: Stat; order: number }) {
  const { ref, started, display } = useCountUp<HTMLDivElement>(stat.value, stat.decimals, {
    duration: 1200,
    delay: order * 90,
  })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${order * 80}ms` }}
      className={`flex flex-col gap-3 border-t border-[#403D39] bg-[#252422] py-6 pr-4 sm:py-[28px] sm:pr-0 transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:flex-row sm:items-start sm:gap-8 ${
        started ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      {/* flex-1 only from sm up, so on mobile the caption sits right under the number */}
      <p
        style={baiJamjuree}
        className="min-w-0 whitespace-nowrap text-[clamp(36px,11.5vw,54px)] sm:flex-1 sm:text-[76px] lg:text-[104px] font-light leading-none tracking-[-0.03em] text-[#FFFCF2] tabular-nums"
      >
        <span>{display}</span>
        {stat.suffix && <span className="text-[#FFE6A7]">{stat.suffix}</span>}
      </p>

      <div
        style={hankenGrotesk}
        className="flex w-full flex-col gap-2 pt-0 sm:w-[280px] sm:shrink-0 sm:pt-3.5"
      >
        {/* Index hidden on mobile, as in the design */}
        <p className="hidden text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFE6A7] sm:block">
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
  const [sectionRef, inView] = useInViewOnce<HTMLElement>(0.15, { failSafe: false })

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="about-stats"
        ref={sectionRef}
        className="bg-[#252422] py-[4rem] sm:py-[5rem] lg:py-[5.4375rem]"
      >
        <div className="mx-auto flex w-full max-w-[78.25rem] flex-col gap-[2.5rem] sm:gap-[3.875rem]">
          {/* Statement: eyebrow (left) + link (right) on the first row, headline below, on every screen size */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-6 sm:gap-x-8 sm:gap-y-[32px]">
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

            {/* Headline (Figma Node 211:5161)
                Mobile: size scales with screen width so each line always fits on one line
                ((100vw - 48px padding) / 12.8 ≈ widest line "TRUSTED BY FAMILIES."). */}
            <h2
              style={baiJamjuree}
              className="col-span-2 text-[clamp(20px,calc((100vw-40px)/12.8),32px)] sm:text-[3rem] lg:text-[4.125rem] font-medium uppercase leading-[1.05] tracking-[-0.02em] lg:tracking-[-0.04125rem]"
            >
              <span
                className={`block whitespace-nowrap text-[#FFFCF2] transition-all duration-700 delay-100 ease-out ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                Built by engineers.
              </span>
              <span
                className={`block whitespace-nowrap text-[#FFE6A7] transition-all duration-700 delay-200 ease-out ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                Trusted by families.
              </span>
            </h2>

            {/* Link / Read our story (Figma Node 211:5164) */}
            <Link
              to="/about"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
              style={hankenGrotesk}
              className={`group col-start-2 row-start-1 flex shrink-0 items-center gap-2 whitespace-nowrap text-[16px] font-bold leading-7 tracking-[-0.32px] text-[#FFE6A7] transition-all duration-700 delay-300 ease-out sm:text-[18px] sm:tracking-[-0.36px] ${
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

            {/* Right Rows (Figma Node 211:5172): 2x2 grid on mobile, stacked rows from sm up */}
            <div className="grid w-full flex-1 grid-cols-2 content-start border-b border-[#403D39] sm:flex sm:flex-col">
              {stats.map((stat, i) => (
                <StatRow key={stat.index} stat={stat} order={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutStatsSection