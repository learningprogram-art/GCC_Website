import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'

// Figma node: 211:5270 — Section / Transparency
const hanken = { fontFamily: '"Hanken Grotesk", sans-serif' }
const bai = { fontFamily: '"Bai Jamjuree", sans-serif' }

// Pinned inline so global CSS (h3 / p rules) can never override the Figma values
const TITLE_STYLE = {
  ...bai,
  fontSize: '22px',
  lineHeight: '28px',
  letterSpacing: '-0.11px',
  fontWeight: 600,
  margin: 0,
} as const
const BODY_STYLE = {
  ...hanken,
  fontSize: '16px',
  lineHeight: 1.3,
  letterSpacing: 0,
  fontWeight: 400,
  margin: 0,
} as const

// Everything lives in public/assets/images/transparency/
const IMG = '/assets/images/transparency'

// Icons (spaces in file names are written as %20)
const ICON_LIVE_APP = `${IMG}/Live%20App.svg`
const ICON_QUALITY = `${IMG}/Quality%20Check.svg`
const ICON_ONE_TEAM = `${IMG}/glyph.svg` // swap with glyph-2.svg if this shows a clock
const ICON_MAINTENANCE = `${IMG}/glyph-2.svg` // swap with glyph.svg if this shows connected dots

const ICONS = [ICON_LIVE_APP, ICON_QUALITY, ICON_ONE_TEAM, ICON_MAINTENANCE]

// First icon sits on top, each later one tucks underneath (as in Figma)
const STACK = ['z-[4]', 'z-[3]', 'z-[2]', 'z-[1]']

