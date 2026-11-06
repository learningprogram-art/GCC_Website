import { useEffect, useRef, useState } from 'react'
import '@fontsource/bai-jamjuree/600.css'
import '@fontsource/hanken-grotesk/400.css'
import villaImg from '../../../../public/assets/images/villa.png'
import farmhouseImg from '../../../../public/assets/images/farmhouse.png'
import hospitalityImg from '../../../../public/assets/images/hospitality.png'

const baiJamjuree = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hankenGrotesk = { fontFamily: '"Hanken Grotesk", sans-serif' }

const structures = [
  {
    title: 'Villas',
    image: villaImg,
    alt: 'Modern villa with large glass windows and a landscaped lawn',
    description: 'Family-focused design. Strong engineering. Thoughtful finishes.',
  },
  {
    title: 'Farmhouses',
    image: farmhouseImg,
    alt: 'Farmhouse with a gabled roof, timber columns and a wide veranda',
    description:
      'Weekend homes and farm retreats, including projects across the Jewar Airport belt.',
  },
  {
    title: 'Hospitality',
    image: hospitalityImg,
    alt: 'Hospitality building with a poolside lounge area',
    description:
      'Hospitality spaces engineered for durability, efficient execution and the demands of daily use.',
  },
]

/** Returns [ref, inView]. Flips to true once, the first time the element scrolls into view. */
function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
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
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

export function StructuresWeBuildSection() {
  const [headerRef, headerIn] = useInViewOnce<HTMLDivElement>(0.4)
  const [cardsRef, cardsIn] = useInViewOnce<HTMLDivElement>(0.15)

  return (
    <section
      id="structures-we-build"
      className="flex flex-col items-center gap-8 bg-[#FFFCF2] px-6 py-16 md:px-12 lg:px-[120px] lg:py-[100px]"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className={`w-full max-w-[1245px] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          headerIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <h2
          style={baiJamjuree}
          className="text-[28px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#252422] lg:text-[36px] lg:leading-[44px]"
        >
          Structures We Build
        </h2>
      </div>

      {/* Cards row */}
      <div
        ref={cardsRef}
        className="grid w-full max-w-[1245px] grid-cols-1 gap-3 md:grid-cols-3"
      >
        {structures.map((item, i) => (
          <article
            key={item.title}
            style={{ transitionDelay: cardsIn ? `${i * 150}ms` : '0ms' }}
            className={`group flex min-w-0 flex-col overflow-hidden rounded-lg transition-all duration-[800ms] ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              cardsIn ? 'translate-y-0 opacity-100' : 'translate-y-14 opacity-0'
            }`}
          >
            <div className="h-[320px] w-full overflow-hidden rounded-xl bg-[#9D9D9D] lg:h-[408px]">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                style={{ transitionDelay: cardsIn ? `${i * 150}ms` : '0ms' }}
                className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 motion-reduce:scale-100 motion-reduce:transition-none ${
                  cardsIn ? 'scale-100' : 'scale-110'
                }`}
              />
            </div>

            <div className="flex flex-col gap-2 py-5">
              <h3
                style={baiJamjuree}
                className="text-[22px] font-semibold leading-7 tracking-[-0.005em] text-[#252422]"
              >
                {item.title}
              </h3>
              <p
                style={hankenGrotesk}
                className="text-[16px] font-normal leading-6 text-[#403D39]"
              >
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}