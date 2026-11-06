import { useCallback, useEffect, useRef, useState } from "react"
import "@fontsource/hanken-grotesk/400.css"
import "@fontsource/hanken-grotesk/600.css"

// Figma node: 211:5198 — Why GCC
const CARDS = [
  {
    id: "01",
    tab: "Engineering Strength",
    title: ["Engineering", "Strength"],
    body: "Structural engineering and detailed drawings that ensure the design is built right from the start.",
    image: "/assets/images/card-01.png",
    alt: "Worker on a concrete beam while a crane lifts a concrete block",
  },
  {
    id: "02",
    tab: "Built for the Long Term",
    title: ["Built for", "the Long Term"],
    body: "Construction focused on durability, quality, reliability and lasting value.",
    image: "/assets/images/card-02.png",
    alt: "Clock on a pink wall beside a terracotta arch and yellow stairs",
  },
  {
    id: "03",
    tab: "End-to-End Ownership",
    title: ["End-to-End", "Ownership"],
    body: "One team taking responsibility from the first plan to final handover.",
    image: "/assets/images/card-03.png",
    alt: "A winding cream path with a ball at the bottom",
  },
  {
    id: "04",
    tab: "Transparent Execution",
    title: ["Transparent", "Execution"],
    body: "Clear processes and communication that keep every stage visible.",
    image: "/assets/images/card-04.png",
    alt: "Hand holding a phone showing a 3D building model at a construction site",
  },
]

const N = CARDS.length
const TOTAL = String(N).padStart(2, "0")
const REPEATS = 9
const BASE_INDEX = Math.floor(REPEATS / 2) * N // Center cycle starts at index 16

const TRACK_ITEMS = Array.from({ length: REPEATS * N }, (_, idx) => ({
  idx,
  cardIndex: idx % N,
  card: CARDS[idx % N],
}))

/** Returns [ref, inView]. Flips to true once, the first time the element scrolls into view. */
function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, threshold])

  return [ref, inView] as const
}

