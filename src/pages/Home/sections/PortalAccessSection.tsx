import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { useInViewOnce } from '@/hooks/useInViewOnce'

type AuthMode = 'login' | 'register'

const MODAL_Z = 2147483100
const CLOSE_ANIM_MS = 280

// Side padding lives in plain CSS (ID selector) so nothing else can override it
const SECTION_CSS = `
#portal-access { padding-left: 1.25rem; padding-right: 1.25rem; padding-top: 2.5rem; padding-bottom: 2.5rem; }
@media (min-width: 640px)  { #portal-access { padding-left: 2rem; padding-right: 2rem; padding-top: 3.5rem; padding-bottom: 3.5rem; } }
@media (min-width: 1024px) { #portal-access { padding-left: 6rem; padding-right: 6rem; padding-top: 5rem; padding-bottom: 5rem; } }

/* AMC Portal Auth Modal (Desktop centered popup) & Bottom Sheet (Mobile < 640px) — all rem-scaled */
.amc-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: ${MODAL_Z};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  background-color: rgba(37, 36, 34, 0.65);
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  opacity: 0;
  transition: opacity ${CLOSE_ANIM_MS}ms ease;
}
.amc-modal-backdrop[data-open="true"] {
  opacity: 1;
}

.amc-modal-panel {
  position: relative;
  width: 100%;
  max-height: 90dvh;
  overflow-y: auto;
  background-color: #FFFCF2;
  color: #252422;
  border-radius: 1.25rem 1.25rem 0 0;
  padding: 0.75rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -0.5rem 2.5rem rgba(37, 36, 34, 0.25);
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${CLOSE_ANIM_MS}ms ease;
}
.amc-modal-backdrop[data-open="true"] .amc-modal-panel {
  transform: translateY(0);
}

.amc-modal-handle {
  width: 2.5rem;
  height: 0.25rem;
  border-radius: 9999px;
  background-color: #CCC5B9;
  margin: 0 auto 1rem;
}

@media (min-width: 640px) {
  .amc-modal-backdrop {
    align-items: center;
    padding: 1.5rem;
  }
  .amc-modal-panel {
    max-width: 28rem;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1.5rem 3.5rem rgba(37, 36, 34, 0.32);
    opacity: 0;
    transform: scale(0.95) translateY(0.5rem);
  }
  .amc-modal-backdrop[data-open="true"] .amc-modal-panel {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .amc-modal-handle {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amc-modal-backdrop,
  .amc-modal-panel {
    transition: none !important;
  }
}
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
  const [modalMode, setModalMode] = useState<AuthMode | null>(null)
  const [isShown, setIsShown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null)

  const openRafRef = useRef(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (openRafRef.current) {
      cancelAnimationFrame(openRafRef.current)
      openRafRef.current = 0
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openAuthModal = useCallback(
    (mode: AuthMode) => {
      clearTimers()
      setModalMode(mode)
      setSubmittedMsg(null)
      setShowPassword(false)
      openRafRef.current = requestAnimationFrame(() => {
        openRafRef.current = requestAnimationFrame(() => {
          openRafRef.current = 0
          setIsShown(true)
        })
      })
    },
    [clearTimers]
  )

  const closeAuthModal = useCallback(() => {
    clearTimers()
    setIsShown(false)
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null
      setModalMode(null)
      setSubmittedMsg(null)
    }, CLOSE_ANIM_MS)
  }, [clearTimers])

  useEffect(() => () => clearTimers(), [clearTimers])

  // Lock background scroll and allow Escape key to close while modal is open
  useEffect(() => {
    if (!modalMode) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modalMode, closeAuthModal])

  const switchMode = (nextMode: AuthMode) => {
    setModalMode(nextMode)
    setSubmittedMsg(null)
    setShowPassword(false)
  }

  const handleDummySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (modalMode === 'login') {
      setSubmittedMsg(
        'AMC Portal login is in preview mode. Your portal credentials will be activated once your project handover begins.'
      )
    } else {
      setSubmittedMsg(
        'Thank you for registering! Our AMC support team will verify your project details and activate your portal access shortly.'
      )
    }
  }

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="portal-access"
        data-node-id="211:5382"
        aria-label="GCC AMC Portal Access"
        className={cn(
          'relative z-10 -mt-[2px] w-full bg-[#FFFCF2]',
          className
        )}
      >
        <div ref={cardRef} className="mx-auto max-w-[78rem] w-full">
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
                  onClick={(e) => {
                    e.preventDefault()
                    openAuthModal('login')
                  }}
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
                  onClick={(e) => {
                    e.preventDefault()
                    openAuthModal('register')
                  }}
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
                    onClick={(e) => {
                      e.preventDefault()
                      openAuthModal('login')
                    }}
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
                    onClick={(e) => {
                      e.preventDefault()
                      openAuthModal('register')
                    }}
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

      {modalMode &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="amc-auth-title"
            data-open={isShown}
            className="amc-modal-backdrop"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeAuthModal()
            }}
          >
            <div
              className="amc-modal-panel"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
            >
              {/* Mobile drag handle */}
              <div className="amc-modal-handle" aria-hidden="true" />

              {/* Header + Cross close button */}
              <div className="flex items-start justify-between gap-[1rem]">
                <div className="flex flex-col gap-[0.375rem]">
                  <span className="inline-flex items-center gap-[0.5rem] text-[0.75rem] font-semibold uppercase tracking-[0.06rem] text-[#E06422]">
                    <span className="size-[0.375rem] bg-[#FB8B24]" aria-hidden="true" />
                    GCC AMC Portal
                  </span>
                  <h3
                    id="amc-auth-title"
                    style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                    className="m-0 text-[1.5rem] font-bold leading-[1.2] tracking-[-0.015rem] text-[#252422]"
                  >
                    {modalMode === 'login' ? 'Log in to your portal' : 'Create your AMC account'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeAuthModal}
                  aria-label="Close modal"
                  className="flex size-[2.25rem] shrink-0 items-center justify-center rounded-[0.5rem] border border-[#CCC5B9] bg-white text-[#252422] transition-colors hover:bg-[#F5F0E6] active:bg-[#ece5d2] cursor-pointer"
                >
                  <svg
                    className="size-[1.125rem]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mode switcher tabs */}
              <div className="mt-[1.25rem] grid grid-cols-2 gap-[0.375rem] rounded-[0.625rem] bg-[#F2EDE1] p-[0.25rem]">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={cn(
                    'rounded-[0.5rem] py-[0.5rem] text-[0.875rem] font-semibold transition-all cursor-pointer',
                    modalMode === 'login'
                      ? 'bg-[#252422] text-[#FFFCF2] shadow-sm'
                      : 'text-[#403D39] hover:text-[#252422]'
                  )}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={cn(
                    'rounded-[0.5rem] py-[0.5rem] text-[0.875rem] font-semibold transition-all cursor-pointer',
                    modalMode === 'register'
                      ? 'bg-[#252422] text-[#FFFCF2] shadow-sm'
                      : 'text-[#403D39] hover:text-[#252422]'
                  )}
                >
                  Register
                </button>
              </div>

              {submittedMsg ? (
                <div className="mt-[1.25rem] flex flex-col items-center gap-[0.75rem] rounded-[0.75rem] border border-[#CCC5B9] bg-white p-[1.5rem] text-center">
                  <div className="flex size-[2.75rem] items-center justify-center rounded-full bg-[#22C55E]/15 text-[#15803D]">
                    <svg
                      className="size-[1.5rem]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="m-0 text-[1rem] font-semibold text-[#252422]">
                    {modalMode === 'login' ? 'Preview Mode' : 'Registration Noted'}
                  </p>
                  <p className="m-0 text-[0.875rem] leading-[1.5] text-[#403D39]">
                    {submittedMsg}
                  </p>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="mt-[0.5rem] w-full rounded-[0.5rem] bg-[#6F1D1B] py-[0.75rem] text-[0.9375rem] font-semibold text-[#FFFCF2] transition-colors hover:bg-[#5A1716] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDummySubmit} className="mt-[1.25rem] flex flex-col gap-[1rem]">
                  {modalMode === 'register' && (
                    <label className="flex flex-col gap-[0.375rem] text-[0.875rem] font-medium text-[#403D39]">
                      Full Name
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="h-[2.75rem] w-full rounded-[0.5rem] border border-[#CCC5B9] bg-white px-[0.875rem] text-[0.9375rem] text-[#252422] outline-none placeholder:text-[#403D39]/55 focus:border-[#6F1D1B]"
                      />
                    </label>
                  )}

                  <label className="flex flex-col gap-[0.375rem] text-[0.875rem] font-medium text-[#403D39]">
                    {modalMode === 'login' ? 'Email or Project ID' : 'Email Address'}
                    <input
                      type={modalMode === 'login' ? 'text' : 'email'}
                      required
                      placeholder={modalMode === 'login' ? 'you@example.com or GCC-1042' : 'you@example.com'}
                      className="h-[2.75rem] w-full rounded-[0.5rem] border border-[#CCC5B9] bg-white px-[0.875rem] text-[0.9375rem] text-[#252422] outline-none placeholder:text-[#403D39]/55 focus:border-[#6F1D1B]"
                    />
                  </label>

                  {modalMode === 'register' && (
                    <label className="flex flex-col gap-[0.375rem] text-[0.875rem] font-medium text-[#403D39]">
                      Phone Number
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="e.g. 98765 43210"
                        className="h-[2.75rem] w-full rounded-[0.5rem] border border-[#CCC5B9] bg-white px-[0.875rem] text-[0.9375rem] text-[#252422] outline-none placeholder:text-[#403D39]/55 focus:border-[#6F1D1B]"
                      />
                    </label>
                  )}

                  <label className="flex flex-col gap-[0.375rem] text-[0.875rem] font-medium text-[#403D39]">
                    Password
                    <span className="relative block">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Enter your password"
                        className="h-[2.75rem] w-full rounded-[0.5rem] border border-[#CCC5B9] bg-white pl-[0.875rem] pr-[3.5rem] text-[0.9375rem] text-[#252422] outline-none placeholder:text-[#403D39]/55 focus:border-[#6F1D1B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-[0.75rem] font-semibold text-[#6F1D1B] hover:underline cursor-pointer"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="mt-[0.375rem] flex h-[3rem] w-full items-center justify-center gap-[0.5rem] rounded-[0.5rem] bg-[#6F1D1B] text-[1rem] font-bold text-[#FFFCF2] shadow-sm transition-colors hover:bg-[#5A1716] active:bg-[#481211] cursor-pointer"
                  >
                    {modalMode === 'login' ? 'Log in to Portal' : 'Create Account'}
                  </button>

                  <p className="m-0 pt-[0.25rem] text-center text-[0.8125rem] text-[#403D39]">
                    {modalMode === 'login' ? (
                      <>
                        New to GCC AMC?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('register')}
                          className="font-semibold text-[#6F1D1B] underline cursor-pointer"
                        >
                          Register here
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="font-semibold text-[#6F1D1B] underline cursor-pointer"
                        >
                          Log in
                        </button>
                      </>
                    )}
                  </p>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default PortalAccessSection
