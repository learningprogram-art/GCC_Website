import { useEffect, useRef, useState } from 'react'
import { useCarousel } from '@/hooks/useAutoSlide'

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

/* ───────── Scroll-driven timing (desktop) ─────────
   No extra section height. Progress runs 0 → 1 as the section scrolls up into view:
   0 when its top edge is at START_VH of the screen height (just entering),
   1 when its top edge reaches END_VH (section fully on screen).
   Every card owns a slice of that progress. */
const START_VH = 0.05 // was 0.25: starts when the section top is almost at the top of the screen
const END_VH = -0.4 // was -0.2: ends further down, so the reveal keeps the same speed
const TITLE_END = 0.12 // title finishes by this progress
const CARD_FIRST = 0.1 // progress where card 1 starts moving
const CARD_STEP = 0.09 // progress gap between one card starting and the next
const CARD_SPAN = 0.4 // progress length of each card's flight (overlaps the next cards)
const SMOOTHING = 14 // higher = follows scroll more tightly, lower = softer glide

/* ───────── Mobile auto-slide ───────── */
const MOBILE_GAP = 16 // px, same as the `gap-4` on the phone row
const MOBILE_SLIDE_MS = 3000 // a new box every 3 seconds
const MOBILE_QUERY = '(max-width: 639px)' // auto-slide runs on phones only

// Animated grid from this width up (same as Tailwind `sm`). Below it = simple scrollable boxes (phones only).
const GRID_QUERY = '(min-width: 640px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function getIsGrid() {
  if (typeof window === 'undefined') return true
  return window.matchMedia(GRID_QUERY).matches
}

function getReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCED_QUERY).matches
}