export function WhyGccSection() {
  const [headRef, headIn] = useInViewOnce<HTMLDivElement>(0.3)
  const [carouselRef, carouselIn] = useInViewOnce<HTMLDivElement>(0.15)

  // Track position in infinite buffer
  const [trackIndex, setTrackIndex] = useState(BASE_INDEX)
  const [instant, setInstant] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const activeCardIndex = ((trackIndex % N) + N) % N

  // Navigate to next card (infinite loop)
  const goNext = useCallback(() => {
    setInstant(false)
    setTrackIndex((prev) => prev + 1)
  }, [])

  // Navigate to previous card (infinite loop)
  const goPrev = useCallback(() => {
    setInstant(false)
    setTrackIndex((prev) => prev - 1)
  }, [])

  // Navigate to a specific tab / dot via the shortest path
  const goToCard = useCallback((target: number) => {
    setInstant(false)
    setTrackIndex((prev) => {
      const curMod = ((prev % N) + N) % N
      let diff = target - curMod
      if (diff > N / 2) diff -= N
      if (diff < -N / 2) diff += N
      return prev + diff
    })
  }, [])

  // Silently re-center when drifting near buffer edges
  const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current || e.propertyName !== "transform") return
    setTrackIndex((current) => {
      const curMod = ((current % N) + N) % N
      if (current < N * 2 || current >= N * (REPEATS - 2)) {
        setInstant(true)
        return BASE_INDEX + curMod
      }
      return current
    })
  }, [])

  useEffect(() => {
    if (instant) {
      const raf = requestAnimationFrame(() => setInstant(false))
      return () => cancelAnimationFrame(raf)
    }
  }, [instant])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goPrev()
      } else if (e.key === "ArrowRight") {
        goNext()
      }
    },
    [goPrev, goNext]
  )

  // Touch swipe (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext()
      else goPrev()
    }
  }

  return (
    <section
      id="why-gcc"
      className="relative w-full overflow-hidden bg-[#6F1D1B] text-[#FFFCF2] py-[5rem] md:py-[7rem] px-[1.5rem] md:px-[3rem] lg:px-[6rem]"
      style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65rem] h-[35rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,139,36,0.18)_0%,rgba(111,29,27,0)_70%)] blur-[60px]"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div
          ref={headRef}
          className={`why-gcc-head transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${headIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <p className="why-gcc-eyebrow">
            <span className="why-gcc-dot" aria-hidden />
            WHY GCC
            <span className="why-gcc-dot why-gcc-dot--end" aria-hidden />
          </p>
          <h2 className="why-gcc-title">The GCC Difference</h2>
        </div>

        {/* Tabs (hidden on mobile) */}
        <div
          style={{ transitionDelay: headIn ? "120ms" : "0ms" }}
          className={`why-gcc-tabs transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${headIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          role="tablist"
          aria-label="Why GCC tabs"
        >
          {CARDS.map((c, i) => {
            const isActive = i === activeCardIndex
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-active={isActive}
                onClick={() => goToCard(i)}
                className="why-gcc-tab"
              >
                <span className="why-gcc-tab__n">{c.id}</span>
                <span>{c.tab}</span>
              </button>
            )
          })}
        </div>

        {/* Carousel Slider */}
        <div
          ref={carouselRef}
          style={{ transitionDelay: carouselIn ? "150ms" : "0ms" }}
          className={`why-gcc transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${carouselIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <div
            className="why-gcc__viewport"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="why-gcc__track"
              style={{
                transform: `translateX(calc(var(--x0) - ${trackIndex} * (var(--w) + var(--gap))))`,
                transition: instant ? "none" : "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {TRACK_ITEMS.map((item) => {
                const isActive = item.idx === trackIndex
                const distFromActive = Math.abs(item.idx - trackIndex)
                const isSide = distFromActive === 1
                const isFar = distFromActive > 1

                return (
                  <div
                    key={item.idx}
                    data-active={isActive}
                    data-side={isSide}
                    data-far={isFar}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    onClick={() => {
                      if (!isActive) {
                        setInstant(false)
                        setTrackIndex(item.idx)
                      }
                    }}
                    className="why-gcc__card"
                  >
                    {/* Left text column */}
                    <div className="why-gcc__text">
                      <span className="why-gcc__num">{item.card.id}</span>
                      <div className="why-gcc__text-content">
                        <h3 className="why-gcc__ctitle">
                          {item.card.title[0]}{" "}
                          <br />
                          {item.card.title[1]}
                        </h3>
                        <p className="why-gcc__body">{item.card.body}</p>

                        {/* Footer (mobile only) */}
                        <div className="why-gcc__foot">
                          <a href="#projects" className="why-gcc__more">
                            See our work
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M10 6l6 6-6 6" />
                            </svg>
                          </a>
                          <span className="why-gcc__count">
                            {item.card.id} / {TOTAL}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right image column */}
                    <div className="why-gcc__img">
                      <img src={item.card.image} alt={item.card.alt} draggable={false} />
                      {/* Red overlay tint on inactive side cards */}
                      <div className="why-gcc__img-tint" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom row: dots (mobile only) + navigation arrows */}
          <div className="why-gcc__arrows">
            <div className="why-gcc__dots" role="tablist" aria-label="Choose card">
              {CARDS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === activeCardIndex}
                  aria-label={`Go to ${c.tab}`}
                  data-active={i === activeCardIndex}
                  onClick={() => goToCard(i)}
                  className="why-gcc__pip"
                />
              ))}
            </div>

            <div className="why-gcc__arrow-group">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous card"
                className="why-gcc__arrow why-gcc__arrow--prev"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next card"
                className="why-gcc__arrow why-gcc__arrow--next"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .why-gcc-sec {
          font-family: "Bai Jamjuree", sans-serif;
          position: relative;
          overflow: hidden;
          background-color: #5b1311;
        }

        /* Ambient bottom glow */
        .why-gcc-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 65% 35% at 50% 88%,
            rgba(232, 118, 30, 0.85) 0%,
            rgba(205, 92, 26, 0.45) 35%,
            rgba(91, 19, 17, 0) 75%
          );
          z-index: 0;
        }

        /* Subtle animated dot grid background */
        .why-gcc-dots {
          position: absolute;
          inset: -30px;
          pointer-events: none;
          background-image: radial-gradient(rgba(255, 245, 230, 0.16) 1.5px, transparent 1.6px);
          background-size: 36px 36px;
          animation: why-gcc-dots-float 8s ease-in-out infinite alternate;
          z-index: 0;
        }

        @keyframes why-gcc-dots-float {
          0% {
            opacity: 0.65;
            transform: translateY(0);
          }
          50% {
            opacity: 0.95;
            transform: translateY(-3px);
          }
          100% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }

        /* Headings */
        .why-gcc-head {
          text-align: center;
          margin-bottom: 24px;
        }
        .why-gcc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #f2c98a;
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        .why-gcc-dot {
          width: 5px;
          height: 5px;
          background-color: #f2c98a;
          border-radius: 1px;
          display: inline-block;
        }
        .why-gcc-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 500;
          line-height: 1.15;
          color: #fff6e6;
        }

        /* Tabs — solid fills so the dot grid and glow never show through */
        .why-gcc-tabs {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 44px;
        }
        .why-gcc-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 12px;
          font-family: inherit;
          border-radius: 8px;
          color: #f6e4cf;
          background-color: #4a110e; /* solid */
          border: 1px solid #7a3a33; /* solid, replaces white/16% */
          cursor: pointer;
          transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, transform 0.2s ease;
        }
        .why-gcc-tab:hover {
          background-color: #5a1713;
          border-color: #94504a;
        }
        .why-gcc-tab__n {
          opacity: 0.65;
          font-size: 11px;
        }
        .why-gcc-tab[data-active="true"] {
          background-color: #fffdf2;
          color: #252422;
          border-color: #fffdf2;
          font-weight: 500;
        }
        .why-gcc-tab[data-active="true"] .why-gcc-tab__n {
          opacity: 0.85;
        }

        /* Carousel container */
        .why-gcc {
          --w: min(86vw, 760px);
          --h: clamp(320px, 42vw, 430px);
          --gap: 28px;
          --x0: calc(50% - var(--w) / 2); /* active card centered */
          position: relative;
          width: 100%;
        }

        .why-gcc__viewport {
          position: relative;
          width: 100%;
          overflow: visible;
        }

        /* Sliding track */
        .why-gcc__track {
          display: flex;
          align-items: center;
          gap: var(--gap);
          will-change: transform;
        }

        /* Card */
        .why-gcc__card {
          flex: 0 0 var(--w);
          width: var(--w);
          height: var(--h);
          display: flex;
          overflow: hidden;
          border-radius: 16px;
          text-align: left;
          cursor: pointer;
          user-select: none;
          background: #521410;
          color: #d48d80;
          box-shadow: 0 14px 40px rgba(30, 5, 3, 0.35);
          transform: scale(0.96);
          opacity: 0.82;
          transition:
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.5s ease,
            color 0.5s ease,
            box-shadow 0.5s ease,
            opacity 0.5s ease;
        }

        /* Active center card */
        .why-gcc__card[data-active="true"] {
          background: #fffdf2;
          color: #252422;
          cursor: default;
          transform: scale(1);
          opacity: 1;
          box-shadow: 0 24px 60px rgba(30, 5, 3, 0.45);
          z-index: 2;
        }

        /* Distant cards hidden from layout attention */
        .why-gcc__card[data-far="true"] {
          opacity: 0.35;
        }

        /* Card text column */
        .why-gcc__text {
          flex: 0 0 44%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(20px, 3.2vw, 40px);
          position: relative;
          z-index: 1;
        }

        /* Card text pop-up reveal */
        .why-gcc__text-content {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
        }
        .why-gcc__card[data-active="true"] .why-gcc__text-content {
          transform: translateY(0);
          opacity: 1;
        }
        .why-gcc__card:not([data-active="true"]) .why-gcc__text-content {
          transform: translateY(12px);
          opacity: 0.85;
        }

        /* Card number */
        .why-gcc__num {
          font-family: "Bai Jamjuree", sans-serif;
          font-size: 22px;
          font-weight: 500;
          line-height: 1;
          color: #d48d80;
          transition: font-size 0.65s cubic-bezier(0.22, 1, 0.36, 1), color 0.5s ease;
        }
        .why-gcc__card[data-active="true"] .why-gcc__num {
          font-size: clamp(68px, 9vw, 116px);
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #6f1d1b;
        }

        /* Card title */
        .why-gcc__ctitle {
          font-family: "Bai Jamjuree", sans-serif;
          font-size: 19px;
          font-weight: 600;
          line-height: 1.22;
          letter-spacing: -0.01em;
          color: #d48d80;
          margin-bottom: 12px;
          transition: font-size 0.65s cubic-bezier(0.22, 1, 0.36, 1), color 0.5s ease;
        }
        .why-gcc__card[data-active="true"] .why-gcc__ctitle {
          font-size: clamp(22px, 2.6vw, 35px);
          color: #252422;
        }

        /* Card body */
        .why-gcc__body {
          font-size: 12px;
          line-height: 1.5;
          color: #b56f64;
          max-width: 32ch;
          transition: font-size 0.5s ease, color 0.5s ease;
        }
        .why-gcc__card[data-active="true"] .why-gcc__body {
          font-size: 14px;
          line-height: 1.55;
          color: #55524e;
        }

        /* Mobile-only footer (hidden on desktop) */
        .why-gcc__foot {
          display: none;
        }

        /* Card image column */
        .why-gcc__img {
          position: relative;
          flex: 1;
          min-width: 0;
          height: 100%;
        }
        .why-gcc__img img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Red tint overlay on inactive card images */
        .why-gcc__img-tint {
          position: absolute;
          inset: 0;
          background-color: #521410;
          opacity: 0.72;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        .why-gcc__card[data-active="true"] .why-gcc__img-tint {
          opacity: 0;
        }

        /* Navigation Arrows */
        .why-gcc__arrows {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 36px;
          position: relative;
          z-index: 10;
        }
        .why-gcc__dots {
          display: none; /* mobile only */
        }
        .why-gcc__arrow-group {
          display: contents; /* desktop: arrows behave exactly as before */
        }
        .why-gcc__arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;
        }
        .why-gcc__arrow:not(:disabled):hover {
          transform: scale(1.06);
        }
        .why-gcc__arrow:not(:disabled):active {
          transform: scale(0.94);
        }
        .why-gcc__arrow:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .why-gcc__arrow--prev {
          background: #4a110e;
          color: #f6e4cf;
          border: 1px solid #7a3a33;
        }
        .why-gcc__arrow--prev:not(:disabled):hover {
          background: #5b1612;
        }
        .why-gcc__arrow--next {
          background: #fffdf2;
          color: #252422;
          border: 1px solid #fffdf2;
        }
        .why-gcc__arrow--next:not(:disabled):hover {
          background: #ffffff;
        }

        .why-gcc__card:focus-visible,
        .why-gcc__arrow:focus-visible,
        .why-gcc__pip:focus-visible,
        .why-gcc-tab:focus-visible {
          outline: 2px solid #f2c98a;
          outline-offset: 3px;
        }

        /* ───────────── Mobile layout ───────────── */
        @media (max-width: 640px) {
          section.why-gcc-sec {
            padding: 72px 20px 64px;
          }

          /* Heading: left-aligned, single orange square */
          .why-gcc-head {
            text-align: left;
            margin-bottom: 28px;
          }
          .why-gcc-eyebrow {
            font-size: 12px;
            letter-spacing: 0.12em;
            gap: 12px;
            margin-bottom: 16px;
          }
          .why-gcc-dot {
            width: 8px;
            height: 8px;
            background-color: #ff9a2e;
          }
          .why-gcc-dot--end {
            display: none;
          }

          /* Tabs are replaced by dots */
          .why-gcc-tabs {
            display: none;
          }

          /* Carousel: card left-aligned with the next one peeking in */
          .why-gcc {
            --w: 84vw;
            --h: auto;
            --gap: 12px;
            --x0: 0px;
          }
          .why-gcc__viewport {
            overflow: hidden; /* hides the previous card on the left */
            width: calc(100% + 20px); /* bleed to the screen edge on the right */
            touch-action: pan-y;
          }
          .why-gcc__track {
            align-items: flex-start;
          }

          /* Card: image on top, text below */
          .why-gcc__card,
          .why-gcc__card[data-active="true"],
          .why-gcc__card[data-far="true"] {
            flex-direction: column-reverse;
            transform: none;
            opacity: 1;
            box-shadow: none;
            min-height: 0;
            background: #c8531d; /* inactive peek card */
          }
          .why-gcc__card[data-active="true"] {
            background: #fffdf2;
          }

          .why-gcc__img {
            flex: none;
            height: calc(var(--w) * 0.64);
          }
          .why-gcc__img-tint {
            background-color: #1b0d0c;
            opacity: 0.85;
          }
          .why-gcc__card[data-active="true"] .why-gcc__img-tint {
            opacity: 0;
          }

          .why-gcc__text {
            flex: none;
            justify-content: flex-start;
            padding: 20px 20px 24px;
          }

          .why-gcc__num {
            color: #ffd9c2;
            margin-bottom: 12px;
          }
          .why-gcc__card[data-active="true"] .why-gcc__num {
            font-size: 60px;
          }

          .why-gcc__ctitle {
            color: #ffe9da;
            margin-bottom: 8px;
          }
          .why-gcc__ctitle br {
            display: none; /* one line on mobile */
          }
          .why-gcc__card[data-active="true"] .why-gcc__ctitle {
            font-size: 22px;
          }

          .why-gcc__body {
            font-family: "Hanken Grotesk", sans-serif;
            color: #ffcfb4;
            max-width: none;
          }
          .why-gcc__card[data-active="true"] .why-gcc__body {
            font-size: 15px;
            line-height: 1.6;
            min-height: calc(15px * 1.6 * 3); /* keeps card height steady between cards */
          }

          /* Footer: only on the active card */
          .why-gcc__card[data-active="true"] .why-gcc__foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #cfc9bc;
          }
          .why-gcc__more {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 18px;
            font-weight: 600;
            color: #6f1d1b;
            text-decoration: none;
          }
          .why-gcc__count {
            font-family: "Hanken Grotesk", sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #403d39;
          }

          /* Bottom row: dots left, arrows right */
          .why-gcc__arrows {
            justify-content: space-between;
            margin-top: 28px;
          }
          .why-gcc__dots {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .why-gcc__pip {
            position: relative;
            width: 8px;
            height: 8px;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: rgba(255, 246, 230, 0.4);
            cursor: pointer;
            transition: width 0.3s ease, background-color 0.3s ease;
          }
          .why-gcc__pip::after {
            content: "";
            position: absolute;
            inset: -12px -4px; /* bigger tap area */
          }
          .why-gcc__pip[data-active="true"] {
            width: 24px;
            background: #ff9a2e;
          }
          .why-gcc__arrow-group {
            display: flex;
            gap: 12px;
          }
          .why-gcc__arrow {
            width: 48px;
            height: 48px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .why-gcc-dots {
            animation: none;
          }
          .why-gcc__track,
          .why-gcc__card,
          .why-gcc__num,
          .why-gcc__ctitle,
          .why-gcc__pip,
          .why-gcc-tab {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}

export default WhyGccSection
