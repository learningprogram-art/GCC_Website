import { useEffect, useState } from 'react'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import gccLogo from '../../../../public/assets/icons/logo/gcc-logo-white.svg'

const hankenGrotesk = { fontFamily: '"Hanken Grotesk", sans-serif' }

const links = [
  { label: 'Services', href: '#structures-we-build' },
  { label: 'Process', href: '#one-team' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about-stats' },
]

const CONSULTATION_HREF = '#contact-cta'

function ChevronRight() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 6l6 6-6 6" />
    </svg>
  )
}

export function NavbarSection() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Mobile: navbar is transparent over the hero, and fills in once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filled = open || scrolled

  return (
    <header
      id="navbar"
      className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] -translate-x-1/2 lg:w-[min(87%,1252px)]"
    >
      <div
        className={`relative rounded-xl border px-4 py-4 transition-colors duration-300 lg:border-white/10 lg:bg-[#1F5B7C]/75 lg:bg-none lg:px-6 lg:py-3 lg:shadow-lg lg:backdrop-blur-md ${
          filled
            ? 'border-white/10 bg-gradient-to-br from-[#1B3846] to-[#25505F] shadow-lg backdrop-blur-md'
            : 'border-transparent'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" aria-label="Garg Core Construction home" className="shrink-0">
            <img
              src={gccLogo}
              alt="Garg Core Construction"
              width={177}
              height={34}
              className="h-[34px] w-[177px]"
            />
          </a>

          {/* Links (desktop) */}
          <nav
            style={hankenGrotesk}
            className="hidden items-start gap-10 text-[14px] font-medium uppercase leading-6 text-white lg:flex"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap transition-colors hover:text-[#FFE6A7]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Button (desktop) */}
          <a
            href={CONSULTATION_HREF}
            style={hankenGrotesk}
            className="hidden items-center gap-2 whitespace-nowrap rounded-lg bg-[#6F1D1B] py-3 pl-6 pr-5 text-[14px] font-semibold uppercase leading-4 tracking-[1.12px] text-white transition-colors hover:bg-[#5a1716] lg:flex"
          >
            Book a Consultation
            <ChevronRight />
          </a>

          {/* Menu toggle (mobile / tablet) */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-12 items-center justify-center rounded-xl bg-white/15 text-white lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div
            style={hankenGrotesk}
            className="mt-3 flex flex-col gap-1 border-t border-white/15 pt-3 lg:hidden"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-[14px] font-medium uppercase leading-6 text-white hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            <a
              href={CONSULTATION_HREF}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#6F1D1B] py-3 pl-6 pr-5 text-[14px] font-semibold uppercase leading-4 tracking-[1.12px] text-white"
            >
              Book a Consultation
              <ChevronRight />
            </a>
          </div>
        )}
      </div>
    </header>
  )
}