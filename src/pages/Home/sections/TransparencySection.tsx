import type { CSSProperties, MouseEvent } from 'react'
import { useCarousel } from '@/hooks/useAutoSlide'
import { revealClass, useInViewOnce } from '@/hooks/useInViewOnce'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'

// Figma node: 211:5270 — Section / Transparency
const hanken = { fontFamily: '"Hanken Grotesk", sans-serif' }
const bai = { fontFamily: '"Bai Jamjuree", sans-serif' }

/**
 * Card sizes are written in Figma pixels (card inner width = 302) and converted to
 * container units, so everything inside a card scales together with the card width.
 */
const cq = (n: number) => `${((n / 302) * 100).toFixed(3)}cqw`

// Pinned inline so global CSS (h3 / p rules) can never override the Figma values
const TITLE_STYLE: CSSProperties = {
  ...bai,
  fontSize: cq(22),
  lineHeight: cq(28),
  letterSpacing: cq(-0.11),
  fontWeight: 600,
  margin: 0,
}
const BODY_STYLE: CSSProperties = {
  ...hanken,
  fontSize: cq(16),
  lineHeight: 1.3,
  letterSpacing: 0,
  fontWeight: 400,
  margin: 0,
}

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

const GAP = 12 // matches the carousel / grid gap
const AUTO_SLIDE_MS = 2800

// Scrolls to the contact section and shows /contact in the URL (no #hash)
const goToContact = (e: MouseEvent) => {
  e.preventDefault()
  document
    .getElementById('contact-cta')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.pushState(null, '', '/contact')
}

// Layout rules live in plain CSS so Tailwind config or global CSS can't change them
const SECTION_CSS = `
#transparency { padding-left: 1.25rem; padding-right: 1.25rem; }
@media (min-width: 640px)  { #transparency { padding-left: 1.5rem; padding-right: 1.5rem; } }
@media (min-width: 1024px) { #transparency { padding-left: 6rem; padding-right: 6rem; } }

#transparency .tr-track {
  display: flex;
  gap: ${GAP}px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x proximity;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  scroll-padding-left: 20px;
  scrollbar-width: none;
  touch-action: pan-x pan-y;
  overscroll-behavior-x: contain;
  overscroll-behavior-y: auto;
}
#transparency .tr-track::-webkit-scrollbar { display: none; }
#transparency .tr-card {
  flex: 0 0 auto;
  width: min(78vw, 304px);
  scroll-snap-align: start;
}
@media (min-width: 640px) {
  #transparency .tr-track {
    margin-left: -24px;
    margin-right: -24px;
    padding-left: 24px;
    padding-right: 24px;
    scroll-padding-left: 24px;
  }
}
@media (min-width: 1024px) {
  #transparency .tr-track {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${GAP}px;
    overflow: visible;
    overscroll-behavior-x: auto;
    scroll-snap-type: none;
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
  #transparency .tr-card { width: auto; }
  #transparency .tr-dots { display: none; }
}
`

const CARD_REVEAL =
  'transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'

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

/** Fixed-size badge (closing strip) */
function IconBadge({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div
      className={`flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#FFFCF2] ${className}`}
    >
      <img src={src} alt="" className="size-[35.6px]" />
    </div>
  )
}

/** Badge inside a card: scales with the card */
function CardIcon({ src }: { src: string }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[#FFFCF2]"
      style={{ width: cq(50), height: cq(50) }}
    >
      <img src={src} alt="" style={{ width: cq(35.6), height: cq(35.6) }} />
    </div>
  )
}

/* ---------- Card art (positions taken from Figma, scaled with the card) ---------- */

const artBox = (bg: string): CSSProperties => ({
  width: '100%',
  height: cq(247),
  borderRadius: cq(8),
  background: bg,
})

function ArtLiveApp() {
  return (
    <>
      <div style={artBox('#C3003E')} />
      <img
        src={`${IMG}/phone.webp`}
        alt=""
        className="pointer-events-none absolute max-w-none object-cover"
        style={{
          bottom: cq(-21),
          left: cq(-3.13),
          width: cq(326.085),
          height: cq(326.085),
        }}
      />
    </>
  )
}

function ArtQuality() {
  return (
    <div className="relative overflow-hidden" style={artBox('#99582A')}>
      <img
        src={`${IMG}/bricks.webp`}
        alt=""
        className="pointer-events-none absolute max-w-none object-cover"
        style={{ left: cq(-77.45), top: cq(-23.82), width: cq(440.9), height: cq(293.6) }}
      />
      <img
        src={`${IMG}/tick.webp`}
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{ width: cq(251.3), height: cq(251.3) }}
      />
    </div>
  )
}

