import { useEffect, useRef, useState } from 'react'

export function useInViewOnce<T extends HTMLElement>(threshold = 0.05) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 1. Immediate check: if already in or near viewport on mount / scroll restoration
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      setInView(true)
      return
    }

    // 2. IntersectionObserver with generous positive margin
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '100px 0px 100px 0px' }
    )
    io.observe(el)

    // 3. Fail-safe timeout: ensure content is never permanently hidden
    const timer = setTimeout(() => {
      setInView(true)
    }, 600)

    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [threshold])

  return [ref, inView] as const
}

export default useInViewOnce

