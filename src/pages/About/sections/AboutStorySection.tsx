import { useState } from 'react'

// Set this when the video is ready, e.g. '/assets/videos/about-story.mp4'
const VIDEO_SRC: string | null = null
// Optional poster image shown before playback
const VIDEO_POSTER: string | undefined = undefined

// White SVG in public/. Rendered as a mask so it can take any color.
const GCC_LOGO = '/assets/icons/logo/gcc-logo-white.svg'

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[34%] translate-x-[6%]" aria-hidden>
      <path
        d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5Z"
        fill="#fff"
      />
    </svg>
  )
}

function StoryVideo() {
  const [playing, setPlaying] = useState(false)

  if (VIDEO_SRC && playing) {
    return (
      <video
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        controls
        autoPlay
        playsInline
        className="aspect-[1252/686] w-full rounded-xl bg-[#722220] object-cover"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => VIDEO_SRC && setPlaying(true)}
      aria-label={VIDEO_SRC ? 'Play video: why we started' : 'Video coming soon'}
      aria-disabled={!VIDEO_SRC}
      className={`relative block aspect-[1252/686] w-full overflow-clip rounded-xl bg-[#722220] ${
        VIDEO_SRC ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Poster / placeholder artwork */}
      {VIDEO_POSTER && (
        <img
          src={VIDEO_POSTER}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* "WHY STARTED" + logo, centered */}
      <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[clamp(12px,2.6vw,33px)] px-4">
        <p className="font-bai text-[clamp(24px,4.95vw,62px)] font-bold uppercase not-italic leading-[1.06] text-neutral-3 whitespace-nowrap">
          Why started
        </p>
        <div
          aria-hidden
          className="aspect-[216.814/96.127] w-[clamp(90px,17.3vw,216.8px)] shrink-0 bg-neutral-3"
          style={{
            WebkitMask: `url(${GCC_LOGO}) center / contain no-repeat`,
            mask: `url(${GCC_LOGO}) center / contain no-repeat`,
          }}
        />
      </div>

      {/* Play button */}
      <div className="absolute left-1/2 top-1/2 flex size-[clamp(56px,8vw,100px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-black/40">
        <PlayIcon />
      </div>
    </button>
  )
}

export function AboutStorySection() {
  return (
    <section
      id="about-story"
      className="bg-[#FFFBEE] px-4 py-16 md:px-12 lg:px-24 lg:py-[88px]"
    >
      <div className="mx-auto flex w-full max-w-[1252px] flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-[263px]">
          {/* Eyebrow */}
          <div className="flex shrink-0 items-center gap-3 overflow-clip">
            <span aria-hidden className="size-2 shrink-0 bg-secondary-1" />
            <p className="font-hanken text-xs font-semibold uppercase leading-4 tracking-[0.96px] text-secondary-1 whitespace-nowrap">
              About the company
            </p>
          </div>

          {/* Story copy */}
          <div className="w-full font-bai text-2xl font-normal not-italic leading-[1.4] tracking-[-0.96px] text-neutral-2 [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] md:text-3xl lg:w-[825px] lg:text-[32px]">
            <p className="mb-0">
              With a foundation in construction and engineering, and experience
              extending into design and execution, we know a successful project
              isn’t just about a strong structure.
            </p>
            <p>
              It’s about bringing every part of the process together — from
              planning and design to execution and handover.
            </p>
          </div>
        </div>

        <StoryVideo />
      </div>
    </section>
  )
}