function ArtProject() {
  return (
    <>
      <div className="relative overflow-hidden" style={artBox('#5B5B5B')}>
        <img
          src={`${IMG}/site-bg.webp`}
          alt=""
          className="pointer-events-none absolute max-w-none object-cover object-bottom"
          style={{ left: cq(-17.06), top: cq(-11.48), width: cq(367.7), height: cq(267) }}
        />
      </div>
      {/* Worker: cropped from the right, exactly like Figma */}
      <div
        className="pointer-events-none absolute bottom-0 overflow-hidden"
        style={{ left: cq(-0.72), width: cq(275.1), height: cq(277.3) }}
      >
        <img
          src={`${IMG}/worker.webp`}
          alt=""
          className="absolute left-0 top-0 h-full max-w-none"
          style={{ width: '110.29%' }}
        />
      </div>
    </>
  )
}

function ArtMaintenance() {
  return (
    <>
      <div className="relative overflow-hidden" style={artBox('#6495B3')}>
        <img
          src={`${IMG}/free.webp`}
          alt="1 year free maintenance"
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-bottom"
        />
      </div>
      <img
        src={`${IMG}/wrench.webp`}
        alt=""
        className="pointer-events-none absolute h-auto max-w-none"
        style={{ left: cq(6), top: cq(-20), width: cq(92) }}
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
  // Scroll reveals
  const [eyebrowRef, eyebrowIn] = useInViewOnce<HTMLDivElement>(0.2)
  const [headingRef, headingIn] = useInViewOnce<HTMLHeadingElement>(0.2)
  const [cardsRef, cardsIn] = useInViewOnce<HTMLDivElement>(0.2)
  const [stripRef, stripIn] = useInViewOnce<HTMLDivElement>(0.2)

  const { trackRef, active, handleScroll, goToCard, trackTouchProps } = useCarousel({
    count: CARDS.length,
    gap: GAP,
    autoSlideMs: AUTO_SLIDE_MS,
    autoSlideMediaQuery: '(max-width: 1023px)',
  })

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section id="transparency" className="relative z-10 -mt-[2px] bg-[#FFE6A7] pt-[4.625rem] pb-[20.625rem] sm:pt-[5.75rem] sm:pb-[5.625rem]">
        <div className="mx-auto flex max-w-[78.25rem] flex-col items-center gap-[2.5rem] sm:gap-[2.125rem]">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-6">
            <div
              ref={eyebrowRef}
              className={`flex items-center gap-3 ${revealClass(eyebrowIn, CARD_REVEAL)}`}
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
              ref={headingRef}
              style={{ ...bai, transitionDelay: '100ms' }}
              className={`max-w-[700px] text-[28px] font-bold uppercase leading-[1.2] text-[#252422] sm:text-[clamp(32px,4vw,48px)] ${revealClass(headingIn, CARD_REVEAL)}`}
            >
              Confidence built through transparency.
            </h2>
          </div>

          {/* Cards: swipe carousel below 1024px, four-column grid from 1024px */}
          <div ref={cardsRef} className="w-full">
            <div
              ref={trackRef}
              onScroll={handleScroll}
              {...trackTouchProps}
              className="tr-track"
            >
              {CARDS.map(({ title, body, icon, Art }, i) => (
                <article
                  key={title}
                  className={`tr-card relative overflow-hidden rounded-xl border border-solid border-[#CCC5B9] bg-white ${revealClass(cardsIn, CARD_REVEAL)}`}
                  style={{
                    transitionDelay: `${i * 120}ms`,
                    aspectRatio: '304 / 500',
                    containerType: 'inline-size',
                  }}
                >
                  <div className="flex flex-col" style={{ padding: cq(20), gap: cq(24) }}>
                    <CardIcon src={icon} />
                    <div
                      className="flex flex-col"
                      style={{ gap: cq(10), marginRight: cq(-8) }}
                    >
                      <h3 style={TITLE_STYLE} className="text-[#252422]">
                        {title}
                      </h3>
                      <p style={BODY_STYLE} className="text-[#403D39]">
                        {body}
                      </p>
                    </div>
                  </div>

                  {/* Art: pinned to the card bottom with 8px padding (same height in every card) */}
                  <div
                    className="absolute inset-x-0 bottom-0 flex flex-col"
                    style={{ padding: cq(8), gap: cq(10) }}
                  >
                    <Art />
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination dots (carousel only, hidden from 1024px) */}
            <div
              className="tr-dots mt-6 flex items-center gap-2"
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
                  onClick={() => goToCard(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === i ? 'w-6 bg-[#6F1D1B]' : 'w-2 bg-[#D9C28A]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Closing strip */}
          <div
            ref={stripRef}
            className={`w-full rounded-xl sm:w-auto sm:bg-white/30 sm:p-[14px] ${revealClass(stripIn, CARD_REVEAL)}`}
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
                href="/contact"
                onClick={goToContact}
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
    </>
  )
}