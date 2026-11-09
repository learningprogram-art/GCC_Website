import { cn } from '@/utils/cn'
import { useInViewOnce } from '@/hooks/useInViewOnce'

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#portal-access { padding-left: 20px; padding-right: 20px; padding-top: 40px; padding-bottom: 40px; }
@media (min-width: 640px)  { #portal-access { padding-left: 32px; padding-right: 32px; padding-top: 56px; padding-bottom: 56px; } }
@media (min-width: 1024px) { #portal-access { padding-left: 96px; padding-right: 96px; padding-top: 80px; padding-bottom: 80px; } }
`

export interface PortalAccessSectionProps {
  className?: string
  loginHref?: string
  registerHref?: string
}

export function PortalAccessSection({
  className,
  loginHref = '#login',
  registerHref = '#register',
}: PortalAccessSectionProps) {
  const [cardRef, cardIn] = useInViewOnce<HTMLDivElement>(0.15)

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="portal-access"
        data-node-id="211:5382"
        aria-label="GCC AMC Portal Access"
        className={cn(
          'relative w-full bg-[#FFFCF2]',
          className
        )}
      >
        <div ref={cardRef} className="mx-auto max-w-[1248px] w-full">
          {/* ==============================================================
              MOBILE VIEW (Figma Node 211:4814 / 211:4785)
              Card: 351px x 764px, rounded-[12px], bg image gcc-amc-card-mob.webp
             ============================================================== */}
          <div
            data-node-id="211:4785"
            className={cn(
              'sm:hidden relative w-full max-w-[351px] h-[764px] mx-auto rounded-[12px] overflow-hidden bg-[#252422] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
              cardIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            {/* Background image: contains top dot grid + GCC AMC logo and bottom relaxing man + chips */}
            <img
              src="/assets/images/amc/gcc-amc-card-mob.webp"
              alt="GCC AMC Portal"
              className="absolute inset-0 size-full object-cover pointer-events-none select-none"
              decoding="async"
              loading="eager"
            />

            {/* Screen reader heading */}
            <div className="sr-only">
              <h2>GCC AMC Portal</h2>
            </div>

            {/* Welcome and actions (Figma Node 211:4798) */}
            <div
              data-node-id="211:4798"
              className="absolute top-[104px] left-[20px] right-[20px] z-10 flex flex-col gap-[32px] items-start"
            >
              {/* Welcome text block (Figma Node 211:4799) */}
              <div data-node-id="211:4799" className="flex flex-col gap-[12px] items-start w-full">
                <h2
                  data-node-id="211:4800"
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                  className="m-0 text-white font-bold text-[30px] leading-[1.1] tracking-[-0.15px] uppercase"
                >
                  Welcome to <br />
                  the AMC Portal
                </h2>
                <p
                  data-node-id="211:4801"
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                  className="m-0 text-[#CCC5B9] font-medium text-[14px] leading-[20px] max-w-[194px]"
                >
                  Log in to continue, or create an account to get started.
                </p>
              </div>

              {/* Access Actions (Figma Node 211:4802) */}
              <div data-node-id="211:4802" className="flex flex-col gap-[12px] items-start w-full">
                {/* Log in Button (Figma Node 211:4803) */}
                <a
                  href={loginHref}
                  data-node-id="211:4803"
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                  className="w-full h-[58px] rounded-[8px] bg-[#FFFCF2] hover:bg-white active:bg-[#F5F0E6] pl-[24px] pr-[20px] py-[12px] flex items-center justify-between text-[#252422] no-underline shadow-sm transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[18px] leading-[28px] tracking-[-0.36px]">
                    Log in
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[24px] shrink-0 pointer-events-none"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>

                {/* Register Button (Figma Node 211:4804) */}
                <a
                  href={registerHref}
                  data-node-id="211:4804"
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                  className="w-full h-[58px] rounded-[8px] bg-[#252422] hover:bg-[#2c2b29] active:bg-[#1f1e1c] border border-[#403D39] px-[20px] py-[12px] flex items-center justify-center text-white no-underline transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[18px] leading-[28px] tracking-[-0.36px] text-center">
                    Register
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* ==============================================================
              DESKTOP VIEW (Figma Node 211:5382 / 297:4035)
              Card: 1248px x 560px, rounded-[12px], bg image GCC-AMC-Portal-access-card.webp
             ============================================================== */}
          <div
            data-node-id="297:4035"
            className={cn(
              'hidden sm:block relative w-full sm:min-h-[500px] lg:min-h-0 lg:h-[560px] lg:aspect-[1248/560] overflow-hidden rounded-[12px] bg-[#252422] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
              cardIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            {/* Background image (2496x1120, optimized 2x retina display) */}
            <img
              src="/assets/images/amc/GCC-AMC-Portal-access-card.webp"
              alt="GCC AMC Portal Access"
              className="absolute inset-0 size-full object-cover object-[70%_center] lg:object-fill pointer-events-none select-none"
              decoding="async"
              loading="eager"
            />

            {/* Left Content Area (Figma Node 211:5396) */}
            <div
              style={{ transitionDelay: cardIn ? '150ms' : '0ms' }}
              className={cn(
                'relative z-10 flex flex-col justify-end h-full p-[2rem] sm:p-[3rem] lg:px-[56px] lg:pb-[56px] max-w-[512px] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                cardIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
            >
              <div className="flex flex-col gap-[1.5rem]">
                <div className="flex flex-col gap-[0.75rem]">
                  <h2
                    style={{
                      fontFamily: '"Bai Jamjuree", sans-serif',
                      fontSize: '40px',
                      lineHeight: '44px',
                      letterSpacing: '-0.4px',
                      fontWeight: 700,
                    }}
                    className="m-0 text-[#FFFCF2] max-w-[320px]"
                  >
                    Welcome to the
                    <br />
                    AMC Portal.
                  </h2>

                  <p
                    style={{
                      fontFamily: '"Hanken Grotesk", sans-serif',
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                    }}
                    className="m-0 text-[#CCC5B9] max-w-[295px]"
                  >
                    Log in to continue, or create an account to get started.
                  </p>
                </div>

                {/* Actions: Log in (Node 211:5401) & Register (Node 214:6266) */}
                <div className="flex items-center gap-[12px] pt-[0.25rem]">
                  {/* Log in Button (Figma Node 211:5401) */}
                  <a
                    href={loginHref}
                    data-node-id="211:5401"
                    style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                    className="w-[168px] pl-[24px] pr-[20px] py-[12px] flex items-center gap-[8px] rounded-[8px] bg-[#FFFCF2] hover:bg-white active:bg-[#F5F0E6] text-[#252422] no-underline shadow-sm transition-colors cursor-pointer select-none"
                  >
                    <span className="flex-1 font-bold text-[18px] leading-[28px] tracking-[-0.36px]">
                      Log in
                    </span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-[24px] shrink-0 pointer-events-none"
                      aria-hidden="true"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </a>

                  {/* Register Button (Figma Node 214:6266) */}
                  <a
                    href={registerHref}
                    data-node-id="214:6266"
                    style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                    className="w-[168px] pl-[24px] pr-[20px] py-[12px] flex items-center justify-center gap-[8px] rounded-[8px] border border-[#403D39] bg-[#252422] hover:bg-[#2e2d2a] hover:border-[#524e49] active:bg-[#1f1e1c] text-white no-underline transition-colors cursor-pointer select-none"
                  >
                    <span className="flex-1 font-bold text-[18px] leading-[28px] tracking-[-0.36px] text-center">
                      Register
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PortalAccessSection
