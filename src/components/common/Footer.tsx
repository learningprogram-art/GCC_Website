import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'

interface FooterLink {
  label: string
  href: string
}

const exploreLinksCol1: FooterLink[] = [
  { label: 'About us', href: '#about-stats' },
  { label: 'Why GCC', href: '#why-gcc' },
  { label: 'How we build', href: '#how-we-build' },
]

const exploreLinksCol2: FooterLink[] = [
  { label: 'Transparency', href: '#transparency' },
  { label: 'Client stories', href: '#testimonials' },
]

const exploreLinksCol3: FooterLink[] = [
  { label: 'Home estimation', href: '#cost-calculator' },
  { label: 'Book free consultation', href: '#contact-cta' },
  { label: 'AMC Portal', href: '#portal-access' },
]

const CURRENT_YEAR = 2026

export function Footer() {
  return (
    <footer
      id="footer"
      style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
      className="relative w-full bg-[#252422] text-[#FFFCF2] flex flex-col"
    >
      {/* 96px Left & Right Padding Container (matching the rest of the page) */}
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-[1248px] pt-[2.5rem] md:pt-[3.625rem] pb-[2rem] flex flex-col gap-[2rem]">
          {/* Brand & Navigation Columns */}
          <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-[2.5rem] lg:gap-[5rem]">
            {/* Brand Block */}
            <div className="flex flex-col gap-[1.25rem] items-start w-full lg:w-[26.5rem] shrink-0">
              <a href="#hero" aria-label="Garg Core Construction home" className="inline-block">
                <img
                  src="/assets/icons/logo/gcc-logo-white.svg"
                  alt="Garg Core Construction"
                  width={208}
                  height={40}
                  className="h-[2.5rem] w-auto object-contain"
                />
              </a>
              <p className="text-[1rem] leading-[1.5rem] font-normal text-[#CCC5B9] max-w-[22.5rem] [word-break:break-word]">
                One dependable team for your villa or farmhouse — from design and engineering to
                construction and key handover.
              </p>
            </div>

            {/* Navigation Columns Wrapper */}
            <div className="flex flex-col sm:flex-row flex-1 items-start justify-between gap-[2.5rem] lg:gap-[5rem] w-full">
              {/* Explore GCC - Group 1 (Dual Sub-columns) */}
              <div className="flex flex-col gap-[1.25rem] items-start w-full sm:w-auto lg:w-[26.5rem]">
                <span className="text-[0.75rem] font-semibold leading-[1rem] tracking-[0.06rem] text-[#FFE6A7] uppercase">
                  Explore GCC
                </span>

                <div className="flex flex-row items-start gap-[1.5rem] w-full">
                  {/* Sub-column 1 */}
                  <ul className="flex flex-col gap-[1rem] flex-1">
                    {exploreLinksCol1.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[1rem] font-medium leading-[1.5rem] text-[#FFFCF2] hover:text-[#FFE6A7] transition-colors duration-150 inline-block"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Sub-column 2 */}
                  <ul className="flex flex-col gap-[1rem] flex-1">
                    {exploreLinksCol2.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[1rem] font-medium leading-[1.5rem] text-[#FFFCF2] hover:text-[#FFE6A7] transition-colors duration-150 inline-block"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Explore GCC - Group 2 (Single Column) */}
              <div className="flex flex-col gap-[1.25rem] items-start w-full sm:w-auto">
                <span className="text-[0.75rem] font-semibold leading-[1rem] tracking-[0.06rem] text-[#FFE6A7] uppercase">
                  Explore GCC
                </span>

                <ul className="flex flex-col gap-[1rem]">
                  {exploreLinksCol3.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[1rem] font-medium leading-[1.5rem] text-[#FFFCF2] hover:text-[#FFE6A7] transition-colors duration-150 inline-block whitespace-nowrap"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Divider and Legal / Copyright Section */}
          <div className="flex flex-col gap-[1.5rem] items-start w-full pt-[0.5rem]">
            {/* Subtle 1px Divider */}
            <div className="w-full h-px bg-[#403D39]" role="separator" />

            {/* Legal Row */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-[0.5rem] text-[0.875rem] font-medium leading-[1.25rem] text-[#CCC5B9]">
              <p className="m-0">© {CURRENT_YEAR} Garg Core Construction.</p>
              <p className="m-0">All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Accent Bottom Line (Edge-to-Edge) */}
      <div className="w-full h-[0.375rem] bg-[#E06422]" aria-hidden="true" />
    </footer>
  )
}

export default Footer