export function PreviousExperiences() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isGrid, setIsGrid] = useState(getIsGrid)
  const [reduceMotion, setReduceMotion] = useState(getReducedMotion)

  // Phone row auto-slide (3s). gridRef is the carousel track, and it is also the grid used by the desktop animation.
  const {
    trackRef: gridRef,
    handleScroll,
    trackTouchProps,
  } = useCarousel({
    count: CARDS.length,
    gap: MOBILE_GAP,
    autoSlideMs: MOBILE_SLIDE_MS,
    autoSlideMediaQuery: MOBILE_QUERY,
  })

  // Scroll-driven only on desktop-size screens and when motion is allowed
  const animated = isGrid && !reduceMotion

  // Track the breakpoint and the motion preference
  useEffect(() => {
    const mqGrid = window.matchMedia(GRID_QUERY)
    const mqMotion = window.matchMedia(REDUCED_QUERY)
    const onGrid = () => setIsGrid(mqGrid.matches)
    const onMotion = () => setReduceMotion(mqMotion.matches)
    onGrid()
    onMotion()
    mqGrid.addEventListener('change', onGrid)
    mqMotion.addEventListener('change', onMotion)
    return () => {
      mqGrid.removeEventListener('change', onGrid)
      mqMotion.removeEventListener('change', onMotion)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    const title = titleRef.current
    if (!section || !grid || !title) return

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]

    // Phones (or reduced motion): plain boxes, no animation
    if (!animated) {
      cards.forEach((el) => {
        el.style.transition = 'none'
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      title.style.transition = 'none'
      title.style.opacity = '1'
      title.style.transform = 'none'
      return
    }

    // Start offsets for every card (how far off-screen it begins), measured from its real slot
    let starts: { dx: number; dy: number }[] = []

    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const g = grid.getBoundingClientRect()

      starts = cards.map((el, i) => {
        const f = CARDS[i].from
        const slotCx = g.left + el.offsetLeft + el.offsetWidth / 2
        let dx = 0
        if (f.sx === -1) dx = -(slotCx + el.offsetWidth * 0.5)
        if (f.sx === 1) dx = vw - slotCx + el.offsetWidth * 0.5
        return { dx, dy: f.sy * vh * f.far }
      })
    }

    // Draw the whole section for a given scroll progress (0 → 1)
    const apply = (p: number) => {
      const tt = easeOut(clamp01(p / TITLE_END))
      title.style.opacity = `${tt}`
      title.style.transform = `translate3d(0, ${(1 - tt) * 28}px, 0)`

      cards.forEach((el, i) => {
        const f = CARDS[i].from
        const start = CARD_FIRST + i * CARD_STEP
        const t = clamp01((p - start) / CARD_SPAN)
        const e = easeOut(t)
        const k = 1 - e
        const { dx, dy } = starts[i] || { dx: 0, dy: 0 }

        el.style.opacity = `${clamp01(t * 2.2)}`
        el.style.transform =
          `translate3d(${dx * k}px, ${dy * k}px, ${f.z * k}px) ` +
          `rotateX(${f.rx * k}deg) rotateY(${f.ry * k}deg) rotateZ(${f.rz * k}deg) ` +
          `scale(${f.s + (1 - f.s) * e})`
      })
    }

    // Scroll progress from the section's position on screen (section height is untouched)
    const getTarget = () => {
      const vh = window.innerHeight
      const top = section.getBoundingClientRect().top
      return clamp01((vh * START_VH - top) / (vh * (START_VH - END_VH)))
    }

    // Smoothly follow the scroll position (and stop the loop when caught up)
    const anim = { current: 0, rafId: 0, lastTime: 0 }

    const tick = (now: number) => {
      anim.rafId = 0
      const target = getTarget()
      const dt = anim.lastTime ? Math.min(0.05, Math.max(0.001, (now - anim.lastTime) / 1000)) : 1 / 60
      anim.lastTime = now

      anim.current += (target - anim.current) * (1 - Math.exp(-SMOOTHING * dt))
      if (Math.abs(target - anim.current) < 0.0005) anim.current = target
      apply(anim.current)

      if (anim.current !== target) {
        anim.rafId = requestAnimationFrame(tick)
      } else {
        anim.lastTime = 0
      }
    }

    const schedule = () => {
      if (!anim.rafId) anim.rafId = requestAnimationFrame(tick)
    }

    const onResize = () => {
      measure()
      anim.current = getTarget()
      apply(anim.current)
    }

    // First paint: jump straight to the right pose (works if the page loads already scrolled)
    title.style.transition = 'none'
    cards.forEach((el) => {
      el.style.transition = 'none'
    })
    measure()
    anim.current = getTarget()
    apply(anim.current)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      if (anim.rafId) cancelAnimationFrame(anim.rafId)
    }
  }, [animated, gridRef])

  return (
    <section
      ref={sectionRef}
      id="previous-experiences"
      data-node-id="214:7165"
      className="relative z-10 -mt-px flex w-full flex-col items-center justify-center overflow-x-clip bg-[#FFFCF2] px-[1.25rem] py-[4rem] sm:px-[3rem] md:px-[6rem] lg:px-[6rem] sm:min-h-[100svh] sm:py-[2rem]"
    >
      <h2
        ref={titleRef}
        data-node-id="214:7164"
        className="text-center font-['Bai_Jamjuree',sans-serif] text-[28px] font-bold uppercase leading-[1.2] text-[#252422] sm:text-[36px] lg:text-[48px]"
        style={{ opacity: animated ? 0 : 1 }}
      >
        PREVIOUS EXPERIENCES
      </h2>

      <div className="h-7 shrink-0" />

      {/*
        Phones (< 640px): one horizontal row of boxes with snap. It auto-slides every 3 seconds
        (pauses while you touch it, and loops back to the first box after the last).
        640px and up: 3 x 2 grid, 20px gap, 12px corners (matches Figma node 214:7163).
        Full Figma size (1249px wide, 403px cards) with 96px (6rem) left and right padding.
      */}
      <div
        ref={gridRef}
        data-node-id="214:7163"
        onScroll={handleScroll}
        {...trackTouchProps}
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
              animated
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