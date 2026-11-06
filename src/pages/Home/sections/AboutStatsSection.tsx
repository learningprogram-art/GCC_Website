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

function StatRow({ stat, order }: { stat: Stat; order: number }) {
  const { ref, started, display } = useCountUp<HTMLDivElement>(stat.value, stat.decimals, {
    duration: 1000,
    delay: order * 80,
  })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${order * 80}ms` }}
      className={`flex min-h-[160px] flex-col gap-4 border-t border-[#403D39] bg-[#252422] py-7 transition-all duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:flex-row sm:gap-8 ${started ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
    >
      <p
        style={baiJamjuree}
        className="min-w-0 flex-1 text-[clamp(56px,7.2vw,104px)] font-light leading-none tracking-[-0.03em] text-[#FFFCF2] tabular-nums"
      >
        <span>{display}</span>
        <span className="text-[#FFE6A7]">{stat.suffix}</span>
      </p>

      <div style={hankenGrotesk} className="flex w-full flex-col gap-2 pt-3.5 sm:w-[280px] sm:shrink-0">
        <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFE6A7]">
          {stat.index}
        </p>
        <p className="text-[16px] font-normal leading-6 text-[#CCC5B9]">{stat.caption}</p>
      </div>
    </div>
  )
}

export function AboutStatsSection() {
  return (
    <section
      id="about-stats"
      className="bg-[#252422] px-6 py-16 md:px-12 lg:px-24 lg:py-[88px]"
    >
      <div className="mx-auto flex w-full max-w-[1252px] flex-col gap-[62px]">
        {/* Statement */}
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="block size-2 bg-[#FFE6A7]" />
              <p
                style={hankenGrotesk}
                className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFFCF2]"
              >
                About us
              </p>
            </div>

            {/* Headline */}
            <h2
              style={baiJamjuree}
              className="flex flex-col gap-1.5 text-[clamp(32px,4.6vw,66px)] font-medium uppercase leading-[1.05] tracking-[-0.01em]"
            >
              <span className="text-[#FFFCF2]">Built by engineers.</span>
              <span className="text-[#FFE6A7]">Trusted by families.</span>
            </h2>
          </div>

          {/* Link */}
          <a
            href="/about"
            style={hankenGrotesk}
            className="group flex shrink-0 items-center gap-1.5 text-[18px] font-bold leading-7 tracking-[-0.02em] text-[#FFE6A7]"
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
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M10 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <div style={hankenGrotesk} className="flex flex-col gap-4 pt-7 lg:w-[352px] lg:shrink-0">
            <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#FFFCF2]">
              By the numbers
            </p>
            <p className="text-[16px] font-normal leading-6 text-[#CCC5B9]">
              A decade of building independent homes across Haryana and Delhi NCR — measured in
              keys handed over, square feet built and promises kept.
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col border-b border-[#403D39]">
            {stats.map((stat, i) => (
              <StatRow key={stat.index} stat={stat} order={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}