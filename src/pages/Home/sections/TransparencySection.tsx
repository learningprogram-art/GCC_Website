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
  return (
    <section
      id="transparency"
      className="bg-[#FFE6A7] px-6 py-[90px] lg:px-[96px]"
    >
      <div className="mx-auto flex max-w-[1252px] flex-col items-center gap-[34px]">
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex items-center gap-3">
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
            className="max-w-[700px] text-[clamp(32px,4vw,48px)] font-bold uppercase leading-[1.2] text-[#252422]"
          >
            Confidence built through transparency.
          </h2>
        </div>

        {/* Cards */}
        <div className="flex w-full flex-wrap justify-center gap-3">
          {CARDS.map(({ title, body, icon, Art }) => (
            <article
              key={title}
              className="relative flex h-[500px] w-[304px] max-w-full flex-col justify-between overflow-hidden rounded-xl border border-solid border-[#CCC5B9] bg-white"
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

        {/* Closing strip */}
        <div className="rounded-xl bg-white/30 p-[14px]">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <div className="flex items-center gap-4">
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
                className="text-[20px] font-medium leading-[1.2] tracking-[-0.4px] text-[#252422]"
              >
                All four come with every GCC home,
                <br />
                not optional add-ons.
              </p>
            </div>

            <a
              href="#contact-cta"
              style={hanken}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#6F1D1B] py-3 pl-6 pr-5 text-[18px] font-bold leading-7 tracking-[-0.36px] text-white transition-colors hover:bg-[#5a1716]"
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