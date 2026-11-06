import '@fontsource/bai-jamjuree/600.css'
import '@fontsource/bai-jamjuree/700.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

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
  return (
    <section
      id="portal-access"
      data-node-id="211:5382"
      aria-label="GCC AMC Portal Access"
      className={cn(
        'relative w-full bg-[#FFFCF2] py-[2.5rem] sm:py-[3.5rem] lg:py-[5rem] px-[1rem] sm:px-[2rem] lg:px-[6rem]',
        className
      )}
    >
      <div className="mx-auto max-w-[1248px] w-full">
        {/* AMC Card Container (Figma Node 297:4035: exact 1248px x 560px, rounded-[12px]) */}
        <div className="relative w-full min-h-[460px] sm:min-h-[500px] lg:min-h-0 lg:h-[560px] lg:aspect-[1248/560] overflow-hidden rounded-[12px] bg-transparent">
          {/* Background image (4992x2240, exactly 1248:560 ratio): fits frame width & height perfectly without distortion */}
          <img
            src="/assets/images/amc/GCC-AMC-Portal-access-card.png"
            alt="GCC AMC Portal Access"
            className="absolute inset-0 size-full object-cover object-[70%_center] lg:object-fill pointer-events-none select-none"
            loading="lazy"
          />

          {/* Semi-transparent dark overlay on mobile/tablet to ensure text readability */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#252422]/95 via-[#252422]/80 to-transparent lg:hidden pointer-events-none"
            aria-hidden="true"
          />

          {/* Left Content Area (Figma Node 211:5396: x=56px, y=258px, w=512px, h=246px) */}
          <div className="relative z-10 flex flex-col justify-end h-full p-[2rem] sm:p-[3rem] lg:px-[56px] lg:pb-[56px] max-w-[512px]">
            {/* Headline + Description + Buttons */}
            <div className="flex flex-col gap-[1.5rem]">
              <div className="flex flex-col gap-[0.75rem]">
                {/* Headline (Figma Node 211:5398: Bai Jamjuree, Bold, 40px, line-height 44px, max-w 320px) */}
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

                {/* Subtitle (Figma Node 211:5399: Hanken Grotesk, 16px, line-height 24px, max-w 295px) */}
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

              {/* Action Buttons: Primary 'Log in' & Secondary 'Register' */}
              <div className="flex items-center gap-[1rem] pt-[0.25rem]">
                {/* Primary: Log in with chevron arrow (Figma: on-dark cream button) */}
                <Button
                  variant="on-dark"
                  size="md"
                  href={loginHref}
                  className="cursor-default select-none shadow-sm px-[1.5rem] py-[0.75rem] text-[16px] font-semibold"
                >
                  Log in
                </Button>

                {/* Secondary: Register without chevron arrow (Figma: dark button with subtle border) */}
                <Button
                  variant="secondary"
                  size="md"
                  showIcon={false}
                  href={registerHref}
                  className="border border-white/20 bg-transparent text-[#FFFCF2] hover:bg-white/10 active:bg-white/15 cursor-default select-none px-[1.5rem] py-[0.75rem] text-[16px] font-semibold"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortalAccessSection

