import { useEffect, useRef, useState } from 'react'

export interface UseInViewOnceOptions {
  rootMargin?: string
  failSafe?: boolean
}

export function useInViewOnce<T extends HTMLElement>(
  threshold = 0.05,
  { rootMargin = '100px 0px 100px 0px', failSafe = true }: UseInViewOnceOptions = {},
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (failSafe) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        setInView(true)
        return
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)

    if (!failSafe) {
      return () => io.disconnect()
    }

    const timer = setTimeout(() => {
      setInView(true)
    }, 600)

    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [threshold, rootMargin, failSafe])

  return [ref, inView] as const
}

export const REVEAL_OPTIONS = {
  rootMargin: '0px 0px -8% 0px',
  failSafe: false,
} as const

export const REVEAL_BASE =
  'transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'

export const revealClass = (shown: boolean, transitionClass = REVEAL_BASE) =>
  `${transitionClass} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`

export const revealDelay = (shown: boolean, ms: number) => ({
  transitionDelay: shown ? `${ms}ms` : '0ms',
})

export default useInViewOnce

