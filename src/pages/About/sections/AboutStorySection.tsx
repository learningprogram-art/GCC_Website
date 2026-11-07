import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC: string | null = null
const VIDEO_POSTER: string | undefined = undefined

const GCC_LOGO = '/assets/icons/logo/gcc-logo-white.svg'

// Bottom-up reveal: fade + slide up (same feel as the other sections)
const REVEAL =
  'transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'
const revealState = (shown: boolean) =>
  shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
const delayStyle = (shown: boolean, ms: number) => ({
  transitionDelay: shown ? `${ms}ms` : '0ms',
})

/** Each element gets its own trigger: flips to true once, the first time it scrolls into view. */
function useReveal<T extends HTMLElement>(threshold = 0.2) {
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
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, shown] as const
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[34%] translate-x-[6%]" aria-hidden="true">
      <path
        d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5Z"
        fill="#fff"
      />
    </svg>
  )
}

function StoryVideo() {
  const [playing, setPlaying] = useState(false)
  const [wrapRef, shown] = useReveal<HTMLDivElement>(0.15)

  return (
    <div
      ref={wrapRef}
      style={delayStyle(shown, 0)}
      className={`w-full ${REVEAL} ${revealState(shown)}`}
    >
      {VIDEO_SRC && playing ? (
        <video
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          controls
          autoPlay
          playsInline
          className="aspect-[1252/686] w-full rounded-xl bg-[#722220] object-cover"
        />
      ) : (
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
            <p className="font-['Bai_Jamjuree',sans-serif] text-[clamp(24px,4.95vw,62px)] font-bold uppercase not-italic leading-[1.06] text-[#CCC5B9] whitespace-nowrap">
              Why started
            </p>
            <div
              aria-hidden="true"
              className="aspect-[216.814/96.127] w-[clamp(90px,17.3vw,216.8px)] shrink-0 bg-[#CCC5B9]"
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
      )}
    </div>
  )
}

export function AboutStorySection() {
  const [eyebrowRef, eyebrowIn] = useReveal<HTMLDivElement>()
  const [copyRef, copyIn] = useReveal<HTMLDivElement>(0.15)

  return (
    <section
      id="about-story"
      className="bg-[#FFFCF2] px-6 py-16 sm:px-12 md:px-[96px] lg:px-[6rem] lg:pt-[88px] lg:pb-[88px]"
    >
      <div className="mx-auto flex w-full max-w-[1249px] flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            style={delayStyle(eyebrowIn, 0)}
            className={`flex shrink-0 items-center gap-3 overflow-clip ${REVEAL} ${revealState(eyebrowIn)}`}
          >
            <span aria-hidden="true" className="size-2 shrink-0 bg-[#99582A]" />
            <p className="font-['Hanken_Grotesk',sans-serif] text-xs font-semibold uppercase leading-4 tracking-[0.96px] text-[#99582A] whitespace-nowrap">
              About the company
            </p>
          </div>

          {/* Story copy — matches Figma node 214:7166 */}
          <div
            ref={copyRef}
            className="w-full font-['Bai_Jamjuree',sans-serif] text-2xl font-normal not-italic leading-[1.4] tracking-[-0.96px] text-[#403D39] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] md:text-3xl lg:text-[32px]"
          >
            <p
              style={delayStyle(copyIn, 0)}
              className={`m-0 ${REVEAL} ${revealState(copyIn)}`}
            >
              With a foundation in construction and engineering, and experience extending into design and execution, we know a successful project isn’t just about a strong structure.
            </p>
            <p
              style={delayStyle(copyIn, 150)}
              className={`m-0 ${REVEAL} ${revealState(copyIn)}`}
            >
              It’s about bringing every part of the process together — from planning and design to execution and handover.
            </p>
          </div>
        </div>

        <StoryVideo />
      </div>
    </section>
  )
}

export default AboutStorySection