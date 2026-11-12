import { useCallback, useEffect, useRef, useState } from "react"
import { useAutoSlide } from "@/hooks/useAutoSlide"
import { useInViewOnce } from "@/hooks/useInViewOnce"

// Figma node: 211:5177 — Section / Why GCC (bg layers: 211:5178 glow, 211:5179 glow core, 211:5180 dot grid, 211:5198 edge fade)
const CARDS = [
  {
    id: "01",
    tab: "Engineering Strength",
    title: ["Engineering", "Strength"],
    body: "Structural engineering and detailed drawings that ensure the design is built right from the start.",
    image: "/assets/images/why-gcc/engineering-strength.webp",
    alt: "Worker on a concrete beam while a crane lifts a concrete block",
  },
  {
    id: "02",
    tab: "Built for the Long Term",
    title: ["Built for", "the Long Term"],
    body: "Construction focused on durability, quality, reliability and lasting value.",
    image: "/assets/images/why-gcc/built-for-long-term.webp",
    alt: "Clock on a pink wall beside a terracotta arch and yellow stairs",
  },
  {
    id: "03",
    tab: "End-to-End Ownership",
    title: ["End-to-End", "Ownership"],
    body: "One team taking responsibility from the first plan to final handover.",
    image: "/assets/images/why-gcc/end-to-end-ownership.webp",
    alt: "A winding cream path with a ball at the bottom",
  },
  {
    id: "04",
    tab: "Transparent Execution",
    title: ["Transparent", "Execution"],
    body: "Clear processes and communication that keep every stage visible.",
    image: "/assets/images/why-gcc/transparent-execution.webp",
    alt: "Hand holding a phone showing a 3D building model at a construction site",
  },
]

const N = CARDS.length
const TOTAL = String(N).padStart(2, "0")
const REPEATS = 5
const BASE_INDEX = Math.floor(REPEATS / 2) * N // Center cycle starts at index 8

const TRACK_ITEMS = Array.from({ length: REPEATS * N }, (_, idx) => ({
  idx,
  card: CARDS[idx % N],
}))

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const AUTO_SLIDE_MS = 3000

