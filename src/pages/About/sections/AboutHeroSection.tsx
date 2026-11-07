import { useEffect, useRef, useState } from 'react'

const HERO_IMG = '/assets/images/about/hero-img.png'

function useInViewOnce<T extends HTMLElement>(threshold = 0.1) {
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

const BLOBS = [
  { left: '22%', top: '2%', width: '48%', height: '48%' },
  { left: '-10%', top: '40%', width: '35%', height: '60%' },
]

export function AboutHeroSection() {
  const [heroRef, inView] = useInViewOnce<HTMLDivElement>(0.1)

  return (
    <section
      id="about-hero"
      ref={heroRef}
      className="relative aspect-[16/9] min-h-[500px] sm:min-h-[560px] w-full overflow-hidden bg-[#252422]"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          inView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={HERO_IMG}
          alt="GCC founders in conversation on stage in front of the GCC logo"
          className="h-full w-full object-cover object-center"
        />

        {BLOBS.map((b, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={b}
            className="pointer-events-none absolute rounded-[2889.514px] bg-[#3F0C0A] opacity-90 blur-[150px]"
          />
        ))}
      </div>

      <div className="relative h-full w-full px-4 pt-28 md:px-[7.2vw] md:pt-[10vw]">
        <h1 className="font-['Bai_Jamjuree'] text-[clamp(40px,6.25vw,120px)] font-bold uppercase not-italic leading-[0.99] text-[#FFE6A7]">
          Two brothers.
          <br />
          One vision.
        </h1>
      </div>
    </section>
  )
}

export default AboutHeroSection
