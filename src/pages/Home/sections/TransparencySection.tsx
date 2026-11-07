import { useEffect, useRef, useState } from 'react'

const hanken = { fontFamily: '"Hanken Grotesk", sans-serif' }
const bai = { fontFamily: '"Bai Jamjuree", sans-serif' }

const IMG = '/assets/images/transparency'

const ICON_LIVE_APP = `${IMG}/Live%20App.svg`
const ICON_QUALITY = `${IMG}/Quality%20Check.svg`
const ICON_ONE_TEAM = `${IMG}/glyph.svg`
const ICON_MAINTENANCE = `${IMG}/glyph-2.svg`

const ICONS = [ICON_LIVE_APP, ICON_QUALITY, ICON_ONE_TEAM, ICON_MAINTENANCE]

const GAP = 12

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

function ChevronRight() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 6l6 6-6 6" />
    </svg>
  )
}

function IconBadge({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div
      className={`flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#FFFCF2] ${className}`}
    >
      <img src={src} alt="" className="size-[35.6px]" />
    </div>
  )
}

/* ---------- Card art ---------- */

function ArtLiveApp() {
  return (
    <>
      <div className="h-[247px] w-full rounded-lg bg-[#C3003E]" />
      <img
        src={`${IMG}/phone.png`}
        alt=""
        className="pointer-events-none absolute bottom-[-21px] left-[-3.13px] size-[326px] max-w-none object-cover"
      />
    </>
  )
}

function ArtQuality() {
  return (
    <div className="relative h-[247px] w-full overflow-hidden rounded-lg bg-[#99582A]">
      <img
        src={`${IMG}/calendar.png`}
        alt=""
        className="pointer-events-none absolute left-[15px] top-[14px] h-[190px] w-[257px] max-w-none object-cover"
      />
      <div className="pointer-events-none absolute bottom-[-26px] right-[-24px] size-[187px] rounded-full bg-[#E06422] opacity-70 blur-[50px]" />
    </div>
  )
}

