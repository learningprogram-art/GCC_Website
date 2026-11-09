import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface FooterLink {
  label: string
  href: string
}

// Clean path -> id of the section on the home page
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

const exploreLinksCol1: FooterLink[] = [
  { label: 'About us', href: '/about' },
  { label: 'Why GCC', href: '/why-gcc' },
  { label: 'How we build', href: '/how-we-build' },
]

const exploreLinksCol2: FooterLink[] = [
  { label: 'Transparency', href: '/transparency' },
  { label: 'Client stories', href: '/client-stories' },
]

const exploreLinksCol3: FooterLink[] = [
  { label: 'Home estimation', href: '/home-estimation' },
  { label: 'Book free consultation', href: '/contact' },
  { label: 'AMC Portal', href: '/amc-portal' },
]

const CURRENT_YEAR = 2026

const LINK_CLASS =
  'text-[1rem] font-normal sm:font-medium leading-[1.5rem] text-[#FFFCF2] hover:text-[#FFE6A7] transition-colors duration-150 inline-block'

/** Changes only the address bar (no router navigation, no #hash). */
function showPathInUrl(href: string) {
  window.history.replaceState(window.history.state, '', href)
}

/** Scrolls to a section by id, retrying for ~2 seconds while the page renders. */
function scrollToSection(id: string, href: string) {
  let tries = 0
  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      showPathInUrl(href)
    } else if (tries++ < 40) {
      window.setTimeout(tick, 50)
    }
  }
  window.setTimeout(tick, 50)
}

export function Footer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isHome = pathname === '/' || pathname in SECTION_IDS

  const handleClick = (e: MouseEvent, href: string) => {
    const id = SECTION_IDS[href]
    if (!id) return // normal page link like /about

    e.preventDefault()
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      showPathInUrl(href)
    } else {
      navigate('/')
      scrollToSection(id, href)
    }
  }

  return (
    <footer
      id="footer"
      style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
      className="relative w-full overflow-x-hidden bg-[#252422] text-[#FFFCF2] flex flex-col px-6 md:px-12 lg:!px-[96px] pt-[3.625rem] pb-0"
    >
      {/* Content Container (Full width between the 96px / 6rem left & right paddings) */}
      <div className="w-full pb-[2rem] flex flex-col gap-[2rem]">
        {/* Brand and Navigation Row */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-[1.5rem] sm:gap-[2.5rem] lg:gap-[4rem] xl:gap-[5rem]">
          {/* Brand Info */}
          <div className="flex flex-col gap-[1.25rem] items-start w-full lg:w-[26.5rem] shrink-0">
            <Link to="/" aria-label="Garg Core Construction home" className="inline-block">
              <img
                src="/assets/icons/logo/gcc-logo-white.svg"
                alt="Garg Core Construction"
                width={208}
                height={40}
                className="h-[2.5rem] w-auto object-contain"
              />
            </Link>
            <p className="text-[1rem] leading-[1.5rem] font-normal text-[#CCC5B9] max-w-[22.5rem] [word-break:break-word]">
              One dependable team for your villa or farmhouse — from design and engineering to
              construction and key handover.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-col sm:flex-row flex-1 items-start justify-between gap-[2.5rem] lg:gap-[3rem] xl:gap-[5rem] w-full">
            {/* Explore GCC 1 (Dual Columns) */}
            <div className="flex flex-col gap-[1.25rem] items-start w-full sm:w-auto lg:w-[26.5rem]">
              <span className="text-[0.75rem] font-semibold leading-[1rem] tracking-[0.06rem] text-[#FFE6A7] uppercase">
                Explore GCC
              </span>

              <div className="flex flex-row items-start gap-[1.5rem] w-full">
                {/* Column 1 */}
                <ul className="flex flex-col gap-[1rem] flex-1">
                  {exploreLinksCol1.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        onClick={(e) => handleClick(e, link.href)}
                        className={LINK_CLASS}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Column 2 */}
                <ul className="flex flex-col gap-[1rem] flex-1">
                  {exploreLinksCol2.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        onClick={(e) => handleClick(e, link.href)}
                        className={LINK_CLASS}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {/* Mobile only: Home estimation joins column 2 */}
                  <li className="sm:hidden">
                    <Link
                      to={exploreLinksCol3[0].href}
                      onClick={(e) => handleClick(e, exploreLinksCol3[0].href)}
                      className={LINK_CLASS}
                    >
                      {exploreLinksCol3[0].label}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Explore GCC 2 (Single Column) — hidden on mobile */}
            <div className="hidden sm:flex flex-col gap-[1.25rem] items-start w-full sm:w-auto">
              <span className="text-[0.75rem] font-semibold leading-[1rem] tracking-[0.06rem] text-[#FFE6A7] uppercase">
                Explore GCC
              </span>

              <ul className="flex flex-col gap-[1rem]">
                {exploreLinksCol3.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={(e) => handleClick(e, link.href)}
                      className="text-[1rem] font-medium leading-[1.5rem] text-[#FFFCF2] hover:text-[#FFE6A7] transition-colors duration-150 inline-block whitespace-nowrap"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider and Copyright Row */}
        <div className="flex flex-col gap-[1.5rem] items-start w-full pt-[0.5rem]">
          {/* Subtle 1px Divider (Extends exactly from 96px left to 96px right padding) */}
          <div className="w-full h-px bg-[#403D39]" role="separator" />

          {/* Legal Information */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[0.25rem] sm:gap-[0.5rem] text-[0.875rem] font-normal sm:font-medium leading-[1.25rem] text-[#CCC5B9]">
            <p className="m-0">© {CURRENT_YEAR} Garg Core Construction.</p>
            <p className="m-0">All rights reserved.</p>
          </div>
        </div>
      </div>

      <div
        className="relative left-1/2 w-screen max-w-none -translate-x-1/2 h-[0.375rem] bg-[#E06422] shrink-0"
        aria-hidden="true"
      />
    </footer>
  )
}

export default Footer