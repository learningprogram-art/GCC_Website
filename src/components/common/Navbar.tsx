import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const SECTION_IDS: Record<string, string> = {
  '/services': 'structures-we-build',
  '/process': 'one-team',
  '/why-gcc': 'why-gcc',
  '/how-we-build': 'how-we-build',
  '/transparency': 'transparency',
  '/client-stories': 'testimonials',
  '/home-estimation': 'cost-calculator',
  '/contact': 'contact-cta',
  '/amc-portal': 'portal-access',
}

export interface NavLinkItem {
  label: string
  href: string
}

export interface NavbarProps {
  links?: NavLinkItem[]
  consultationHref?: string
  logoSrc?: string
  /** Logo used when the navbar sits over a light section */
  logoDarkSrc?: string
  className?: string
}

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Process', href: '/process' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
]

const DEFAULT_CONSULTATION_HREF = '/contact'

const NAVBAR_BG = 'lg:bg-[#265D7D]'

/** Changes only the address bar (no router navigation, no new history entry, no #hash). */
function showPathInUrl(href: string) {
  window.history.replaceState(window.history.state, '', href)
}

/**
 * Scrolls to a section by id, retrying for ~2 seconds while the page renders.
 * If a href is given, the address bar is updated to that clean path afterwards.
 */
function scrollToSection(id: string, href?: string) {
  let tries = 0
  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (href) showPathInUrl(href)
    } else if (tries++ < 40) {
      window.setTimeout(tick, 50)
    }
  }
  window.setTimeout(tick, 50)
}

