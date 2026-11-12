import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export interface UseAutoSlideOptions {
  targetRef: RefObject<HTMLElement | null>
  intervalMs: number
  onSlide: () => void
  mediaQuery?: string
}

/**
 * Advances a carousel on a fixed interval while its element is visible,
 * the browser tab is active, motion is allowed, and the user is not interacting.
 */
export function useAutoSlide({
  targetRef,
  intervalMs,
  onSlide,
  mediaQuery,
}: UseAutoSlideOptions) {
  const onSlideRef = useRef(onSlide)
  const [isPaused, setIsPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const [isTabHidden, setIsTabHidden] = useState(() =>
    typeof document !== 'undefined' ? document.hidden : false,
  )
  const [queryMatch, setQueryMatch] = useState(() =>
    mediaQuery && typeof window !== 'undefined'
      ? window.matchMedia(mediaQuery).matches
      : true,
  )
  const [interactionTick, setInteractionTick] = useState(0)

  const matchesQuery = !mediaQuery || queryMatch

  useEffect(() => {
    onSlideRef.current = onSlide
  }, [onSlide])

  useEffect(() => {
    if (!mediaQuery) return
    const mql = window.matchMedia(mediaQuery)
    const onChange = () => setQueryMatch(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [mediaQuery])

  useEffect(() => {
    const onVisibilityChange = () => setIsTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    const el = targetRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [targetRef])

  useEffect(() => {
    if (!matchesQuery || !inView || isPaused || isTabHidden) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => onSlideRef.current(), intervalMs)
    return () => window.clearInterval(id)
  }, [matchesQuery, inView, isPaused, isTabHidden, interactionTick, intervalMs])

  const resetTimer = useCallback(() => {
    setInteractionTick((t) => t + 1)
  }, [])

  const pause = useCallback(() => setIsPaused(true), [])

  const resume = useCallback(() => {
    setIsPaused(false)
    setInteractionTick((t) => t + 1)
  }, [])

  return { setIsPaused, pause, resume, resetTimer }
}

export interface UseCarouselOptions {
  count: number
  gap: number
  autoSlideMs?: number
  autoSlideMediaQuery?: string
}

function getTrackStep(el: HTMLDivElement | null, gap: number): number {
  const firstCard = el?.firstElementChild as HTMLElement | null
  return firstCard ? firstCard.offsetWidth + gap : 0
}

/**
 * Shared state and controls for a horizontal scroll carousel with optional
 * responsive auto-sliding, rAF-throttled scroll sync, and touch pause/resume.
 */
export function useCarousel({
  count,
  gap,
  autoSlideMs = 3000,
  autoSlideMediaQuery,
}: UseCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const scrollRafRef = useRef<number | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [])

  const syncActiveFromScroll = useCallback(() => {
    const el = trackRef.current
    const step = getTrackStep(el, gap)
    if (!el || step <= 0) return

    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    const index = atEnd ? count - 1 : Math.round(el.scrollLeft / step)
    setActive(Math.min(Math.max(index, 0), count - 1))
  }, [count, gap])

  const handleScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null
      syncActiveFromScroll()
    })
  }, [syncActiveFromScroll])

  const scrollToCard = useCallback(
    (index: number) => {
      const el = trackRef.current
      const step = getTrackStep(el, gap)
      if (!el || step <= 0) return

      el.scrollTo({ left: index * step, behavior: 'smooth' })
    },
    [gap],
  )

  const advanceSlide = useCallback(() => {
    scrollToCard((activeRef.current + 1) % count)
  }, [count, scrollToCard])

  const { setIsPaused, pause, resume, resetTimer } = useAutoSlide({
    targetRef: trackRef,
    intervalMs: autoSlideMs,
    mediaQuery: autoSlideMediaQuery,
    onSlide: advanceSlide,
  })

  const goToCard = useCallback(
    (index: number) => {
      scrollToCard(index)
      resetTimer()
    },
    [scrollToCard, resetTimer],
  )

  const cancelTouch = useCallback(() => setIsPaused(false), [setIsPaused])

  const trackTouchProps = {
    onTouchStart: pause,
    onTouchEnd: resume,
    onTouchCancel: cancelTouch,
  }

  return {
    trackRef,
    active,
    handleScroll,
    goToCard,
    trackTouchProps,
  }
}

export default useAutoSlide
