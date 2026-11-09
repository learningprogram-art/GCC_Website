import { useEffect, useRef, useState } from 'react'
import gccLogo from '/assets/icons/logo/gcc-logo.svg'

const baiJamjuree = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hankenGrotesk = { fontFamily: '"Hanken Grotesk", sans-serif' }

/** Returns [ref, inView]. Flips to true once, the first time the element scrolls into view. */
function useInViewOnce<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

// Pop-up reveal: fade + slide up
const REVEAL =
  'transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'
const revealState = (inView: boolean) =>
  inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
const delay = (inView: boolean, ms: number) => ({
  transitionDelay: inView ? `${ms}ms` : '0ms',
})

const VISUAL_W = 1248
const VISUAL_H = 426
const HUB_X = 936 // left edge of the GCC circle, where all lines end

type Role = {
  label: string
  left: number
  top: number
  /** right edge x and vertical centre y of the pill, where its line starts */
  lineX: number
  lineY: number
  /** y where the line meets the hub */
  endY: number
  /** colours of the two glowing strings flowing along this line */
  flow: [string, string]
}

const majorRoles: Role[] = [
  { label: 'Architect', left: 40, top: 36, lineX: 155, lineY: 59, endY: 190, flow: ['#E06422', '#F2A65A'] },
  { label: 'Structural engineer', left: 236, top: 8, lineX: 423, lineY: 31, endY: 196, flow: ['#6F1D1B', '#E06422'] },
  { label: 'Contractor', left: 120, top: 140, lineX: 248, lineY: 163, endY: 202, flow: ['#F2A65A', '#B5532A'] },
  { label: 'Interior designer', left: 330, top: 178, lineX: 500, lineY: 201, endY: 208, flow: ['#B5532A', '#6F1D1B'] },
  { label: 'Site supervisor', left: 56, top: 292, lineX: 213, lineY: 315, endY: 214, flow: ['#E06422', '#C9A27E'] },
]

const minorRoles: Role[] = [
  { label: 'Plumber', left: 440, top: 74, lineX: 531, lineY: 92, endY: 193, flow: ['#E06422', '#F2A65A'] },
  { label: 'Electrician', left: 0, top: 214, lineX: 112, lineY: 232, endY: 199, flow: ['#C9A27E', '#B5532A'] },
  { label: 'Carpenter', left: 432, top: 270, lineX: 532, lineY: 288, endY: 205, flow: ['#F2A65A', '#6F1D1B'] },
  { label: 'Painter', left: 196, top: 236, lineX: 283, lineY: 254, endY: 211, flow: ['#B5532A', '#E06422'] },
  { label: 'Mason', left: 296, top: 316, lineX: 382, lineY: 334, endY: 217, flow: ['#C9A27E', '#E06422'] },
]

function curve({ lineX, lineY, endY }: Role) {
  const mx = lineX + (HUB_X - lineX) * 0.55
  return `M${lineX} ${lineY} C${mx} ${lineY}, ${mx} ${endY}, ${HUB_X} ${endY}`
}