export function WhyGccSection() {
  const [headRef, headIn] = useInViewOnce<HTMLDivElement>(0.3, { failSafe: false })
  const [carouselRef, carouselIn] = useInViewOnce<HTMLDivElement>(0.15, { failSafe: false })

  // Track position in infinite buffer
  const [trackIndex, setTrackIndex] = useState(BASE_INDEX)
  const [instant, setInstant] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const activeCardIndex = ((trackIndex % N) + N) % N

  const advanceSlide = useCallback(() => {
    setInstant(false)
    setTrackIndex((prev) => (prev >= REPEATS * N - 1 ? BASE_INDEX : prev + 1))
  }, [])

  const { setIsPaused, pause, resume, resetTimer } = useAutoSlide({
    targetRef: carouselRef,
    intervalMs: AUTO_SLIDE_MS,
    onSlide: advanceSlide,
  })

  // Navigate to next card (infinite loop)
  const goNext = useCallback(() => {
    advanceSlide()
    resetTimer()
  }, [advanceSlide, resetTimer])

  // Navigate to previous card (infinite loop)
  const goPrev = useCallback(() => {
    setInstant(false)
    setTrackIndex((prev) => (prev <= 0 ? BASE_INDEX : prev - 1))
    resetTimer()
  }, [resetTimer])

  // Navigate to a specific tab / dot via the shortest path
  const goToCard = useCallback(
    (target: number) => {
      setInstant(false)
      setTrackIndex((prev) => {
        const curMod = ((prev % N) + N) % N
        let diff = target - curMod
        if (diff > N / 2) diff -= N
        if (diff < -N / 2) diff += N
        return prev + diff
      })
      resetTimer()
    },
    [resetTimer]
  )

  // Silently re-center when drifting near buffer edges
  const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current || e.propertyName !== "transform") return
    setTrackIndex((current) => {
      const curMod = ((current % N) + N) % N
      if (current < N || current >= N * (REPEATS - 1)) {
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
    touchStartY.current = e.touches[0].clientY
    pause()
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    resume()
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null

    // Only swipe if gesture was primarily horizontal (avoid hijacking vertical page scroll)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goNext()
      else goPrev()
    }
  }

  return (
    <section
      id="why-gcc"
      className="why-gcc-sec relative w-full overflow-hidden text-[#FFFCF2] py-[5rem] md:py-[7rem] px-[1.5rem] md:px-[3rem] lg:px-[6rem]"
    >
      {/* Background layers (Figma: BG / Glow, BG / Glow core, BG / Dot grid) */}
      <div className="why-gcc-bg" aria-hidden="true">
        <div className="why-gcc-glow" />
        <div className="why-gcc-glow-core" />
        <div className="why-gcc-dots" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div
          ref={headRef}
          className={`why-gcc-head relative z-20 transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${headIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <p className="why-gcc-eyebrow">
            <span className="why-gcc-dot" aria-hidden />
            WHY GCC
            <span className="why-gcc-dot why-gcc-dot--end" aria-hidden />
          </p>
          <h2 className="why-gcc-title">The GCC Difference</h2>
        </div>

        {/* Tabs + Carousel wrapper (pauses auto-slide while hovered with mouse or focused) */}
        <div
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setIsPaused(true)
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setIsPaused(false)
          }}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setIsPaused(false)
            }
          }}
        >
        {/* Tabs (hidden on mobile) */}
        <div
          style={{ transitionDelay: headIn ? "120ms" : "0ms" }}
          className={`why-gcc-tabs relative z-20 transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${headIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
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
            className="why-gcc__viewport focus:outline-none"
            tabIndex={0}
            role="region"
            aria-label="Why GCC carousel"
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => setIsPaused(false)}
          >
            {/* Static radial background fade (never moves when cards slide) */}
            <div aria-hidden="true" className="why-gcc__fade" />

            <div
              ref={trackRef}
              className="why-gcc__track"
              style={{
                transform: `translateX(calc(var(--x0) - ${trackIndex} * (var(--w) + var(--gap))))`,
                transition: instant ? "none" : `transform 0.65s ${EASE}`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >

              {TRACK_ITEMS.map((item) => {
                const isActive = item.idx === trackIndex
                const isFar = Math.abs(item.idx - trackIndex) > 1

                return (
                  <div
                    key={item.idx}
                    data-active={isActive}
                    data-far={isFar}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    onClick={() => {
                      if (!isActive) {
                        setInstant(false)
                        setTrackIndex(item.idx)
                        resetTimer()
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
                      <img
                        src={item.card.image}
                        alt={item.card.alt}
                        draggable={false}
                        className="pointer-events-none select-none"
                      />
                      {/* Red overlay tint on inactive side cards */}
                      <div className="why-gcc__img-tint" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Static side-edge fades over outer peeking cards only (center active card stays untouched) */}
            <div aria-hidden="true" className="why-gcc__edge-fade why-gcc__edge-fade--left" />
            <div aria-hidden="true" className="why-gcc__edge-fade why-gcc__edge-fade--right" />
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
                data-active={activeCardIndex > 0}
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
                data-active={activeCardIndex < N - 1}
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
      </div>

      <style>{`
        /* Figma tokens: primary #6F1D1B, accent/1 #E06422, accent/2 #FB8B24, secondary/3 #FFE6A7, neutral/4 #FFFCF2 */
        .why-gcc-sec {
          font-family: "Bai Jamjuree", sans-serif;
          position: relative;
          overflow: hidden;
          background-color: #6f1d1b;
        }

        /* ───────────── Background (Figma 1440 x 1180 artboard, centered) ───────────── */
        .why-gcc-bg {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1440px;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 0;
        }

        /* BG / Glow — wide, soft base (stronger) */
        .why-gcc-glow {
          position: absolute;
          left: 200px;
          width: 1040px;
          height: 560px;
          bottom: -14px;
          background: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            rgba(224, 100, 34, 0.50) 0%,
            rgba(224, 100, 34, 0.45) 30%,
            rgba(224, 100, 34, 0.28) 55%,
            rgba(224, 100, 34, 0.10) 80%,
            rgba(224, 100, 34, 0) 100%
          );
          transform: scale(1.38, 1.71);
        }

        /* BG / Glow core — brighter hotspot under the card */
        .why-gcc-glow-core {
          position: absolute;
          left: 460px;
          width: 520px;
          height: 300px;
          bottom: 116px;
          background: radial-gradient(
            ellipse 50% 50% at 50% 50%,
            rgba(250, 125, 30, 0.95) 0%,
            rgba(250, 125, 30, 0.85) 30%,
            rgba(250, 125, 30, 0.58) 50%,
            rgba(250, 125, 30, 0.25) 75%,
            rgba(250, 125, 30, 0) 100%
          );
          transform: scale(1.7, 2.3);
        }

        /* BG / Dot grid — 28px lattice, 3px dots (matches Figma vector) */
        .why-gcc-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at center, rgba(255, 252, 242, 0.28) 1.5px, transparent 1.8px);
          background-size: 28px 28px;
          background-position: 6px 0;
        }

        /* BG / Edge fade — static centered radial fade behind track (transparent centre to solid #6F1D1B at edges) */
        .why-gcc__fade {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 4000px;
          height: 1180px;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            ellipse 720px 590px at 50% 50%,
            rgba(111, 29, 27, 0) 0%,
            rgba(111, 29, 27, 0.35) 60%,
            rgba(111, 29, 27, 1) 100%
          );
        }

        /* Static left/right edge vignettes over peeking side cards */
        .why-gcc__edge-fade {
          position: absolute;
          top: -24px;
          bottom: -24px;
          width: 50vw;
          pointer-events: none;
          z-index: 3;
        }
        .why-gcc__edge-fade--left {
          right: calc(50% + var(--w) / 2 + var(--gap) / 2);
          background: linear-gradient(
            90deg,
            #6f1d1b 0%,
            rgba(111, 29, 27, 0.65) 55%,
            rgba(111, 29, 27, 0) 100%
          );
        }
        .why-gcc__edge-fade--right {
          left: calc(50% + var(--w) / 2 + var(--gap) / 2);
          background: linear-gradient(
            270deg,
            #6f1d1b 0%,
            rgba(111, 29, 27, 0.65) 55%,
            rgba(111, 29, 27, 0) 100%
          );
        }

        /* Headings */
        .why-gcc-head {
          text-align: center;
          margin-bottom: 24px;
        }
        .why-gcc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: "Hanken Grotesk", sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 16px;
          letter-spacing: 0.08em;
          color: #ffe6a7;
          margin-bottom: 24px;
          text-transform: uppercase;
        }
        .why-gcc-dot {
          width: 6px;
          height: 6px;
          background-color: #fb8b24;
          display: inline-block;
        }
        .why-gcc-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: #fffcf2;
        }

        /* Tabs (Figma: Index Pills) */
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
          padding: 10px 18px 10px 16px;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          font-family: "Hanken Grotesk", sans-serif;
          border-radius: 8px;
          color: #fffcf2;
          background-color: #6f1d1b;
          border: 1px solid rgba(255, 252, 242, 0.2);
          cursor: pointer;
          transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, transform 0.2s ease;
        }
        .why-gcc-tab:hover {
          border-color: rgba(255, 252, 242, 0.4);
        }
        .why-gcc-tab__n {
          color: #ffe6a7;
        }
        .why-gcc-tab[data-active="true"] {
          background-color: #fffcf2;
          color: #6f1d1b;
          border-color: #fffcf2;
        }
        .why-gcc-tab[data-active="true"] .why-gcc-tab__n {
          color: #e06422;
        }

        /* Carousel container */
        .why-gcc {
          --w: min(86vw, 820px);
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
          touch-action: pan-y;
        }

        /* Sliding track */
        .why-gcc__track {
          position: relative;
          z-index: 1;
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
          background: #591716; /* Figma inactive panel: #6F1D1B + 20% black */
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

        /* Active center card — sits above the edge fade */
        .why-gcc__card[data-active="true"] {
          background: #fffcf2;
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
          color: #ffe6a7;
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
          color: #fffcf2;
          margin-bottom: 12px;
          transition: font-size 0.65s cubic-bezier(0.22, 1, 0.36, 1), color 0.5s ease;
        }
        .why-gcc__card[data-active="true"] .why-gcc__ctitle {
          font-size: clamp(22px, 2.6vw, 35px);
          color: #252422;
        }

        /* Card body */
        .why-gcc__body {
          font-family: "Hanken Grotesk", sans-serif;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(255, 252, 242, 0.7);
          max-width: 32ch;
          transition: font-size 0.5s ease, color 0.5s ease;
        }
        .why-gcc__card[data-active="true"] .why-gcc__body {
          font-size: 14px;
          line-height: 1.55;
          color: #403d39;
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
          gap: 24px;
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
          width: 52px;
          height: 52px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        .why-gcc__arrow:hover {
          transform: scale(1.06);
        }
        .why-gcc__arrow:active {
          transform: scale(0.94);
        }
        .why-gcc__arrow[data-active="false"] {
          background: #6f1d1b;
          color: #fffcf2;
          border: 1px solid rgba(255, 252, 242, 0.2);
        }
        .why-gcc__arrow[data-active="false"]:hover {
          background: #7d2220;
        }
        .why-gcc__arrow[data-active="true"] {
          background: #fffcf2;
          color: #252422;
          border: 1px solid #fffcf2;
        }
        .why-gcc__arrow[data-active="true"]:hover {
          background: #ffffff;
        }

        .why-gcc__card:focus-visible,
        .why-gcc__arrow:focus-visible,
        .why-gcc__pip:focus-visible,
        .why-gcc-tab:focus-visible {
          outline: 2px solid #ffe6a7;
          outline-offset: 3px;
        }

        /* ───────────── Mobile layout ───────────── */
        @media (max-width: 640px) {
          section.why-gcc-sec {
            padding: 72px 20px 64px;
          }

          /* Mobile background: calm dark red, faint dots, soft glow near the bottom */
          .why-gcc-bg {
            left: 0;
            width: 100%;
            transform: none;
          }
          .why-gcc-glow {
            left: 50%;
            width: 150vw;
            height: 420px;
            bottom: -90px;
            transform: translateX(-50%);
            background: radial-gradient(
              ellipse 50% 50% at 50% 50%,
              rgba(224, 100, 34, 0.30) 0%,
              rgba(224, 100, 34, 0.22) 35%,
              rgba(224, 100, 34, 0.09) 65%,
              rgba(224, 100, 34, 0) 100%
            );
          }
          .why-gcc-glow-core {
            left: 50%;
            width: 90vw;
            height: 200px;
            bottom: -20px;
            transform: translateX(-50%);
            background: radial-gradient(
              ellipse 50% 50% at 50% 50%,
              rgba(224, 100, 34, 0.22) 0%,
              rgba(224, 100, 34, 0.10) 50%,
              rgba(224, 100, 34, 0) 100%
            );
          }
          .why-gcc-dots {
            background-image: radial-gradient(circle at center, rgba(255, 252, 242, 0.14) 1.1px, transparent 1.4px);
            background-size: 24px 24px;
            background-position: 0 0;
          }

          /* Desktop-only edge fade (peek card has its own mobile treatment) */
          .why-gcc__fade,
          .why-gcc__edge-fade {
            display: none;
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
            overflow-anchor: none;
          }
          .why-gcc__track {
            align-items: flex-start;
            min-height: calc(var(--w) * 0.64 + 318px);
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
            transition: color 0.5s ease;
          }
          .why-gcc__card[data-active="true"] .why-gcc__num {
            font-size: 60px;
          }

          .why-gcc__ctitle {
            color: #ffe9da;
            margin-bottom: 8px;
            transition: color 0.5s ease;
          }
          .why-gcc__ctitle br {
            display: none; /* one line on mobile */
          }
          .why-gcc__card[data-active="true"] .why-gcc__ctitle {
            font-size: 22px;
            min-height: calc(22px * 1.22 * 2);
          }

          .why-gcc__body {
            font-family: "Hanken Grotesk", sans-serif;
            color: #ffcfb4;
            max-width: none;
            transition: color 0.5s ease;
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