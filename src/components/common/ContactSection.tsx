import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

// Bottom-up reveal: fade + slide up (same feel as the other sections)
const REVEAL =
  'transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'
const revealState = (shown: boolean) =>
  shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
const delayStyle = (shown: boolean, ms: number) => ({
  transitionDelay: shown ? `${ms}ms` : '0ms',
})

const LABEL =
  'text-[0.75rem] sm:text-[0.875rem] font-medium leading-[1.25rem] text-[#D4CFC2] whitespace-nowrap'

/** Each group gets its own trigger: flips to true once, the first time it scrolls into view. */
function useReveal<T extends HTMLElement>(threshold = 0.2) {
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

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

/** Mobile-only arrow on the right of each contact card */
function CardArrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-auto size-[20px] shrink-0 text-white/60 sm:hidden"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

// Icon wrapper: round bordered circle on mobile, plain 24px icon on desktop
// Icon wrapper: soft filled circle on mobile, plain 24px icon on desktop
const ICON_WRAP =
  'flex shrink-0 items-center justify-center size-[40px] rounded-full bg-white/10 sm:size-[24px] sm:rounded-none sm:bg-transparent'

// Contact card shell: glass card on mobile (10px radius, 14% border, 8% fill), original look from sm up
const CARD =
  'group flex w-full h-[70px] p-[12px] items-center gap-[16px] cursor-pointer shrink-0 text-inherit no-underline transition-all rounded-[10px] border border-white/[0.14] bg-white/[0.08] sm:rounded-[8px] sm:border-0 sm:bg-[rgba(37,36,34,0.60)]'
const ICON_IMG = 'size-[20px] sm:size-[24px] object-contain'

const CARD_TITLE =
  'text-[16px] leading-[24px] sm:text-[14px] sm:leading-[20px] font-medium text-[#FFFCF2] whitespace-nowrap'
const CARD_SUB =
  'text-[12px] leading-[16px] sm:text-[16px] sm:leading-[24px] font-normal text-[#FFFCF2]/60 whitespace-nowrap'

export function ContactSection() {
  const [copiedType, setCopiedType] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    locationPin: '',
    projectType: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  // Scroll reveals
  const [introRef, introIn] = useReveal<HTMLDivElement>(0.3)
  const [cardsRef, cardsIn] = useReveal<HTMLDivElement>(0.3)
  const [formRef, formIn] = useReveal<HTMLDivElement>(0.15)

  const handleCopy = (text: string, type: string, e: React.MouseEvent) => {
    // The copy button lives inside a link, so stop the link from firing
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type)
      setTimeout(() => setCopiedType(null), 2000)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        fullName: '',
        phone: '',
        locationPin: '',
        projectType: '',
        message: '',
      })
      setSubmitted(false)
    }, 4000)
  }

  return (
    <section
      id="contact-cta"
      className="relative w-full overflow-hidden bg-[#252422] text-[#FFFCF2]"
      style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
    >
      {/* Background Cover Image (no gradient / glow overlays) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/images/contact/contact-bg.webp"
          alt="Construction site groundwork"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Main Content Container (mobile: no side padding, so the form can run edge to edge) */}
      <div className="relative z-10 mx-auto flex w-full flex-col lg:flex-row items-center justify-between gap-0 sm:gap-[3rem] lg:gap-[5rem] px-0 sm:px-6 md:px-12 lg:!px-[96px] py-0 sm:py-[4rem] lg:py-[5rem]">
        {/* Left Column: Intro & Contact Options (Figma Node 211:5478) */}
        <div className="flex flex-1 flex-col items-start gap-[24px] sm:gap-[32px] w-full max-w-[40.5rem] px-5 pt-12 pb-8 sm:p-0">
          {/* Headline & Subtitle Block */}
          <div ref={introRef} className="flex flex-col items-start gap-[12px] sm:gap-[16px] w-full">
            <p
              style={delayStyle(introIn, 0)}
              className={`text-[14px] leading-[20px] sm:text-[20px] sm:leading-[28px] font-normal text-white m-0 ${REVEAL} ${revealState(introIn)}`}
            >
              Every strong structure starts with
              <br className="hidden sm:inline" /> the right conversation.
            </p>

            <h2
              style={{ fontFamily: '"Bai Jamjuree", sans-serif', ...delayStyle(introIn, 150) }}
              className={`text-[2rem] sm:text-[2.75rem] lg:text-[48px] font-bold uppercase leading-[1.2] text-[#FFFCF2] tracking-normal m-0 ${REVEAL} ${revealState(introIn)}`}
            >
              Begin Your Construction Journey
            </h2>

            <p
              style={delayStyle(introIn, 300)}
              className={`text-[14px] leading-[20px] sm:text-[16px] sm:leading-[24px] font-normal text-white m-0 ${REVEAL} ${revealState(introIn)}`}
            >
              Tell us what you&apos;re planning. We answer with proof.
            </p>
          </div>

          {/* Contact Cards */}
          <div ref={cardsRef} className="flex flex-col gap-[12px] items-start w-full">
            {/* 1. Phone Card — opens the dialer on mobile */}
            <div
              style={delayStyle(cardsIn, 0)}
              className={`w-full sm:w-[300px] max-w-full shrink-0 ${REVEAL} ${revealState(cardsIn)}`}
            >
              <a
                href="tel:+919002339920"
                className={CARD}
              >
                <div className={ICON_WRAP}>
                  <img
                    src="/assets/icons/home/contact/contact-phone.svg"
                    alt=""
                    className={ICON_IMG}
                  />
                </div>

                <div className="flex flex-col gap-[2px] items-start min-w-0">
                  <div className="flex items-center gap-[4px]">
                    <span className={CARD_TITLE}>Call +91 90023 39920</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy('+91 90023 39920', 'phone', e)}
                      aria-label="Copy phone number"
                      className="hidden sm:inline-block p-0.5 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      <img
                        src="/assets/icons/home/contact/content-copy.svg"
                        alt=""
                        className="size-[14px]"
                      />
                    </button>
                    {copiedType === 'phone' && (
                      <span className="hidden sm:inline text-[11px] font-semibold text-[#FFE6A7] animate-pulse">
                        Copied!
                      </span>
                    )}
                  </div>
                  <span className={CARD_SUB}>Speak to an engineer directly</span>
                </div>
                <CardArrow />
              </a>
            </div>

            {/* 2. WhatsApp Card — opens WhatsApp */}
            <div
              style={delayStyle(cardsIn, 150)}
              className={`w-full sm:w-[300px] max-w-full shrink-0 ${REVEAL} ${revealState(cardsIn)}`}
            >
              <a
                href="https://wa.me/919002339920"
                target="_blank"
                rel="noopener noreferrer"
                className={CARD}
              >
                <div className={ICON_WRAP}>
                  <img
                    src="/assets/icons/home/contact/contact-whatsapp.svg"
                    alt=""
                    className={ICON_IMG}
                  />
                </div>

                <div className="flex flex-col gap-[2px] items-start min-w-0">
                  <span className={CARD_TITLE}>Whatsapp</span>
                  <span className={CARD_SUB}>Quick updates on your project</span>
                </div>
                <CardArrow />
              </a>
            </div>

            {/* 3. Email Card — opens the default email app */}
            <div
              style={delayStyle(cardsIn, 300)}
              className={`w-full sm:w-[300px] max-w-full shrink-0 ${REVEAL} ${revealState(cardsIn)}`}
            >
              <a
                href="mailto:contact@gcc.com"
                className={CARD}
              >
                <div className={ICON_WRAP}>
                  <img
                    src="/assets/icons/home/contact/contact-email.svg"
                    alt=""
                    className={ICON_IMG}
                  />
                </div>

                <div className="flex flex-col gap-[2px] items-start min-w-0">
                  <div className="flex items-center gap-[4px]">
                    <span className={CARD_TITLE}>Email contact@gcc.com</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy('contact@gcc.com', 'email', e)}
                      aria-label="Copy email address"
                      className="hidden sm:inline-block p-0.5 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      <img
                        src="/assets/icons/home/contact/content-copy.svg"
                        alt=""
                        className="size-[14px]"
                      />
                    </button>
                    {copiedType === 'email' && (
                      <span className="hidden sm:inline text-[11px] font-semibold text-[#FFE6A7] animate-pulse">
                        Copied!
                      </span>
                    )}
                  </div>
                  <span className={CARD_SUB}>Send us your project brief</span>
                </div>
                <CardArrow />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Form (Figma Node 211:5512) — full-width dark section on mobile */}
        <div
          ref={formRef}
          style={delayStyle(formIn, 0)}
          className={`w-full lg:w-[32.5rem] shrink-0 rounded-none sm:rounded-[0.75rem] bg-[#252422] px-5 py-8 sm:p-[2rem] shadow-none sm:shadow-2xl flex flex-col gap-[1.5rem] ${REVEAL} ${revealState(formIn)}`}
        >
          <h3
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
            className="text-[1.25rem] sm:text-[1.375rem] font-semibold leading-[1.75rem] tracking-[-0.11px] text-[#FFFCF2] m-0"
          >
            Share a few details and our team will connect with you.
          </h3>

          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-[1rem] py-[3rem] text-center">
              <div className="flex size-[3rem] items-center justify-center rounded-full bg-[#E06422]/20 text-[#E06422]">
                <svg
                  className="size-[1.75rem]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[1.125rem] font-semibold text-[#FFFCF2] m-0">
                Thank you! We&apos;ve received your request.
              </p>
              <p className="text-[0.875rem] text-[#CCC5B9] m-0 max-w-[18rem]">
                Our senior engineering team will review your project details and get in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem] w-full">
              {/* Full Name (Figma Node 211:5516) */}
              <div className="flex flex-col gap-[0.5rem] items-start w-full">
                <label className={LABEL}>Full name</label>
                <div className="flex h-[3.375rem] w-full items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] pl-[1rem] pr-[0.875rem] py-[0.875rem] overflow-hidden focus-within:border-[#6F1D1B]">
                  <input
                    id="contact-fullName"
                    name="fullName"
                    type="text"
                    required
                    minLength={2}
                    maxLength={60}
                    pattern="^[A-Za-z\s.'-]+$"
                    title="Please enter your full name (letters and spaces only)"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '')
                      setFormData({ ...formData, fullName: val })
                    }}
                    placeholder="Your name"
                    className="w-full bg-transparent text-[1rem] font-normal leading-[1.5rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                  />
                </div>
              </div>

              {/* Phone Number (Figma Node 211:5517) */}
              <div className="flex flex-col gap-[0.5rem] items-start w-full">
                <label className={LABEL}>Phone Number</label>
                <div className="flex h-[3.375rem] w-full items-center gap-[0.625rem] rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] pl-[1rem] pr-[0.875rem] py-[0.875rem] overflow-hidden focus-within:border-[#6F1D1B]">
                  <span className="text-[0.875rem] font-medium leading-[1.25rem] text-[#252422] shrink-0 select-none">
                    +91
                  </span>
                  <div className="h-[1.25rem] w-px bg-[#CCC5B9] shrink-0" />
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    title="Please enter a valid 10-digit mobile number"
                    autoComplete="tel-national"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setFormData({ ...formData, phone: val })
                    }}
                    placeholder="e.g. 98765 43210"
                    className="w-full bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                  />
                </div>
              </div>

              {/* PIN and Project Type (stacked on mobile, side-by-side from sm up) */}
              <div className="flex flex-col sm:flex-row gap-[1rem] items-start w-full">
                {/* Site Location PIN (Figma Node 211:5519) */}
                <div className="flex flex-1 flex-col gap-[0.5rem] items-start w-full">
                  <label className={LABEL}>Site Location PIN</label>
                  <div className="flex h-[3.375rem] w-full items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] pl-[1rem] pr-[0.875rem] py-[0.875rem] overflow-hidden focus-within:border-[#6F1D1B]">
                    <input
                      id="contact-locationPin"
                      name="locationPin"
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[1-9][0-9]{5}"
                      title="Please enter a valid 6-digit Indian PIN code"
                      value={formData.locationPin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setFormData({ ...formData, locationPin: val })
                      }}
                      placeholder="e.g. 110001"
                      className="w-full bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                    />
                  </div>
                </div>

                {/* Project Type (Figma Node 211:5520) */}
                <div className="flex flex-1 flex-col gap-[0.5rem] items-start w-full">
                  <label className={LABEL}>Project Type</label>
                  <div className="relative flex h-[3.375rem] w-full items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] pl-[1rem] pr-[0.875rem] py-[0.875rem] overflow-hidden focus-within:border-[#6F1D1B]">
                    <select
                      id="contact-projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      style={{ colorScheme: 'light' }}
                      className={`w-full appearance-none bg-transparent text-[0.875rem] font-medium leading-[1.25rem] outline-none cursor-pointer pr-[2rem] ${!formData.projectType ? 'text-[#403D39]/70' : 'text-[#403D39]'}`}
                    >
                      <option value="" disabled hidden>
                        Select project type
                      </option>
                      <option value="Villa House">Villa House</option>
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Renovation">Renovation</option>
                    </select>
                    <div className="pointer-events-none absolute right-[0.875rem] flex items-center justify-center text-[#403D39]">
                      <ChevronDown className="size-[20px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Message (Figma Node 211:5521) — tall textarea on mobile, single line from sm up */}
              <div className="flex flex-col gap-[0.5rem] items-start w-full">
                <label className={LABEL}>Message</label>
                <div className="flex h-[8rem] sm:h-[3.375rem] w-full items-start sm:items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] pl-[1rem] pr-[0.875rem] py-[0.875rem] overflow-hidden focus-within:border-[#6F1D1B]">
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="sm:hidden h-full w-full resize-none bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                  />
                  <input
                    id="contact-message"
                    name="message"
                    type="text"
                    maxLength={500}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="hidden sm:block w-full bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                  />
                </div>
              </div>

              {/* Submit Button (Figma Node 211:5522) — dark red on mobile, original style from sm up */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                className="relative h-[3.25rem] justify-center shadow-md max-sm:!bg-[#6F1D1B] max-sm:hover:!bg-[#7D2220] max-sm:!text-[#FFFCF2]"
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[20px] shrink-0 sm:absolute sm:right-[20px] sm:top-1/2 sm:-translate-y-1/2 sm:size-[24px]"
                    aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                }
              >
                <span className="font-bold text-[1.125rem] leading-[1.75rem] tracking-[-0.36px]">
                  Submit Enquiry
                </span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactSection