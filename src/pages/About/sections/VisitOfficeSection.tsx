import React, { useEffect, useRef, useState } from 'react'

const OFFICE_IMG = '/assets/images/about/office.webp'

// Bottom-up reveal: fade + slide up (same feel as the other sections)
const REVEAL =
  'transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'
const revealState = (shown: boolean) =>
  shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
const delayStyle = (shown: boolean, ms: number) => ({
  transitionDelay: shown ? `${ms}ms` : '0ms',
})

/** Flips to true once, the first time the element scrolls into view. */
function useReveal<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, shown] as const
}

export const VisitOfficeSection: React.FC = () => {
  const [contentRef, shown] = useReveal<HTMLDivElement>()

  return (
    <section
      id="visit-office"
      data-node-id="214:7183"
      className="relative w-full overflow-hidden bg-[#252422] min-h-[580px] sm:min-h-[640px] lg:h-[749px] flex items-center"
    >
      {/* Background Image (Figma Node 214:7219) — left-anchored night building */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src={OFFICE_IMG}
          alt="GCC Office building at night"
          className="w-full h-full object-cover object-left-top"
        />
        {/* Dark gradient overlay on left for text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Content Block (Figma Node 214:7217) — x=96, y=253.5, w=430.58, h=242 */}
      <div
        ref={contentRef}
        data-node-id="214:7217"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '40px',
        }}
        className="relative z-10 w-full max-w-[430.58px] px-6 sm:px-12 lg:px-0 lg:absolute lg:left-[96px] lg:top-1/2 lg:-translate-y-1/2 lg:w-[430.58px]"
      >
        {/* Heading (Figma Node 214:7215) — Bai Jamjuree Bold 48px in one line */}
        <h2
          data-node-id="214:7215"
          style={{
            fontFamily: '"Bai Jamjuree", sans-serif',
            fontWeight: 700,
            lineHeight: 1.2,
            textTransform: 'uppercase',
            color: '#FFFCF2',
            margin: 0,
            whiteSpace: 'nowrap',
            ...delayStyle(shown, 0),
          }}
          className={`font-bold whitespace-nowrap text-[26px] xs:text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] tracking-normal ${REVEAL} ${revealState(shown)}`}
        >
          VISIT THE OFFICE
        </h2>

        {/* Address Lines (Figma Node 214:7216) — Hanken Grotesk Regular 16px/24px */}
        <div
          data-node-id="214:7216"
          style={{
            color: '#FFFCF2',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '24px',
            display: 'flex',
            flexDirection: 'column',
            ...delayStyle(shown, 150),
          }}
          className={`${REVEAL} ${revealState(shown)}`}
        >
          <p style={{ margin: 0, lineHeight: '24px' }}>
            Sample address line 1, line 2
          </p>
          <p style={{ margin: 0, lineHeight: '24px' }}>
            district, state, pin 293939
          </p>
        </div>

        {/* Action Button wrapper: carries the reveal so the button keeps its own hover transitions */}
        <div
          style={delayStyle(shown, 300)}
          className={`shrink-0 ${REVEAL} ${revealState(shown)}`}
        >
          {/* Action Button (Figma Node 214:7221) — w=226px, h=56px, rounded=8px */}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            data-node-id="214:7221"
            style={{
              display: 'flex',
              width: '226px',
              height: '56px',
              padding: '14px 20px 14px 24px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFCF2',
              borderRadius: '8px',
              color: '#252422',
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
            className="hover:bg-white active:bg-[#FFE6A7] transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer shrink-0"
          >
            <span
              data-node-id="I214:7221;54:1652"
              style={{
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '28px',
                letterSpacing: '-0.36px',
                whiteSpace: 'nowrap',
              }}
            >
              Get direction
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#252422"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 size-[24px]"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default VisitOfficeSection