const GAP = 12 // matches gap-3
const CARD_W = 304
const CARD_H = 500
const DESIGN_W = CARD_W * 4 + GAP * 3 // 1252: full Figma row width

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
    shown,
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
    }`,
  }
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

/* ---------- Card art (positions taken from Figma) ---------- */

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
        src={`${IMG}/bricks.png`}
        alt=""
        className="pointer-events-none absolute left-[-77.45px] top-[-23.82px] h-[293.6px] w-[440.9px] max-w-none object-cover"
      />
      <img
        src={`${IMG}/tick.png`}
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 size-[251.3px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
      />
    </div>
  )
}

function ArtProject() {
  return (
    <>
      <div className="relative h-[247px] w-full overflow-hidden rounded-lg bg-[#5B5B5B]">
        <img
          src={`${IMG}/site-bg.png`}
          alt=""
          className="pointer-events-none absolute left-[-17.06px] top-[-11.48px] h-[267px] w-[367.7px] max-w-none object-cover object-bottom"
        />
      </div>
      {/* Worker: cropped from the right, exactly like Figma */}
      <div className="pointer-events-none absolute bottom-0 left-[-0.72px] h-[277.3px] w-[275.1px] overflow-hidden">
        <img
          src={`${IMG}/worker.png`}
          alt=""
          className="absolute left-0 top-0 h-full w-[110.29%] max-w-none"
        />
      </div>
    </>
  )
}

function ArtMaintenance() {
  return (
    <>
      <div className="relative h-[247px] w-full overflow-hidden rounded-lg bg-[#6495B3]">
        <img
          src={`${IMG}/free.png`}
          alt="1 year free maintenance"
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-bottom"
        />
      </div>
      <img
        src={`${IMG}/wrench.png`}
        alt=""
        className="pointer-events-none absolute left-[-6px] top-[-20px] h-auto w-[92px] max-w-none"
      />
    </>
  )
}

const CARDS = [
  {
    title: 'Live progress on the Onsite app',
    body: 'Follow your site stage by stage, wherever you are.',
    icon: ICON_LIVE_APP,
    Art: ArtLiveApp,
  },
  {
    title: 'Third-party quality assurance',
    body: 'Independent checks, with reports shared with you.',
    icon: ICON_QUALITY,
    Art: ArtQuality,
  },
  {
    title: 'Project management on every project',
    body: 'Design, execution and timelines under one team.',
    icon: ICON_ONE_TEAM,
    Art: ArtProject,
  },
  {
    title: '1 year of free maintenance (AMC)',
    body: 'Covered after handover — so small fixes never become your problem.',
    icon: ICON_MAINTENANCE,
    Art: ArtMaintenance,
  },
]

export function TransparencySection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [desktop, setDesktop] = useState(false)
  const [scale, setScale] = useState(1)

  // Scroll reveals
  const eyebrow = useReveal<HTMLDivElement>(0)
  const heading = useReveal<HTMLHeadingElement>(100)
  const cards = useReveal<HTMLDivElement>(0) // one trigger for the whole card row
  const strip = useReveal<HTMLDivElement>(0)

  // Desktop (1024px+): keep all four cards in one row and scale the row to fit the width
  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const wrap = wrapRef.current

    const update = () => {
      setDesktop(mq.matches)
      if (wrap) setScale(Math.min(1, wrap.clientWidth / DESIGN_W))
    }

    update()
    const ro = new ResizeObserver(update)
    if (wrap) ro.observe(wrap)
    mq.addEventListener('change', update)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', update)
    }
  }, [])

  // Mobile / tablet carousel: work out the current card from the scroll position
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
      className="bg-[#FFE6A7] px-5 py-[72px] sm:px-6 sm:py-[90px] lg:px-12 min-[1440px]:px-[96px]"
    >
      <div className="mx-auto flex max-w-[1252px] flex-col items-center gap-10 sm:gap-[34px]">
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-6">
          <div
            ref={eyebrow.ref}
            style={eyebrow.style}
            className={`flex items-center gap-3 ${eyebrow.className}`}
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
            ref={heading.ref}
            style={{ ...bai, ...heading.style }}
            className={`max-w-[700px] text-[28px] font-bold uppercase leading-[1.2] text-[#252422] sm:text-[clamp(32px,4vw,48px)] ${heading.className}`}
          >
            Confidence built through transparency.
          </h2>
        </div>

        {/* Cards: swipe carousel below 1024px, one row of four from 1024px */}
        <div ref={cards.ref} className="w-full">
          <div
            ref={wrapRef}
            className="w-full lg:overflow-hidden"
            style={desktop ? { height: CARD_H * scale } : undefined}
          >
            <div
              ref={trackRef}
              onScroll={handleScroll}
              style={desktop ? { transform: `scale(${scale})` } : undefined}
              className="-mx-5 flex w-auto scroll-pl-5 snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:scroll-pl-6 sm:px-6 lg:mx-0 lg:w-[1252px] lg:origin-top-left lg:snap-none lg:overflow-visible lg:px-0"
            >
              {CARDS.map(({ title, body, icon, Art }, i) => (
                <article
                  key={title}
                  style={{ transitionDelay: `${i * 120}ms` }}
                  className={`relative flex h-[500px] w-[78vw] max-w-[304px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-solid border-[#CCC5B9] bg-white transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:w-[304px] lg:max-w-none ${
                    cards.shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                >
                  <div className="flex flex-col gap-6 p-5">
                    <IconBadge src={icon} />
                    <div className="-mr-2 flex flex-col gap-[10px]">
                      <h3 style={TITLE_STYLE} className="text-[#252422]">
                        {title}
                      </h3>
                      <p style={BODY_STYLE} className="text-[#403D39]">
                        {body}
                      </p>
                    </div>
                  </div>

                  {/* Art: pinned to the card bottom with 8px padding (same height in every card) */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[10px] p-2">
                    <Art />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Pagination dots (carousel only, hidden once all four fit) */}
          <div
            className="mt-6 flex items-center gap-2 lg:hidden"
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
          ref={strip.ref}
          style={strip.style}
          className={`w-full rounded-xl sm:w-auto sm:bg-white/30 sm:p-[14px] ${strip.className}`}
        >
          <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="isolate flex items-center">
                {ICONS.map((src, i) => (
                  <IconBadge
                    key={src}
                    src={src}
                    className={`relative border border-solid border-[#FFEEC1] ${STACK[i]} ${
                      i < ICONS.length - 1 ? 'mr-[-19px]' : ''
                    }`}
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
              href="#contact-cta"
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