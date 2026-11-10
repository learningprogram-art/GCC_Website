import { useCallback, useEffect, useRef, useState } from 'react'
import { useAutoSlide } from '@/hooks/useAutoSlide'
import villaImg from '/assets/images/structures/villa.webp'
import farmhouseImg from '/assets/images/structures/farmhouse.webp'
import hospitalityImg from '/assets/images/structures/hospitality.webp'

const baiJamjuree = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hankenGrotesk = { fontFamily: '"Hanken Grotesk", sans-serif' }

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#structures-we-build { padding-left: 16px; padding-right: 16px; }
@media (min-width: 768px)  { #structures-we-build { padding-left: 48px; padding-right: 48px; } }
@media (min-width: 1024px) { #structures-we-build { padding-left: 96px; padding-right: 96px; } }
`

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

const GAP = 12 // matches gap-3
const AUTO_SLIDE_MS = 3000

export function StructuresWeBuildSection() {
  const [headerRef, headerIn] = useInViewOnce<HTMLDivElement>(0.4)
  const [cardsRef, cardsIn] = useInViewOnce<HTMLDivElement>(0.15)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Mobile carousel: work out which card is current from the scroll position
  const handleScroll = () => {
    const el = cardsRef.current
    if (!el || !el.firstElementChild) return
    const cardWidth = (el.firstElementChild as HTMLElement).offsetWidth + GAP
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    const index = atEnd
      ? structures.length - 1
      : Math.round(el.scrollLeft / cardWidth)
    setActive(Math.min(Math.max(index, 0), structures.length - 1))
  }

  const scrollToCard = useCallback(
    (i: number) => {
      const el = cardsRef.current
      if (!el || !el.firstElementChild) return
      const cardWidth = (el.firstElementChild as HTMLElement).offsetWidth + GAP
      el.scrollTo({ left: i * cardWidth, behavior: 'smooth' })
    },
    [cardsRef],
  )

  const advanceMobileSlide = useCallback(() => {
    scrollToCard((activeRef.current + 1) % structures.length)
  }, [scrollToCard])

  const { setIsPaused, pause, resume, resetTimer } = useAutoSlide({
    targetRef: cardsRef,
    intervalMs: AUTO_SLIDE_MS,
    mediaQuery: '(max-width: 767px)',
    onSlide: advanceMobileSlide,
  })

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="structures-we-build"
        className="relative z-10 -mt-px flex flex-col items-center gap-8 bg-[#FFFCF2] py-16 lg:py-[100px]"
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

        {/* Cards: snap carousel on mobile, 3-col grid from md up */}
        <div className="w-full max-w-[1245px]">
          <div
            ref={cardsRef}
            onScroll={handleScroll}
            onTouchStart={pause}
            onTouchEnd={resume}
            onTouchCancel={() => setIsPaused(false)}
            style={{ touchAction: 'pan-y' }}
            className="-ml-4 -mr-4 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto pl-4 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:ml-0 md:mr-0 md:grid md:grid-cols-3 md:snap-none md:overflow-visible md:pl-0 md:pr-0"
          >
            {structures.map((item, i) => (
              <article
                key={item.title}
                style={{ transitionDelay: cardsIn ? `${i * 150}ms` : '0ms' }}
                className={`group flex w-[75%] min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-lg transition-all duration-[800ms] ease-out md:w-auto md:shrink motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  cardsIn ? 'translate-y-0 opacity-100' : 'translate-y-14 opacity-0'
                }`}
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#9D9D9D]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    draggable={false}
                    style={{ transitionDelay: cardsIn ? `${i * 150}ms` : '0ms' }}
                    className={`h-full w-full object-cover pointer-events-none select-none transition-transform duration-[1400ms] ease-out group-hover:scale-105 motion-reduce:scale-100 motion-reduce:transition-none ${
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

          {/* Pagination dots (mobile only) */}
          <div
            className="mt-4 flex items-center gap-2 md:hidden"
            role="tablist"
            aria-label="Structures We Build slides"
          >
            {structures.map((item, i) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Go to ${item.title}`}
                onClick={() => {
                  scrollToCard(i)
                  resetTimer()
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? 'w-6 bg-[#6B1D1D]' : 'w-2 bg-[#C9C5BF]'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default StructuresWeBuildSection