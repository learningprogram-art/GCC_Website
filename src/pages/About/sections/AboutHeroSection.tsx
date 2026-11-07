import { useEffect, useRef, useState } from 'react'

const HERO_IMG = '/assets/images/about/hero-img.webp'

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

// Figma Dev Mode Glow Filter:
// border-radius: 2889.514px;
// opacity: 0.9;
// background: #3F0C0A;
// filter: blur(150px);
const BLOBS = [
  // Primary glow blanket directly behind "TWO BROTHERS. ONE VISION." & top-left area
  { left: '-6%', top: '-8%', width: '64%', height: '74%' },
  // Ambient fill extending toward center stage & background mark
  { left: '18%', top: '0%', width: '46%', height: '52%' },
]

export function AboutHeroSection() {
  const [heroRef, inView] = useInViewOnce<HTMLDivElement>(0)

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

        {/* Ambient Maroon Glows matching Figma Dev Mode */}
        {BLOBS.map((b, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: b.left,
              top: b.top,
              width: b.width,
              height: b.height,
              borderRadius: '2889.514px',
              backgroundColor: '#3F0C0A',
              opacity: 0.9,
              filter: 'blur(150px)',
              WebkitFilter: 'blur(150px)',
              transform: 'translate3d(0, 0, 0)',
              willChange: 'filter',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>

      <div className="relative h-full w-full px-4 pt-28 md:px-[7.2vw] md:pt-[10vw] lg:px-24">
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