export function Navbar({
  links = DEFAULT_NAV_LINKS,
  consultationHref = DEFAULT_CONSULTATION_HREF,
  logoSrc = '/assets/icons/logo/gcc-logo-white.svg',
  logoDarkSrc = '/assets/icons/logo/gcc-logo-brown.svg',
  className,
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const lastY = useRef(0)
  const openRef = useRef(open)
  const tickingRef = useRef(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    openRef.current = open
  }, [open])

  const isHome = pathname === '/' || pathname in SECTION_IDS

  // Section links (/why-gcc, /contact...) show a clean path in the URL, never a #hash.
  const handleNavClick = (e: MouseEvent, href: string) => {
    setOpen(false)
    const id = SECTION_IDS[href]
    if (!id) return // normal page link like /about

    e.preventDefault()
    if (isHome) {
      // Already on the home page: scroll, and only update the address bar
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      showPathInUrl(href)
    } else {
      // On another page: go home first (that route always exists), then scroll
      navigate('/')
      scrollToSection(id, href)
    }
  }

  // Direct visit / refresh / back button on a section path (works once the routes are added in App.tsx)
  useEffect(() => {
    const id = SECTION_IDS[pathname]
    if (id) scrollToSection(id)
  }, [pathname])

  useEffect(() => {
    const hiddenRef = { current: false }
    const pastHeroRef = { current: false }

    const update = () => {
      const y = window.scrollY
      const delta = y - lastY.current

      let nextHidden = hiddenRef.current
      if (openRef.current || y <= 30) {
        nextHidden = false // always visible at the very top or while the mobile menu is open
      } else if (delta > 2) {
        nextHidden = true // scrolling down: slides up smoothly whether scrolling slowly or fast
      } else if (delta < -8) {
        nextHidden = false // scrolling up: slides back down smoothly (ignore tiny subpixel/anchor jitter)
      }

      if (hiddenRef.current !== nextHidden) {
        hiddenRef.current = nextHidden
        setHidden(nextHidden)
      }

      lastY.current = y

      // Check if user has scrolled down to sections after the hero section
      const hero = document.getElementById('hero') || document.getElementById('hero-mobile')
      let pastHero = false
      if (hero && hero.offsetHeight > 0) {
        const rect = hero.getBoundingClientRect()
        pastHero = rect.bottom <= 80
      } else {
        pastHero = y > 60
      }

      if (pastHeroRef.current !== pastHero) {
        pastHeroRef.current = pastHero
        setIsScrolledPastHero(pastHero)
      }

      tickingRef.current = false
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const linkClass = cn(
    'whitespace-nowrap transition-colors',
    isScrolledPastHero
      ? 'text-[#6F6F6F] hover:text-[#6F1D1B]'
      : 'text-white hover:text-[#FFE6A7]'
  )

  return (
    <header
      ref={headerRef}
      id="navbar"
      className={cn(
        'fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] -translate-x-1/2 transition-transform duration-300 ease-out lg:w-[min(87%,78.25rem)]',
        hidden ? '-translate-y-[calc(100%+24px)]' : 'translate-y-0',
        className
      )}
    >
      <div
        className={cn(
          'relative rounded-[13px] lg:border px-3.5 py-2 transition-all duration-300 sm:px-4 sm:py-2 lg:px-4 lg:py-2',
          open ? 'backdrop-blur-xl' : 'lg:backdrop-blur-md',
          isScrolledPastHero
            ? 'border-[rgba(133,133,133,0.2)] bg-white shadow-sm'
            : cn('border-transparent lg:border-white/20', isHome ? NAVBAR_BG : 'lg:bg-black/40')
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo with smooth crossfade */}
          <Link
            to="/"
            aria-label="Garg Core Construction home"
            className="shrink-0 relative flex items-center h-[28px] w-[146px] sm:h-[30px] sm:w-[156px]"
          >
            <img
              src={logoSrc}
              alt="Garg Core Construction"
              width={156}
              height={30}
              className={cn(
                'absolute left-0 top-0 h-[28px] sm:h-[30px] w-auto max-w-[156px] transition-opacity duration-300',
                isScrolledPastHero ? 'opacity-0 pointer-events-none' : 'opacity-100'
              )}
            />
            <img
              src={logoDarkSrc}
              alt="Garg Core Construction"
              width={156}
              height={30}
              className={cn(
                'absolute left-0 top-0 h-[28px] sm:h-[30px] w-auto max-w-[156px] transition-opacity duration-300',
                isScrolledPastHero ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            />
          </Link>

          {/* Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-8 xl:gap-9 font-['Hanken_Grotesk',sans-serif] text-[14px] font-medium uppercase leading-6 lg:flex"
          >
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={linkClass}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Reusable Primary Button (Desktop) */}
          <div className="hidden lg:block">
            <Button
              href={consultationHref}
              variant="primary"
              size="sm"
              onClick={(e) => handleNavClick(e, consultationHref)}
              className="rounded-[8px] py-2 pl-5 pr-4 text-[13.5px] tracking-[1.12px] uppercase [&_svg]:size-5"
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
            className={cn(
              'flex size-9 items-center justify-center rounded-lg transition-colors lg:hidden cursor-pointer',
              isScrolledPastHero
                ? 'bg-[#FFFCF2] border border-[rgba(133,133,133,0.25)] text-[#6F1D1B] hover:bg-[#F5F0E6]'
                : 'bg-white/15 text-white hover:bg-white/20'
            )}
          >
            <svg
              width="20"
              height="20"
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
          <div
            className={cn(
              "mt-2 flex flex-col gap-0.5 border-t pt-2 font-['Hanken_Grotesk',sans-serif] lg:hidden",
              isScrolledPastHero ? 'border-[rgba(133,133,133,0.2)]' : 'border-white/15'
            )}
          >
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  'rounded-lg px-2 py-2 text-[13px] font-medium uppercase leading-5 transition-colors',
                  isScrolledPastHero
                    ? 'text-[#6F6F6F] hover:text-[#6F1D1B] hover:bg-black/5'
                    : 'text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1.5">
              <Button
                href={consultationHref}
                variant="primary"
                size="sm"
                fullWidth
                onClick={(e) => handleNavClick(e, consultationHref)}
                className="py-2 text-[13px] tracking-[1.12px] uppercase justify-center [&_svg]:size-5"
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