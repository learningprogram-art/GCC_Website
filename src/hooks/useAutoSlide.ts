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

export default useAutoSlide
