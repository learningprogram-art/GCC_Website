import { useEffect, useRef, useState } from 'react'

interface CardConfig {
  id: string
  name: string
  /**
   * Where the card starts.
   * sx: -1 = left screen edge, 0 = straight above/below its slot, 1 = right screen edge
   * sy: -1 = from the top, 1 = from the bottom      far: how far vertically (x viewport height)
   * z = depth (px), rx / ry / rz = tilt (deg), s = start scale
   */
  from: { sx: -1 | 0 | 1; sy: -1 | 1; far: number; z: number; rx: number; ry: number; rz: number; s: number }
}

// Order = landing order (reading order)
const CARDS: CardConfig[] = [
  { id: '214:7155', name: 'Experience 1', from: { sx: -1, sy: -1, far: 0.4, z: -120, rx: 14, ry: 20, rz: -8, s: 0.6 } },
  { id: '214:7156', name: 'Experience 2', from: { sx: 0, sy: -1, far: 0.18, z: -160, rx: 16, ry: 0, rz: 3, s: 0.6 } },
  { id: '214:7157', name: 'Experience 3', from: { sx: 1, sy: -1, far: 0.4, z: -120, rx: 14, ry: -20, rz: 8, s: 0.6 } },
  { id: '214:7160', name: 'Experience 4', from: { sx: -1, sy: 1, far: 0.4, z: -120, rx: -14, ry: 20, rz: 7, s: 0.6 } },
  { id: '214:7161', name: 'Experience 5', from: { sx: 0, sy: 1, far: 0.4, z: -160, rx: -16, ry: 0, rz: -3, s: 0.6 } },
  { id: '214:7162', name: 'Experience 6', from: { sx: 1, sy: 1, far: 0.4, z: -120, rx: -14, ry: -20, rz: -7, s: 0.6 } },
]

/* Timing. Long glide + heavy overlap = the smooth, continuous feel of the reference */
const DURATION = 2000 // ms, each card's flight
const STAGGER = 450 // ms between one card starting and the next (cards overlap, as DURATION > STAGGER)
const FADE = 900 // ms, soft fade-in while travelling
const START_DELAY = 150
// Gentle slow-down at the end (a soft ease-out, not a hard snap)
const EASE = 'cubic-bezier(0.25, 0.6, 0.3, 1)'

// Animated grid from this width up (same as Tailwind `sm`). Below it = simple scrollable boxes (phones only).
const GRID_QUERY = '(min-width: 640px)'

function getIsGrid() {
  if (typeof window === 'undefined') return true
  return window.matchMedia(GRID_QUERY).matches
}

export function PreviousExperiences() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isGrid, setIsGrid] = useState(getIsGrid)

  // Track the breakpoint
  useEffect(() => {
    const mq = window.matchMedia(GRID_QUERY)
    const onChange = () => setIsGrid(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    const title = titleRef.current
    if (!section || !grid || !title) return

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const showStatic = () => {
      cards.forEach((el) => {
        el.style.transition = 'none'
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      title.style.transition = 'none'
      title.style.opacity = '1'
      title.style.transform = 'none'
    }

    // Phones (or reduced motion): plain boxes, no animation
    if (!isGrid || reduceMotion) {
      showStatic()
      return
    }

    let played = false

    // Put every card at its start position (just off-screen at its corner), hidden
    const setInitial = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const g = grid.getBoundingClientRect()

      cards.forEach((el, i) => {
        const f = CARDS[i].from
        const slotCx = g.left + el.offsetLeft + el.offsetWidth / 2
        let dx = 0
        if (f.sx === -1) dx = -(slotCx + el.offsetWidth * 0.5)
        if (f.sx === 1) dx = vw - slotCx + el.offsetWidth * 0.5
        const dy = f.sy * vh * f.far

        el.style.transition = 'none'
        el.style.opacity = '0'
        el.style.transform = `translate3d(${dx}px, ${dy}px, ${f.z}px) rotateX(${f.rx}deg) rotateY(${f.ry}deg) rotateZ(${f.rz}deg) scale(${f.s})`
      })

      title.style.transition = 'none'
      title.style.opacity = '0'
      title.style.transform = 'translate3d(0, 28px, 0)'
    }

    // Title first, then the cards glide in one after another (overlapping)
    const play = () => {
      if (played) return
      played = true

      // force a reflow so the start position is applied before the transition begins
      void grid.offsetHeight

      title.style.transition = `opacity 800ms ${EASE}, transform 800ms ${EASE}`
      title.style.opacity = '1'
      title.style.transform = 'translate3d(0, 0, 0)'

      cards.forEach((el, i) => {
        const delay = START_DELAY + i * STAGGER
        el.style.transition = `transform ${DURATION}ms ${EASE} ${delay}ms, opacity ${FADE}ms ease-out ${delay}ms`
        el.style.opacity = '1'
        el.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)'
      })
    }

    // Back to the start pose, so it can play again the next time the section comes into view
    const reset = () => {
      if (!played) return
      played = false
      setInitial()
    }

    setInitial()

    // Play when 60% of the section is visible (the whole grid is on screen).
    // Reset only when the section is completely out of view, so the reset is never seen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) play()
        else if (!entry.isIntersecting) reset()
      },
      { threshold: [0, 0.6] }
    )
    io.observe(section)

    // Keep the start positions right if the window is resized while the cards are hidden
    const onResize = () => {
      if (!played) setInitial()
    }
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [isGrid])

  return (
    <section
      ref={sectionRef}
      id="previous-experiences"
      data-node-id="214:7165"
      className="relative z-10 -mt-px flex w-full flex-col items-center justify-center overflow-x-clip bg-[#FFFCF2] px-6 py-16 sm:px-12 md:px-[96px] lg:px-[6rem] sm:min-h-[100svh] sm:py-8"
    >
      <h2
        ref={titleRef}
        data-node-id="214:7164"
        className="text-center font-['Bai_Jamjuree',sans-serif] text-[28px] font-bold uppercase leading-[1.2] text-[#252422] sm:text-[36px] lg:text-[48px]"
        style={{ opacity: isGrid ? 0 : 1 }}
      >
        PREVIOUS EXPERIENCES
      </h2>

      <div className="h-7 shrink-0" />

      {/*
        Phones (< 640px): one horizontal row of boxes you scroll sideways, with snap.
        640px and up: 3 x 2 grid, 20px gap, 12px corners (matches Figma node 214:7163).
        Full Figma size (1249px wide, 403px cards) with 96px (6rem) left and right padding.
      */}
      <div
        ref={gridRef}
        data-node-id="214:7163"
        className="relative -mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:w-full sm:grid-cols-3 sm:gap-[20px] sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0"
        style={
          isGrid
            ? {
                perspective: '1400px',
                maxWidth: '1249px',
              }
            : undefined
        }
      >
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            data-node-id={card.id}
            className="aspect-square w-[72%] shrink-0 snap-center sm:w-full sm:shrink sm:snap-align-none"
            style={
              isGrid
                ? { opacity: 0, willChange: 'transform, opacity', transformStyle: 'preserve-3d' }
                : { opacity: 1 }
            }
          >
            <div
              aria-label={card.name}
              className="size-full cursor-pointer rounded-[12px] bg-[#7D7D7D] transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default PreviousExperiences