function ArtOneTeam() {
  return (
    <div className="relative h-[247px] w-full overflow-hidden rounded-lg bg-[#403D39]">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #FFFCF2 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center text-white">
        <span
          style={bai}
          className="text-[44px] font-bold leading-none tracking-tight text-[#FFE6A7]"
        >
          1 Team
        </span>
        <span style={hanken} className="text-xs uppercase tracking-[1px] text-[#CCC5B9]">
          Design to Handover
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-[-20px] left-[-20px] size-[160px] rounded-full bg-[#E06422] opacity-40 blur-[45px]" />
    </div>
  )
}

function ArtMaintenance() {
  return (
    <div className="relative h-[247px] w-full overflow-hidden rounded-lg bg-[#252422]">
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E06422]/20 text-[#E06422]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span style={bai} className="text-lg font-bold text-white">
          AMC Portal
        </span>
        <span style={hanken} className="text-xs text-[#CCC5B9]">
          Post-handover warranty & service
        </span>
      </div>
    </div>
  )
}

const CARDS = [
  {
    title: 'Live App Tracking',
    body: 'Daily site photos, progress logs, material receipts, and milestone verification updated right on your phone.',
    icon: ICON_LIVE_APP,
    Art: ArtLiveApp,
  },
  {
    title: 'Stage QA Checks',
    body: 'Over 200+ structural quality checks performed and certified before moving to each subsequent construction stage.',
    icon: ICON_QUALITY,
    Art: ArtQuality,
  },
  {
    title: 'One Dedicated Team',
    body: 'Zero finger-pointing. Architecture, structural engineering, and construction handled seamlessly by one team.',
    icon: ICON_ONE_TEAM,
    Art: ArtOneTeam,
  },
  {
    title: '10-Year Warranty',
    body: 'Comprehensive structural warranty paired with digital AMC portal access for complete long-term peace of mind.',
    icon: ICON_MAINTENANCE,
    Art: ArtMaintenance,
  },
]

export function TransparencySection() {
  const [sectionRef, inView] = useInViewOnce<HTMLElement>(0.1)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const handleScroll = () => {
    const el = trackRef.current
    if (!el || !el.firstElementChild) return
    const step = (el.firstElementChild as HTMLElement).offsetWidth + GAP
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    const index = atEnd ? CARDS.length - 1 : Math.round(el.scrollLeft / step)
    setActive(Math.min(Math.max(index, 0), CARDS.length - 1))
  }

  const scrollToCard = (i: number) => {
    const el = trackRef.current
    if (!el || !el.firstElementChild) return
    const step = (el.firstElementChild as HTMLElement).offsetWidth + GAP
    el.scrollTo({ left: i * step, behavior: 'smooth' })
  }

  return (
    <section
      id="transparency"
      ref={sectionRef}
      className="bg-[#FFE6A7] px-5 pt-[72px] pb-[100px] sm:px-6 sm:pt-[90px] sm:pb-[120px] lg:px-[96px] lg:pb-[140px]"
    >
      <div className="mx-auto flex max-w-[1252px] flex-col items-center gap-10 sm:gap-[34px]">
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-6">
          <div
            className={`flex items-center gap-3 transition-all duration-700 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <span className="size-2 bg-[#E06422]" aria-hidden />
            <p
              style={hanken}
              className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#6F1D1B]"
            >
              Transparency
            </p>
          </div>
          <h2
            style={bai}
            className={`max-w-[700px] text-[28px] font-bold uppercase leading-[1.2] text-[#252422] sm:text-[clamp(32px,4vw,48px)] transition-all duration-700 delay-100 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            Confidence built through transparency.
          </h2>
        </div>

        {/* Cards: snap carousel on mobile, wrapped row from sm up */}
        <div className="w-full">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="-mx-5 flex w-auto scroll-pl-5 snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:w-full sm:snap-none sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
          >
            {CARDS.map(({ title, body, icon, Art }, i) => (
              <article
                key={title}
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`relative flex h-[500px] w-[78vw] max-w-[304px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl border border-solid border-[#CCC5B9] bg-white transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:w-[304px] sm:max-w-full sm:shrink ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                <div className="flex flex-col gap-6 p-5">
                  <IconBadge src={icon} />
                  <div className="flex flex-col gap-[10px]">
                    <h3
                      style={bai}
                      className="text-[22px] font-semibold leading-7 tracking-[-0.11px] text-[#252422]"
                    >
                      {title}
                    </h3>
                    <p
                      style={hanken}
                      className="text-[16px] font-normal leading-[1.3] text-[#403D39]"
                    >
                      {body}
                    </p>
                  </div>
                </div>

                <div className="relative flex w-full flex-col gap-[10px] p-2">
                  <Art />
                </div>
              </article>
            ))}
          </div>

          {/* Pagination dots (mobile only) */}
          <div
            className="mt-6 flex items-center gap-2 sm:hidden"
            role="tablist"
            aria-label="Transparency cards"
          >
            {CARDS.map(({ title }, i) => (
              <button
                key={title}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Go to ${title}`}
                onClick={() => scrollToCard(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? 'w-6 bg-[#6F1D1B]' : 'w-2 bg-[#D9C28A]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Closing strip */}
        <div
          className={`w-full rounded-xl sm:w-auto sm:bg-white/30 sm:p-[14px] transition-all duration-700 delay-200 ease-out ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center">
                {ICONS.map((src, i) => (
                  <IconBadge
                    key={src}
                    src={src}
                    className={`border border-solid border-[#FFEEC1] ${i < ICONS.length - 1 ? 'mr-[-19px]' : ''}`}
                  />
                ))}
              </div>
              <p
                style={hanken}
                className="text-[18px] font-normal leading-[1.3] tracking-[-0.36px] text-[#403D39] sm:text-[20px] sm:font-medium sm:leading-[1.2] sm:tracking-[-0.4px] sm:text-[#252422]"
              >
                All four come with every GCC home,{' '}
                <br className="hidden sm:inline" />
                not optional add-ons.
              </p>
            </div>

            <a
              href="/#contact-cta"
              style={hanken}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#6F1D1B] px-5 py-4 text-[18px] font-bold leading-7 tracking-[-0.36px] text-white transition-colors hover:bg-[#5a1716] sm:w-auto sm:justify-start sm:py-3 sm:pl-6 sm:pr-5"
            >
              Book a Consultation
              <ChevronRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TransparencySection
