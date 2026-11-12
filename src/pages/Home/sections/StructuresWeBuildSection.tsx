import { useCarousel } from '@/hooks/useAutoSlide'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import villaImg from '/assets/images/structures/villa.webp'
import farmhouseImg from '/assets/images/structures/farmhouse.webp'
import hospitalityImg from '/assets/images/structures/hospitality.webp'

const baiJamjuree = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hankenGrotesk = { fontFamily: '"Hanken Grotesk", sans-serif' }

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#structures-we-build { padding-left: 1.25rem; padding-right: 1.25rem; }
@media (min-width: 768px)  { #structures-we-build { padding-left: 3rem; padding-right: 3rem; } }
@media (min-width: 1024px) { #structures-we-build { padding-left: 6rem; padding-right: 6rem; } }
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

const GAP = 12 // matches gap-3
const AUTO_SLIDE_MS = 2800

export function StructuresWeBuildSection() {
  const [headerRef, headerIn] = useInViewOnce<HTMLDivElement>(0.4)
  const [cardsRef, cardsIn] = useInViewOnce<HTMLDivElement>(0.15)
  const { trackRef, active, handleScroll, goToCard, trackTouchProps } = useCarousel({
    count: structures.length,
    gap: GAP,
    autoSlideMs: AUTO_SLIDE_MS,
    autoSlideMediaQuery: '(max-width: 767px)',
  })

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="structures-we-build"
        className="relative z-10 -mt-px flex flex-col items-center gap-[2rem] bg-[#FFFCF2] py-[4rem] lg:py-[6.25rem]"
      >
        {/* Header */}
        <div
          ref={headerRef}
          className={`w-full max-w-[77.8125rem] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            headerIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <h2
            style={baiJamjuree}
            className="text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#252422] lg:text-[2.25rem] lg:leading-[2.75rem]"
          >
            Structures We Build
          </h2>
        </div>

        {/* Cards: snap carousel on mobile, 3-col grid from md up */}
        <div ref={cardsRef} className="w-full max-w-[77.8125rem]">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            {...trackTouchProps}
            style={{
              touchAction: 'pan-x pan-y',
              overscrollBehaviorX: 'contain',
              overscrollBehaviorY: 'auto',
            }}
            className="-ml-5 -mr-5 flex snap-x snap-proximity scroll-pl-5 gap-3 overflow-x-auto overflow-y-hidden pl-5 pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:ml-0 md:mr-0 md:grid md:grid-cols-3 md:snap-none md:overflow-visible md:pl-0 md:pr-0"
          >
            {structures.map((item, i) => (
              <article
                key={item.title}
                style={{ transitionDelay: cardsIn ? `${i * 150}ms` : '0ms' }}
                className={`group flex w-[75%] min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-lg transition-[opacity,transform] duration-[800ms] ease-out md:w-auto md:shrink motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
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
                    className={`h-full w-full object-cover pointer-events-none select-none transition-transform duration-[1400ms] ease-out [@media(hover:hover)]:group-hover:scale-105 motion-reduce:scale-100 motion-reduce:transition-none ${
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
                onClick={() => goToCard(i)}
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