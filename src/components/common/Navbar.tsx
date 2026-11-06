import { useEffect, useState } from 'react'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export interface NavLinkItem {
  label: string
  href: string
}

export interface NavbarProps {
  links?: NavLinkItem[]
  consultationHref?: string
  logoSrc?: string
  className?: string
}

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: 'Services', href: '#structures-we-build' },
  { label: 'Process', href: '#one-team' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about-stats' },
]

const DEFAULT_CONSULTATION_HREF = '#contact-cta'

export function Navbar({
  links = DEFAULT_NAV_LINKS,
  consultationHref = DEFAULT_CONSULTATION_HREF,
  logoSrc = '/assets/icons/logo/gcc-logo-white.svg',
  className,
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Mobile/desktop: backdrop styling changes once scrolled past top threshold
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
      className={cn(
        'fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] -translate-x-1/2 lg:w-[min(87%,1252px)]',
        className
      )}
    >
      <div
        className={cn(
          'relative rounded-[13px] border px-4 py-3 transition-colors duration-300 lg:border-white/20 lg:bg-[#1F5B7C]/75 lg:px-4 lg:py-2 lg:shadow-lg lg:backdrop-blur-md',
          filled
            ? 'border-white/10 bg-gradient-to-br from-[#1B3846] to-[#265D7D] shadow-lg backdrop-blur-md'
            : 'border-transparent'
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            aria-label="Garg Core Construction home"
            className="shrink-0 flex items-center"
          >
            <img
              src={logoSrc}
              alt="Garg Core Construction"
              width={177}
              height={34}
              className="h-[34px] w-auto max-w-[177px]"
            />
          </a>

          {/* Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-10 font-['Hanken_Grotesk',sans-serif] text-[14px] font-medium uppercase leading-6 text-white lg:flex"
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

          {/* Reusable Primary Button (Desktop) */}
          <div className="hidden lg:block">
            <Button
              href={consultationHref}
              variant="primary"
              size="sm"
              className="tracking-[1.12px] uppercase"
            >
              Book a Consultation
            </Button>
          </div>

          {/* Menu Toggle (Mobile / Tablet) */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-xl bg-white/15 text-white transition-colors hover:bg-white/20 lg:hidden cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Panel */}
        {open && (
          <div className="mt-3 flex flex-col gap-1 border-t border-white/15 pt-3 font-['Hanken_Grotesk',sans-serif] lg:hidden">
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
            <div className="mt-2">
              <Button
                href={consultationHref}
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => setOpen(false)}
                className="tracking-[1.12px] uppercase justify-center"
              >
                Book a Consultation
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
