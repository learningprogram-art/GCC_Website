import { useEffect, useRef, useState } from 'react'

const HERO_IMG = '/assets/images/about/hero-img.png'

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
    className: `transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`,
  }
}

// x/y/w/h as % of the section (px ÷ 1920 or ÷ 1080 from Figma Dev Mode)
const BLOBS = [
  { left: '22%', top: '2%', width: '48%', height: '48%' },   // behind headline / logo
  { left: '-10%', top: '40%', width: '35%', height: '60%' }, // placeholder for 2nd layer
]

export function AboutHeroSection() {
  const image = useReveal<HTMLDivElement>(0)

  return (
    <section
      id="about-hero"
      className="relative aspect-[16/9] min-h-[560px] w-full overflow-hidden bg-[#252422]"
    >
      <div
        ref={image.ref}
        style={image.style}
        className={`absolute inset-0 ${image.className}`}
      >
        <img
          src={HERO_IMG}
          alt="GCC founders in conversation on stage in front of the GCC logo"
          className="h-full w-full object-cover object-center"
        />

        {BLOBS.map((b, i) => (
          <div
            key={i}
            aria-hidden
            style={b}
            className="pointer-events-none absolute rounded-[2889.514px] bg-[#3F0C0A] opacity-90 blur-[150px]"
          />
        ))}
      </div>

      <div className="relative h-full w-full px-4 pt-28 md:px-[7.2vw] md:pt-[10vw]">
        <h1 className="font-['Bai_Jamjuree'] text-[clamp(40px,6.25vw,120px)] font-bold uppercase not-italic leading-[0.99] text-[color:var(--secondary-3,#FFE6A7)]">
          Two brothers.
          <br />
          One vision.
        </h1>
      </div>
    </section>
  )
}