import { useState } from 'react'
import '@fontsource/bai-jamjuree/600.css'
import '@fontsource/bai-jamjuree/700.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/700.css'

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

  const handleCopy = (text: string, type: string, e: React.MouseEvent) => {
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
      {/* Background Cover Image with 50% dark overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/images/contact-bg.jpg"
          alt="Construction site groundwork"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Decorative Ellipse Ambient Glows from Figma */}
      <div className="absolute left-[-7.5rem] top-[-9.375rem] z-[1] pointer-events-none opacity-80">
        <img
          src="/assets/images/contact-ellipse-1.svg"
          alt=""
          className="size-[25rem] max-w-none"
        />
      </div>
      <div className="absolute right-[-6.25rem] bottom-[-6.25rem] z-[1] pointer-events-none opacity-80">
        <img
          src="/assets/images/contact-ellipse-2.svg"
          alt=""
          className="size-[31.25rem] max-w-none"
        />
      </div>

      {/* Main Content Container with standard 96px (6rem) horizontal padding */}
      <div className="relative z-10 mx-auto flex w-full flex-col lg:flex-row items-center justify-between gap-[3rem] lg:gap-[5rem] px-6 md:px-12 lg:px-[6rem] py-[4rem] lg:py-[5rem]">
        {/* Left Column: Intro & Contact Options (Figma Node 211:5478) */}
        <div className="flex flex-1 flex-col items-start gap-[32px] w-full max-w-[40.5rem]">
          {/* Headline & Subtitle Block */}
          <div className="flex flex-col items-start gap-[16px] w-full">
            <p className="text-[20px] leading-[28px] font-normal text-white m-0">
              Every strong structure starts with
              <br className="hidden sm:inline" /> the right conversation.
            </p>

            <h2
              style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
              className="text-[2.25rem] sm:text-[2.75rem] lg:text-[48px] font-bold uppercase leading-[1.2] text-[#FFFCF2] tracking-normal m-0"
            >
              Begin Your Construction Journey
            </h2>

            <p className="text-[16px] leading-[24px] font-normal text-white m-0">
              Tell us what you&apos;re planning. We answer with proof.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="flex flex-col gap-[12px] items-start w-full">
            {/* 1. Phone Card */}
            <div
              onClick={() => window.open('tel:+919002339920')}
              className="group flex w-[300px] max-w-full h-[70px] p-[12px] items-center gap-[16px] rounded-[8px] bg-[#252422]/60 backdrop-blur-sm transition-all hover:bg-[#252422]/80 cursor-pointer border border-white/5 hover:border-white/20 shrink-0"
            >
              <div className="flex size-[24px] shrink-0 items-center justify-center">
                <img
                  src="/assets/icons/contact-phone.svg"
                  alt=""
                  className="size-[24px] object-contain"
                />
              </div>

              <div className="flex flex-col gap-[2px] items-start min-w-0">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[14px] font-medium leading-[20px] text-[#FFFCF2] whitespace-nowrap">
                    Call +91 90023 39920
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy('+91 90023 39920', 'phone', e)}
                    aria-label="Copy phone number"
                    className="p-0.5 text-white/70 hover:text-white transition-colors"
                  >
                    <img
                      src="/assets/icons/contact-copy.svg"
                      alt=""
                      className="size-[14px]"
                    />
                  </button>
                  {copiedType === 'phone' && (
                    <span className="text-[11px] font-semibold text-[#FFE6A7] animate-pulse">
                      Copied!
                    </span>
                  )}
                </div>
                <span className="text-[16px] font-normal leading-[24px] text-[#FFFCF2]/60 whitespace-nowrap">
                  Speak to an engineer directly
                </span>
              </div>
            </div>

            {/* 2. WhatsApp Card */}
            <a
              href="https://wa.me/919002339920"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-[300px] max-w-full h-[70px] p-[12px] items-center gap-[16px] rounded-[8px] bg-[#252422]/60 backdrop-blur-sm transition-all hover:bg-[#252422]/80 cursor-pointer border border-white/5 hover:border-white/20 shrink-0"
            >
              <div className="flex size-[24px] shrink-0 items-center justify-center">
                <img
                  src="/assets/icons/contact-whatsapp.svg"
                  alt=""
                  className="size-[24px] object-contain"
                />
              </div>

              <div className="flex flex-col gap-[2px] items-start min-w-0">
                <span className="text-[14px] font-medium leading-[20px] text-[#FFFCF2] whitespace-nowrap">
                  Whatsapp
                </span>
                <span className="text-[16px] font-normal leading-[24px] text-[#FFFCF2]/60 whitespace-nowrap">
                  Quick updates on your project
                </span>
              </div>
            </a>

            {/* 3. Email Card */}
            <div
              onClick={() => window.open('mailto:contact@gcc.com')}
              className="group flex w-[300px] max-w-full h-[70px] p-[12px] items-center gap-[16px] rounded-[8px] bg-[#252422]/60 backdrop-blur-sm transition-all hover:bg-[#252422]/80 cursor-pointer border border-white/5 hover:border-white/20 shrink-0"
            >
              <div className="flex size-[24px] shrink-0 items-center justify-center">
                <img
                  src="/assets/icons/contact-email.svg"
                  alt=""
                  className="size-[24px] object-contain"
                />
              </div>

              <div className="flex flex-col gap-[2px] items-start min-w-0">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[14px] font-medium leading-[20px] text-[#FFFCF2] whitespace-nowrap">
                    Email contact@gcc.com
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy('contact@gcc.com', 'email', e)}
                    aria-label="Copy email address"
                    className="p-0.5 text-white/70 hover:text-white transition-colors"
                  >
                    <img
                      src="/assets/icons/contact-copy.svg"
                      alt=""
                      className="size-[14px]"
                    />
                  </button>
                  {copiedType === 'email' && (
                    <span className="text-[11px] font-semibold text-[#FFE6A7] animate-pulse">
                      Copied!
                    </span>
                  )}
                </div>
                <span className="text-[16px] font-normal leading-[24px] text-[#FFFCF2]/60 whitespace-nowrap">
                  Send us your project brief
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Form Card Container */}
        <div className="w-full lg:w-[32.5rem] shrink-0 rounded-[0.75rem] bg-[#252422] p-[1.75rem] sm:p-[2rem] shadow-2xl flex flex-col gap-[1.5rem] border border-white/10">
          <h3
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
            className="text-[1.25rem] sm:text-[1.375rem] font-semibold leading-[1.75rem] tracking-[-0.01em] text-[#FFFCF2] m-0"
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
              {/* Full Name */}
              <div className="flex flex-col gap-[0.5rem] items-start w-full">
                <label className="text-[0.875rem] font-medium leading-[1.25rem] text-[#D4CFC2]">
                  Full name
                </label>
                <div className="flex h-[3.375rem] w-full items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] px-[1rem] overflow-hidden focus-within:border-[#6F1D1B] focus-within:ring-1 focus-within:ring-[#6F1D1B]">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-transparent text-[1rem] leading-[1.5rem] font-normal text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-[0.5rem] items-start w-full">
                <label className="text-[0.875rem] font-medium leading-[1.25rem] text-[#D4CFC2]">
                  Phone Number
                </label>
                <div className="flex h-[3.375rem] w-full items-center gap-[0.625rem] rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] px-[1rem] overflow-hidden focus-within:border-[#6F1D1B] focus-within:ring-1 focus-within:ring-[#6F1D1B]">
                  <span className="text-[0.875rem] font-medium leading-[1.25rem] text-[#252422] shrink-0">
                    +91
                  </span>
                  <div className="h-[1.25rem] w-px bg-[#CCC5B9] shrink-0" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 98765 43210"
                    className="w-full bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                  />
                </div>
              </div>

              {/* PIN and Project Type (Side-by-Side on desktop) */}
              <div className="flex flex-col sm:flex-row gap-[1rem] items-start w-full">
                {/* Site Location PIN */}
                <div className="flex flex-1 flex-col gap-[0.5rem] items-start w-full">
                  <label className="text-[0.875rem] font-medium leading-[1.25rem] text-[#D4CFC2]">
                    Site Location PIN
                  </label>
                  <div className="flex h-[3.375rem] w-full items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] px-[1rem] overflow-hidden focus-within:border-[#6F1D1B] focus-within:ring-1 focus-within:ring-[#6F1D1B]">
                    <input
                      type="text"
                      value={formData.locationPin}
                      onChange={(e) => setFormData({ ...formData, locationPin: e.target.value })}
                      placeholder="e.g. 302001"
                      className="w-full bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div className="flex flex-1 flex-col gap-[0.5rem] items-start w-full">
                  <label className="text-[0.875rem] font-medium leading-[1.25rem] text-[#D4CFC2]">
                    Project Type
                  </label>
                  <div className="relative flex h-[3.375rem] w-full items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] px-[1rem] overflow-hidden focus-within:border-[#6F1D1B] focus-within:ring-1 focus-within:ring-[#6F1D1B]">
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full appearance-none bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none cursor-pointer pr-[1.5rem]"
                    >
                      <option value="" disabled className="text-gray-400">
                        Select project type
                      </option>
                      <option value="Villa">Villa</option>
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Other">Other Structure</option>
                    </select>
                    <div className="pointer-events-none absolute right-[1rem] flex size-[1.25rem] items-center justify-center">
                      <img
                        src="/assets/icons/arrow.svg"
                        alt=""
                        className="size-[1.25rem]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-[0.5rem] items-start w-full">
                <label className="text-[0.875rem] font-medium leading-[1.25rem] text-[#D4CFC2]">
                  Message
                </label>
                <div className="flex min-h-[3.375rem] w-full items-center rounded-[0.375rem] border border-[#CCC5B9] bg-[#FFFCF2] px-[1rem] py-[0.75rem] overflow-hidden focus-within:border-[#6F1D1B] focus-within:ring-1 focus-within:ring-[#6F1D1B]">
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="w-full resize-none bg-transparent text-[0.875rem] font-medium leading-[1.25rem] text-[#403D39] outline-none placeholder:text-[#403D39]/70"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-[0.5rem] flex h-[3.25rem] w-full items-center justify-center gap-[0.5rem] rounded-[0.5rem] bg-[#6F1D1B] px-[1.5rem] py-[0.75rem] text-[1.125rem] font-bold leading-[1.75rem] tracking-[-0.0225rem] text-white transition-all hover:bg-[#5C1715] active:scale-[0.99] cursor-pointer shadow-md"
              >
                <span>Submit Enquiry</span>
                <img
                  src="/assets/icons/arrow.svg"
                  alt=""
                  className="size-[1.5rem]"
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactSection
