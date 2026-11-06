import { useEffect, useRef, useState } from 'react'
import '@fontsource/bai-jamjuree/300.css'
import '@fontsource/bai-jamjuree/500.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'

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

  // Start once, when the row is visible
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
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Run the count-up
  useEffect(() => {
    if (!started) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    let raf = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const p = Math.min(Math.max((now - t0) / duration, 0), 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target, duration, delay])

  return { ref, started, display: value.toFixed(decimals) }
}

/** Fades + slides an element up the first time it scrolls into view. */
function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return {
    ref,
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
    }`,
  }
}

function StatRow({ stat, order }: { stat: Stat; order: number }) {
  const { ref, started, display } = useCountUp<HTMLDivElement>(stat.value, stat.decimals, {
    duration: 1000,
    delay: order * 80,
  })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${order * 80}ms` }}
      className={`flex flex-col gap-3 border-t border-[#403D39] bg-[#252422] py-4 transition-all duration-500 ease-out even:pl-3 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:min-h-[160px] sm:flex-row sm:gap-8 sm:py-7 sm:even:pl-0 ${started ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
    >
      <p
        style={baiJamjuree}
        className="min-w-0 flex-1 text-[44px] font-light leading-none tracking-[-0.03em] text-[#FFFCF2] tabular-nums sm:text-[clamp(56px,7.2vw,104px)]"
      >
        <span>{display}</span>
        <span className="text-[#FFE6A7]">{stat.suffix}</span>
      </p>

      <div
        style={hankenGrotesk}
        className="flex w-full flex-col gap-2 pt-0 sm:w-[280px] sm:shrink-0 sm:pt-3.5"
      >
        <p className="hidden text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFE6A7] sm:block">
          {stat.index}
        </p>
        <p className="text-[12px] font-normal leading-4 text-[#CCC5B9] sm:text-[16px] sm:leading-6">
          {stat.caption}
        </p>
      </div>
    </div>
  )
}

export function AboutStatsSection() {
  const eyebrow = useReveal<HTMLDivElement>(0)
  const line1 = useReveal<HTMLSpanElement>(100)
  const line2 = useReveal<HTMLSpanElement>(220)
  const link = useReveal<HTMLAnchorElement>(300)
  const intro = useReveal<HTMLDivElement>(0)

  return (
    <section
      id="about-stats"
      className="bg-[#252422] px-4 py-16 md:px-12 lg:px-24 lg:py-[88px]"
    >
      <div className="mx-auto flex w-full max-w-[1252px] flex-col gap-8 sm:gap-[62px]">
        {/* Statement: mobile = eyebrow + link on one row, headline below */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-6 sm:flex sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="contents sm:flex sm:flex-col sm:gap-8">
            {/* Eyebrow */}
            <div
              ref={eyebrow.ref}
              style={eyebrow.style}
              className={`flex items-center gap-3 ${eyebrow.className}`}
            >
              <span className="block size-2 bg-[#FFE6A7]" />
              <p
                style={hankenGrotesk}
                className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFFCF2]"
              >
                About us
              </p>
            </div>

            {/* Headline – each line pops up one after another */}
            <h2
              style={baiJamjuree}
              className="col-span-2 flex flex-col gap-1.5 text-[24px] font-medium uppercase leading-[1.05] tracking-[-0.01em] sm:text-[clamp(32px,4.6vw,66px)]"
            >
              <span
                ref={line1.ref}
                style={line1.style}
                className={`font-light text-[#FFFCF2] sm:font-medium ${line1.className}`}
              >
                Built by engineers.
              </span>
              <span
                ref={line2.ref}
                style={line2.style}
                className={`text-[#FFE6A7] ${line2.className}`}
              >
                Trusted by families.
              </span>
            </h2>
          </div>

          {/* Link */}
          <a
            ref={link.ref}
            href="/about"
            style={{ ...hankenGrotesk, ...link.style }}
            className={`group col-start-2 row-start-1 flex shrink-0 items-center gap-1.5 text-[16px] font-bold leading-6 tracking-[-0.02em] text-[#FFE6A7] sm:text-[18px] sm:leading-7 ${link.className}`}
          >
            Read our story
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 sm:h-6 sm:w-6"
              aria-hidden="true"
            >
              <path d="M10 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-7 sm:gap-10 lg:flex-row lg:gap-12">
          <div
            ref={intro.ref}
            style={{ ...hankenGrotesk, ...intro.style }}
            className={`flex flex-col gap-4 pt-0 sm:pt-7 lg:w-[352px] lg:shrink-0 ${intro.className}`}
          >
            <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFFCF2]">
              By the numbers
            </p>
            <p className="text-[16px] font-normal leading-6 text-[#CCC5B9]">
              A decade of building independent homes across Haryana and Delhi NCR — measured in
              keys handed over, square feet built and promises kept.
            </p>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-2 border-b border-[#403D39] sm:flex sm:flex-col">
            {stats.map((stat, i) => (
              <StatRow key={stat.index} stat={stat} order={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}