import { useEffect, useRef, useState } from 'react'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'

// Figma node: 211:5270 — Section / Transparency
const hanken = { fontFamily: '"Hanken Grotesk", sans-serif' }
const bai = { fontFamily: '"Bai Jamjuree", sans-serif' }

// Everything lives in public/assets/images/transparency/
const IMG = '/assets/images/transparency'

// Icons (spaces in file names are written as %20)
const ICON_LIVE_APP = `${IMG}/Live%20App.svg`
const ICON_QUALITY = `${IMG}/Quality%20Check.svg`
const ICON_ONE_TEAM = `${IMG}/glyph.svg` // swap with glyph-2.svg if this shows a clock
const ICON_MAINTENANCE = `${IMG}/glyph-2.svg` // swap with glyph.svg if this shows connected dots

const ICONS = [ICON_LIVE_APP, ICON_QUALITY, ICON_ONE_TEAM, ICON_MAINTENANCE]

const GAP = 12 // matches gap-3

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
      <img
        src={`${IMG}/worker.png`}
        alt=""
        className="pointer-events-none absolute bottom-0 left-[-0.72px] h-[277.3px] w-[275.1px] max-w-none object-cover object-bottom"
      />
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
  const [active, setActive] = useState(0)

  // Scroll reveals
  const eyebrow = useReveal<HTMLDivElement>(0)
  const heading = useReveal<HTMLHeadingElement>(100)
  const cards = useReveal<HTMLDivElement>(0) // one trigger for the whole card row
  const strip = useReveal<HTMLDivElement>(0)

  // Mobile carousel: work out the current card from the scroll position
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
      className="bg-[#FFE6A7] px-5 py-[72px] sm:px-6 sm:py-[90px] lg:px-[96px]"
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

        {/* Cards: snap carousel on mobile, wrapped row from sm up */}
        <div ref={cards.ref} className="w-full">
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
                  cards.shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
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
          ref={strip.ref}
          style={strip.style}
          className={`w-full rounded-xl sm:w-auto sm:bg-white/30 sm:p-[14px] ${strip.className}`}
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