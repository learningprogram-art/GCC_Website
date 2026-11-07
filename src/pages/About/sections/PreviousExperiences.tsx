import { useEffect, useRef, useState } from 'react'

interface CardConfig {
  id: string
  name: string
  initialTransform: string
  delay: string
}

const CARDS: CardConfig[] = [
  {
    id: '214:7155',
    name: 'Experience 1',
    // Top-left: flies in from top-left with tilt
    initialTransform: 'translate3d(-200px, -140px, 0) rotate(-10deg) scale(0.8)',
    delay: '0ms',
  },
  {
    id: '214:7156',
    name: 'Experience 2',
    // Top-center: flies in straight down from top
    initialTransform: 'translate3d(0px, -180px, 0) rotate(4deg) scale(0.8)',
    delay: '90ms',
  },
  {
    id: '214:7157',
    name: 'Experience 3',
    // Top-right: flies in from top-right with tilt
    initialTransform: 'translate3d(200px, -140px, 0) rotate(10deg) scale(0.8)',
    delay: '180ms',
  },
  {
    id: '214:7160',
    name: 'Experience 4',
    // Bottom-left: flies in from bottom-left
    initialTransform: 'translate3d(-200px, 140px, 0) rotate(8deg) scale(0.8)',
    delay: '120ms',
  },
  {
    id: '214:7161',
    name: 'Experience 5',
    // Bottom-center: flies in straight up from bottom
    initialTransform: 'translate3d(0px, 180px, 0) rotate(-4deg) scale(0.8)',
    delay: '210ms',
  },
  {
    id: '214:7162',
    name: 'Experience 6',
    // Bottom-right: flies in from bottom-right with tilt
    initialTransform: 'translate3d(200px, 140px, 0) rotate(-9deg) scale(0.8)',
    delay: '300ms',
  },
]

export function PreviousExperiences() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // Trigger animation when the section reaches the middle (half) of the viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        } else if (entry.boundingClientRect.top > 0) {
          // Reset when scrolled back above the section so it re-animates on return
          setInView(false)
        }
      },
      {
        rootMargin: '0px 0px -45% 0px',
        threshold: 0,
      }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="previous-experiences"
      data-node-id="214:7165"
      className="w-full bg-[#FFFCF2] px-6 sm:px-12 lg:px-[96px] overflow-hidden"
      style={{ paddingTop: '88px', paddingBottom: '188px' }}
    >
      {/* Inner container — Figma: x=96, w=1249 */}
      <div className="w-full max-w-[1249px] mx-auto flex flex-col items-center gap-0">
        {/* Title (Figma Node 214:7164) — h=58, then 44px gap to grid */}
        <h2
          data-node-id="214:7164"
          style={{
            fontFamily: '"Bai Jamjuree", sans-serif',
            fontWeight: 700,
            fontSize: '48px',
            lineHeight: 1.2,
            color: '#252422',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 28px, 0)',
            transition:
              'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="text-[28px] sm:text-[36px] lg:text-[48px]"
        >
          PREVIOUS EXPERIENCES
        </h2>

        {/* Spacer: 102px from title top to grid top, title is 58px, so gap = 44px */}
        <div style={{ height: '44px' }} />

        {/* 3×2 Grid (Figma Node 214:7163) — w=1249, h=826, gap=20px */}
        <div
          data-node-id="214:7163"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            width: '100%',
          }}
          className="grid! grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] w-full"
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              data-node-id={card.id}
              style={{
                transform: inView
                  ? 'translate3d(0, 0, 0) rotate(0deg) scale(1)'
                  : card.initialTransform,
                opacity: inView ? 1 : 0,
                transitionProperty: 'transform, opacity',
                transitionDuration: '1000ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: card.delay,
                willChange: 'transform, opacity',
              }}
              className="w-full aspect-square"
            >
              <div
                className="size-full bg-[#7D7D7D] rounded-[12px] transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                aria-label={card.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PreviousExperiences