/** One flowing glowing string. pathLength=100 keeps dash maths simple. */
function FlowString({
  d,
  color,
  dash,
  duration,
  delay,
  width,
  opacity,
  playing,
}: {
  d: string
  color: string
  dash: number
  duration: number
  delay: number
  width: number
  opacity: number
  playing: boolean
}) {
  return (
    <path
      d={d}
      pathLength={100}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${dash} ${100 - dash}`}
      opacity={opacity}
      className="gcc-anim"
      style={{
        animation: `gcc-flow ${duration}s linear ${delay}s infinite`,
        animationPlayState: playing ? 'running' : 'paused',
        filter: `drop-shadow(0 0 3px ${color})`,
        willChange: playing ? 'stroke-dashoffset' : 'auto',
      }}
    />
  )
}

function Dot() {
  return <span className="block size-[6px] shrink-0 rounded-full bg-[#CCC5B9]" />
}

function MajorPill({ role }: { role: Role }) {
  return (
    <div
      style={{ left: role.left, top: role.top, ...hankenGrotesk }}
      className="absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-[#CCC5B9] bg-white py-2.5 pl-4 pr-[18px] shadow-[0_4px_12px_rgba(37,36,34,0.06)]"
    >
      <Dot />
      <span className="text-[16px] font-normal leading-6 text-[#252422]">{role.label}</span>
    </div>
  )
}

function MinorPill({ role }: { role: Role }) {
  return (
    <div
      style={{ left: role.left, top: role.top, ...hankenGrotesk }}
      className="absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-[#CCC5B9] bg-white py-2 pl-3 pr-3.5 opacity-45 blur-[1.5px]"
    >
      <Dot />
      <span className="text-[14px] font-medium leading-5 text-[#403D39]">{role.label}</span>
    </div>
  )
}

function TenToOneVisual() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [playing, setPlaying] = useState(false)

  // Scale the 1248x400 artboard to the available width
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / VISUAL_W))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Only animate while visible
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), {
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const state = playing ? 'running' : 'paused'

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-[1248px] overflow-hidden"
      style={{ height: VISUAL_H * scale }}
    >
      <div
        className="relative origin-top-left"
        style={{ width: VISUAL_W, height: VISUAL_H, transform: `scale(${scale})` }}
      >
        {/* Lines */}
        <svg
          width={VISUAL_W}
          height={VISUAL_H}
          viewBox={`0 0 ${VISUAL_W} ${VISUAL_H}`}
          fill="none"
          className="absolute left-0 top-0 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="line-major" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#C9A27E" />
              <stop offset="1" stopColor="#6F1D1B" />
            </linearGradient>
            <linearGradient id="line-minor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#CCC5B9" />
              <stop offset="1" stopColor="#C9A27E" />
            </linearGradient>
          </defs>

          {/* Static base lines */}
          <g id="lines-minor" opacity="0.5" stroke="url(#line-minor)" strokeWidth="1">
            {minorRoles.map((r) => (
              <path key={r.label} d={curve(r)} />
            ))}
          </g>
          <g id="lines-major" stroke="url(#line-major)" strokeWidth="1">
            {majorRoles.map((r) => (
              <path key={r.label} d={curve(r)} />
            ))}
          </g>

          {/* Flowing strings: faint on minor trades */}
          <g id="flow-minor">
            {minorRoles.map((r, i) => (
              <g key={r.label}>
                <FlowString
                  d={curve(r)}
                  color={r.flow[0]}
                  dash={9}
                  duration={4.2 + i * 0.35}
                  delay={-i * 0.9}
                  width={1.6}
                  opacity={0.45}
                  playing={playing}
                />
                <FlowString
                  d={curve(r)}
                  color={r.flow[1]}
                  dash={6}
                  duration={5 + i * 0.3}
                  delay={-i * 1.4 - 2}
                  width={1.4}
                  opacity={0.35}
                  playing={playing}
                />
              </g>
            ))}
          </g>

          {/* Flowing strings: bright on major roles */}
          <g id="flow-major">
            {majorRoles.map((r, i) => (
              <g key={r.label}>
                <FlowString
                  d={curve(r)}
                  color={r.flow[0]}
                  dash={12}
                  duration={3 + i * 0.4}
                  delay={-i * 0.7}
                  width={2.2}
                  opacity={1}
                  playing={playing}
                />
                <FlowString
                  d={curve(r)}
                  color={r.flow[1]}
                  dash={8}
                  duration={3.8 + i * 0.3}
                  delay={-i * 1.1 - 1.6}
                  width={1.8}
                  opacity={0.85}
                  playing={playing}
                />
              </g>
            ))}
          </g>
        </svg>

        {/* Glow (breathing) */}
        <div
          className="gcc-anim absolute rounded-full"
          style={{
            left: 845,
            top: -5,
            width: 390,
            height: 390,
            background:
              'radial-gradient(circle, rgba(224,100,34,0.45) 0%, rgba(224,100,34,0.18) 40%, rgba(224,100,34,0) 70%)',
            animation: 'gcc-glow 3.6s ease-in-out infinite',
            animationPlayState: state,
          }}
        />

        {/* Rings (static + rippling) */}
        <div
          className="absolute rounded-full border border-[#E06422]/20"
          style={{ left: 864, top: 14, width: 352, height: 352 }}
        />
        <div
          className="absolute rounded-full border border-[#6F1D1B]/25"
          style={{ left: 900, top: 50, width: 280, height: 280 }}
        />
        <div
          className="gcc-anim absolute rounded-full border border-[#E06422]/60"
          style={{
            left: 900,
            top: 50,
            width: 280,
            height: 280,
            animation: 'gcc-ripple 3.6s ease-out infinite',
            animationPlayState: state,
          }}
        />
        <div
          className="gcc-anim absolute rounded-full border border-[#E06422]/60"
          style={{
            left: 900,
            top: 50,
            width: 280,
            height: 280,
            animation: 'gcc-ripple 3.6s ease-out -1.8s infinite',
            animationPlayState: state,
          }}
        />

        {/* GCC hub (pulsing) */}
        <div
          className="gcc-anim absolute flex items-center justify-center rounded-full bg-[#6F1D1B]"
          style={{
            left: 936,
            top: 86,
            width: 208,
            height: 208,
            animation: 'gcc-pulse 3.6s ease-in-out infinite',
            animationPlayState: state,
          }}
        >
          {/* Placeholder mark: swap for the exported GCC logo SVG */}
          <img
            src={gccLogo}
            alt="Garg Core Construction"
            className="h-auto w-[130px] select-none"
            draggable={false}
          />
        </div>

        {/* Roles */}
        {minorRoles.map((r) => (
          <MinorPill key={r.label} role={r} />
        ))}
        {majorRoles.map((r) => (
          <MajorPill key={r.label} role={r} />
        ))}

        {/* Labels */}
        <p
          style={{ left: 236.5, top: 390, ...hankenGrotesk }}
          className="absolute whitespace-nowrap text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#403D39]"
        >
          10 people
        </p>
        <p
          style={{ left: 1000, top: 390, ...hankenGrotesk }}
          className="absolute whitespace-nowrap text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#6F1D1B]"
        >
          1 GCC team
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile (Figma: M / One Team, Not 10, node 196:3269)                  */
/* ------------------------------------------------------------------ */

const MOBILE_W = 350
const ROLES_TOP = 32 // below the "10 people" label
const HUB_GAP = 62 // last pill row -> top of the outer ring

// Same order as the Figma wrap: this decides which pills share a row
const mobileRoles: { label: string; major: boolean }[] = [
  { label: 'Architect', major: true },
  { label: 'Plumber', major: false },
  { label: 'Structural engineer', major: true },
  { label: 'Electrician', major: false },
  { label: 'Contractor', major: true },
  { label: 'Interior designer', major: true },
  { label: 'Painter', major: false },
  { label: 'Site supervisor', major: true },
  { label: 'Carpenter', major: false },
  { label: 'Mason', major: false },
]

// Reuse the desktop flow colours per role
const flowByLabel: Record<string, [string, string]> = Object.fromEntries(
  [...majorRoles, ...minorRoles].map((r) => [r.label, r.flow]),
)

type MobileLine = { label: string; major: boolean; flow: [string, string]; d: string }
type Measured = { width: number; ringTop: number; lines: MobileLine[] }

function TenToOneVisualMobile() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rolesRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [m, setM] = useState<Measured>({ width: MOBILE_W, ringTop: 340, lines: [] })

  // Measure the wrapped pills so each line starts at the bottom of its pill
  useEffect(() => {
    const wrap = wrapRef.current
    const roles = rolesRef.current
    if (!wrap || !roles) return

    const measure = () => {
      const width = wrap.clientWidth
      const pills = Array.from(roles.children) as HTMLElement[]
      const ringTop = ROLES_TOP + roles.offsetHeight + HUB_GAP
      const endY = ringTop + 34
      const cx = width / 2

      const starts = pills.map((el, i) => ({
        i,
        x: el.offsetLeft + el.offsetWidth / 2,
        y: ROLES_TOP + el.offsetTop + el.offsetHeight,
      }))
      // Spread the line ends left to right in the same order as the pills, so lines don't cross
      const order = [...starts].sort((a, b) => a.x - b.x || a.i - b.i)
      const rank = new Map(order.map((s, r) => [s.i, r]))

      const lines: MobileLine[] = starts.map(({ i, x, y }) => {
        const role = mobileRoles[i]
        const xe = cx + ((rank.get(i) ?? 0) / Math.max(1, starts.length - 1) - 0.5) * 22
        const dy = (endY - y) * 0.55
        return {
          label: role.label,
          major: role.major,
          flow: flowByLabel[role.label],
          d: `M${x} ${y} C${x} ${y + dy}, ${xe} ${endY - dy}, ${xe} ${endY}`,
        }
      })
      setM({ width, ringTop, lines })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  // Only animate while visible
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), {
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const state = playing ? 'running' : 'paused'
  const { width, ringTop, lines } = m
  const cx = width / 2
  const height = ringTop + 252
  const majorLines = lines.filter((l) => l.major)
  const minorLines = lines.filter((l) => !l.major)

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full shrink-0"
      style={{ maxWidth: MOBILE_W, height }}
    >
      {/* Lines */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="absolute left-0 top-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* userSpaceOnUse so perfectly vertical lines still get a gradient */}
          <linearGradient id="m-line-major" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={ringTop}>
            <stop offset="0" stopColor="#C9A27E" />
            <stop offset="1" stopColor="#6F1D1B" />
          </linearGradient>
          <linearGradient id="m-line-minor" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={ringTop}>
            <stop offset="0" stopColor="#CCC5B9" />
            <stop offset="1" stopColor="#C9A27E" />
          </linearGradient>
        </defs>

        {/* Static base lines */}
        <g opacity="0.5" stroke="url(#m-line-minor)" strokeWidth="1">
          {minorLines.map((l) => (
            <path key={l.label} d={l.d} />
          ))}
        </g>
        <g stroke="url(#m-line-major)" strokeWidth="1">
          {majorLines.map((l) => (
            <path key={l.label} d={l.d} />
          ))}
        </g>

        {/* Flowing strings: faint on minor trades */}
        <g>
          {minorLines.map((l, i) => (
            <g key={l.label}>
              <FlowString d={l.d} color={l.flow[0]} dash={9} duration={4.2 + i * 0.35} delay={-i * 0.9} width={1.6} opacity={0.45} playing={playing} />
              <FlowString d={l.d} color={l.flow[1]} dash={6} duration={5 + i * 0.3} delay={-i * 1.4 - 2} width={1.4} opacity={0.35} playing={playing} />
            </g>
          ))}
        </g>

        {/* Flowing strings: bright on major roles */}
        <g>
          {majorLines.map((l, i) => (
            <g key={l.label}>
              <FlowString d={l.d} color={l.flow[0]} dash={12} duration={3 + i * 0.4} delay={-i * 0.7} width={2.2} opacity={1} playing={playing} />
              <FlowString d={l.d} color={l.flow[1]} dash={8} duration={3.8 + i * 0.3} delay={-i * 1.1 - 1.6} width={1.8} opacity={0.85} playing={playing} />
            </g>
          ))}
        </g>
      </svg>

      {/* Label */}
      <p
        style={hankenGrotesk}
        className="absolute inset-x-0 top-0 whitespace-nowrap text-center text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#403D39]"
      >
        10 people
      </p>

      {/* Glow (breathing) */}
      <div
        className="gcc-anim absolute rounded-full"
        style={{
          left: cx - 160,
          top: ringTop + 108 - 160,
          width: 320,
          height: 320,
          background:
            'radial-gradient(circle, rgba(224,100,34,0.45) 0%, rgba(224,100,34,0.18) 40%, rgba(224,100,34,0) 70%)',
          animation: 'gcc-glow 3.6s ease-in-out infinite',
          animationPlayState: state,
        }}
      />

      {/* Rings (static + rippling) */}
      <div
        className="absolute rounded-full border border-[#E06422]/20"
        style={{ left: cx - 108, top: ringTop, width: 216, height: 216 }}
      />
      <div
        className="absolute rounded-full border border-[#6F1D1B]/25"
        style={{ left: cx - 86, top: ringTop + 22, width: 172, height: 172 }}
      />
      <div
        className="gcc-anim absolute rounded-full border border-[#E06422]/60"
        style={{
          left: cx - 86,
          top: ringTop + 22,
          width: 172,
          height: 172,
          animation: 'gcc-ripple 3.6s ease-out infinite',
          animationPlayState: state,
        }}
      />
      <div
        className="gcc-anim absolute rounded-full border border-[#E06422]/60"
        style={{
          left: cx - 86,
          top: ringTop + 22,
          width: 172,
          height: 172,
          animation: 'gcc-ripple 3.6s ease-out -1.8s infinite',
          animationPlayState: state,
        }}
      />

      {/* GCC hub (pulsing) */}
      <div
        className="gcc-anim absolute flex items-center justify-center rounded-full bg-[#6F1D1B]"
        style={{
          left: cx - 64,
          top: ringTop + 44,
          width: 128,
          height: 128,
          animation: 'gcc-pulse 3.6s ease-in-out infinite',
          animationPlayState: state,
        }}
      >
        {/* Placeholder mark: swap for the exported GCC logo SVG */}
        <img
          src={gccLogo}
          alt="Garg Core Construction"
          className="h-auto w-[82px] select-none"
          draggable={false}
        />
      </div>

      {/* Roles (wrap onto rows like the Figma frame) */}
      <div
        ref={rolesRef}
        className="absolute inset-x-0 flex flex-wrap items-start justify-center gap-x-2 gap-y-2.5"
        style={{ top: ROLES_TOP }}
      >
        {mobileRoles.map((r) =>
          r.major ? (
            <div
              key={r.label}
              style={hankenGrotesk}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#CCC5B9] bg-white py-2 pl-3 pr-3.5"
            >
              <Dot />
              <span className="text-[16px] font-normal leading-6 text-[#252422]">{r.label}</span>
            </div>
          ) : (
            <div
              key={r.label}
              style={hankenGrotesk}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#CCC5B9] bg-white py-2 pl-3 pr-3.5 opacity-45 blur-[1.25px]"
            >
              <Dot />
              <span className="text-[14px] font-medium leading-5 text-[#403D39]">{r.label}</span>
            </div>
          ),
        )}
      </div>

      {/* Label */}
      <p
        style={{ top: ringTop + 232, ...hankenGrotesk }}
        className="absolute inset-x-0 whitespace-nowrap text-center text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#6F1D1B]"
      >
        1 GCC team
      </p>
    </div>
  )
}

function OneTeamMobile() {
  const [headRef, headIn] = useInViewOnce<HTMLDivElement>(0.4)
  const [capsRef, capsIn] = useInViewOnce<HTMLDivElement>(0.2)

  return (
    <section className="flex flex-col items-center gap-9 bg-[#FFFCF2] px-5 py-[72px] lg:hidden">
      {/* Headline */}
      <div
        ref={headRef}
        style={baiJamjuree}
        className="flex flex-col items-center gap-0.5 whitespace-nowrap text-center uppercase"
      >
        <p
          style={delay(headIn, 0)}
          className={`text-[26px] font-light leading-[1.1] tracking-[-0.13px] text-[#403D39] ${REVEAL} ${revealState(headIn)}`}
        >
          Your home needs
        </p>
        <p
          style={delay(headIn, 150)}
          className={`text-[40px] font-bold leading-none tracking-[-0.4px] text-[#6F1D1B] ${REVEAL} ${revealState(headIn)}`}
        >
          One team.
          <br />
          <span className="text-[#CCC5B9]">Not 10.</span>
        </p>
      </div>

      {/* Visual: 10 → 1 */}
      <TenToOneVisualMobile />

      {/* Captions */}
      <div ref={capsRef} style={hankenGrotesk} className="flex w-full flex-col gap-6">
        <div
          style={delay(capsIn, 0)}
          className={`flex w-full flex-col gap-2.5 border-t border-[#CCC5B9] pt-5 text-[#403D39] ${REVEAL} ${revealState(capsIn)}`}
        >
          <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px]">
            The challenge
          </p>
          <p className="text-[18px] font-normal leading-[27px]">
            Too often, different teams handle different stages, communication gets lost, quality
            becomes inconsistent, and your original vision gets harder to maintain.
          </p>
        </div>

        <div
          style={delay(capsIn, 150)}
          className={`flex w-full flex-col gap-2.5 border-t border-[#CCC5B9] pt-5 ${REVEAL} ${revealState(capsIn)}`}
        >
          <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#E06422]">
            GCC approach
          </p>
          <p className="text-[18px] font-normal leading-[27px] text-[#252422]">
            GCC brings design, engineering and construction together, from the first plan to the
            final handover.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function OneTeamSection() {
  const [headRef, headIn] = useInViewOnce<HTMLDivElement>(0.4)
  const [capsRef, capsIn] = useInViewOnce<HTMLDivElement>(0.2)

  return (
    <div id="one-team" className="relative z-10 w-full bg-[#FFFCF2]">
      {/* Animation keyframes (shared by mobile + desktop) */}
      <style>{`
        @keyframes gcc-flow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -100; }
        }
        @keyframes gcc-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.045); }
        }
        @keyframes gcc-glow {
          0%, 100% { opacity: 0.7; transform: scale(0.96); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes gcc-ripple {
          0% { transform: scale(0.74); opacity: 0; }
          25% { opacity: 0.55; }
          100% { transform: scale(1.26); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gcc-anim { animation: none !important; }
        }
      `}</style>

      <OneTeamMobile />

      {/* Desktop: your original section, unchanged except `hidden … lg:flex` */}
      <section className="hidden flex-col items-center gap-16 bg-[#FFFCF2] px-24 py-16 lg:flex lg:gap-24 lg:py-32">
        {/* Headline */}
        <div
          ref={headRef}
          className="flex flex-col items-center text-center uppercase"
        >
          <p
            style={{ ...baiJamjuree, ...delay(headIn, 0) }}
            className={`text-[clamp(32px,4.45vw,64px)] font-light leading-[1.05] tracking-[-0.01em] text-[#403D39] ${REVEAL} ${revealState(headIn)}`}
          >
            Your home needs
          </p>
          <p
            style={{ ...baiJamjuree, ...delay(headIn, 150) }}
            className={`text-[clamp(48px,6.67vw,96px)] font-bold leading-none tracking-[-0.01em] text-[#6F1D1B] ${REVEAL} ${revealState(headIn)}`}
          >
            One team. <span className="text-[#CCC5B9]">Not 10.</span>
          </p>
        </div>

        {/* Visual: 10 → 1 */}
        <TenToOneVisual />

        {/* Captions */}
        <div
          ref={capsRef}
          style={hankenGrotesk}
          className="flex w-full max-w-[1248px] flex-col justify-between gap-10 md:flex-row"
        >
          <div
            style={delay(capsIn, 0)}
            className={`flex w-full flex-col gap-3.5 text-[#403D39] md:w-[520px] ${REVEAL} ${revealState(capsIn)}`}
          >
            <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px]">
              The challenge
            </p>
            <p className="text-[20px] font-normal leading-7">
              Too often, different teams handle different stages, communication gets lost, quality
              becomes inconsistent, and your original vision gets harder to maintain.
            </p>
          </div>

          <div
            style={delay(capsIn, 150)}
            className={`flex w-full flex-col gap-3.5 md:w-[420px] ${REVEAL} ${revealState(capsIn)}`}
          >
            <p className="text-[12px] font-semibold uppercase leading-4 tracking-[0.96px] text-[#E06422]">
              GCC approach
            </p>
            <p className="text-[20px] font-normal leading-7 text-[#252422]">
              GCC brings design, engineering and construction together, from the first plan to the
              final handover.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}