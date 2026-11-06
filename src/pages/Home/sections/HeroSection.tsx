import '@fontsource/bai-jamjuree/600.css'
import '@fontsource/bai-jamjuree/700.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'
import heroHome from '../../../../public/assets/images/hero-home.png'
import heroHomeMobile from '../../../../public/assets/images/hero-home-mobile.png'

// Digits only, with country code and no "+" (e.g. 919876543210). Replace when you have the number.
const WHATSAPP_NUMBER = '91XXXXXXXXXX'
const WHATSAPP_MESSAGE = 'Hi, I would like to talk to an engineer about my project.'
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const bai = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hanken = { fontFamily: '"Hanken Grotesk", sans-serif' }

const fieldLabel = 'flex w-full flex-col gap-2 text-sm font-medium leading-5 text-[#403D39]'
const fieldInput =
  'w-full rounded-md border border-[#CCC5B9] bg-[#FFFCF2] py-3.5 pl-4 pr-3.5 text-base leading-6 text-[#403D39] outline-none placeholder:text-[#403D39]/70 focus:border-[#6F1D1B]'

function HeroMobile() {
  return (
    <section id="hero-mobile" style={hanken} className="bg-[#FFFCF2] px-3 pb-10 pt-3 lg:hidden">
      {/* Image card (Figma: 366 x 701, radius 12) */}
      <div className="relative isolate h-[701px] w-full overflow-hidden rounded-xl bg-[#347DA6]">
        <img
          src={heroHomeMobile}
          alt="Engineer holding a model home above a family playing on the lawn"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[46%_0%]"
          fetchPriority="high"
        />
        {/* Shade */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(37,36,34,0.72) 0%, rgba(37,36,34,0.15) 42%, rgba(37,36,34,0) 70%, rgba(37,36,34,0.35) 100%)',
          }}
        />

        {/* Headline (Figma top: 96px; nav above it is your existing navbar) */}
        <div className="absolute inset-x-4 top-24 flex flex-col items-center gap-3.5 text-center text-white">
          <h1
            style={bai}
            className="text-[40px] font-bold uppercase leading-none tracking-[-0.4px]"
          >
            Engineered
            <br />
            <span className="text-[#FFE6A7]">right.</span>
            <br />
            Executed
            <br />
            <span className="text-[#FFE6A7]">responsibly.</span>
          </h1>
          <p className="text-base leading-6">
            One team. Every stage. From engineering to construction and handover.
          </p>
        </div>
      </div>

      {/* Lead form, overlaps the image by 88px */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // TODO: submit enquiry (Supabase / API route)
        }}
        className="relative z-10 mx-3 -mt-[88px] flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_6px_rgba(37,36,34,0.06),0_16px_40px_rgba(37,36,34,0.1)]"
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase leading-4 tracking-[0.96px] text-[#E06422]">
            Let’s talk
          </p>
          <p style={bai} className="text-[22px] font-semibold leading-7 tracking-[-0.11px] text-[#252422]">
            Talk to an engineer
          </p>
          <p className="text-sm font-medium leading-5 text-[#403D39]">Free 30-min consultation</p>
        </div>

        <label className={fieldLabel}>
          Type
          <span className="relative block">
            <select
              name="type"
              defaultValue="Villa House"
              className={`${fieldInput} appearance-none pr-11 text-[#403D39]/70`}
            >
              <option value="Villa House">Villa House</option>
              <option value="Farmhouse">Farmhouse</option>
              <option value="Renovation">Renovation</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#403D39]"
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </label>

        <label className={fieldLabel}>
          Name
          <input name="name" type="text" required placeholder="Enter your full name" className={fieldInput} />
        </label>

        <label className={fieldLabel}>
          Phone Number
          <input name="phone" type="tel" required placeholder="e.g. +123 456 7890" className={fieldInput} />
        </label>

        <label className={fieldLabel}>
          Pin Code
          <input
            name="pincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{6}"
            placeholder="Enter 6-digit code"
            className={fieldInput}
          />
        </label>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6F1D1B] py-[15px] pl-6 pr-5 text-lg font-bold leading-7 tracking-[-0.36px] text-white transition hover:bg-[#5b1816]"
        >
          Book a Consultation
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </section>
  )
}

export function HeroSection() {
  return (
    <>
      <HeroMobile />

      {/* Desktop: your original section, unchanged except `hidden … lg:flex` */}
      <section
        id="hero"
        className="relative isolate hidden min-h-[640px] flex-col overflow-hidden lg:flex lg:min-h-0 lg:aspect-[3/2]"
      >
        {/* Background */}
        <img
          src={heroHome}
          alt="Engineer holding a model home above a family playing on the lawn"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
          fetchPriority="high"
        />

        {/* Headline */}
        <div className="mx-auto max-w-5xl px-6 pt-28 text-center lg:pt-[9vw]">
          <h1
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
            className="text-center text-4xl font-bold uppercase leading-[1.06] text-white sm:text-5xl lg:text-[length:min(4.3vw,62px)]"
          >
            Engineered <span className="text-[#FFE29A]">Right.</span>
            <br />
            Executed <span className="text-[#FFE29A]">Responsibly.</span>
          </h1>
          <p className="mt-3 text-xs text-white/90 sm:text-sm lg:text-[0.9vw]">
            One team. Every stage. From engineering to construction and handover.
          </p>
        </div>

        {/* Quick enquiry bar */}
        <div className="mt-auto w-full px-4 pb-4 lg:pb-[2.6vw]">
          <div className="mx-auto flex w-full flex-col gap-3 sm:flex-row sm:items-stretch lg:w-[87%]">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                // TODO: submit enquiry (Supabase / API route)
              }}
              className="flex flex-1 flex-col gap-3 rounded-lg bg-[#FFE4A0] p-2.5 shadow-lg lg:flex-row lg:items-center"
            >
              <div className="flex items-center gap-3 px-1 lg:w-64">
                <div className="h-14 w-14 shrink-0 rounded-md bg-[#C9C5BD]" />
                <div className="leading-tight">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-700">
                    Let&apos;s talk
                  </p>
                  <p className="text-sm font-semibold text-slate-900">Talk to an engineer</p>
                  <p className="text-[11px] text-slate-700">Free 30-min consultation</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 rounded-md bg-white p-2 sm:flex-row sm:items-end">
                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium text-slate-700">
                  Type
                  <select
                    name="type"
                    defaultValue="Villa House"
                    className="h-8 rounded bg-slate-100 px-2 text-xs text-slate-800 outline-none"
                  >
                    <option value="Villa House">Villa House</option>
                    <option value="Farmhouse">Farmhouse</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium text-slate-700">
                  Name
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="h-8 rounded border border-slate-200 px-2 text-xs outline-none placeholder:text-slate-400 focus:border-[#6B1A1A]"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium text-slate-700">
                  Phone Number
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="e.g. +123 456 7890"
                    className="h-8 rounded border border-slate-200 px-2 text-xs outline-none placeholder:text-slate-400 focus:border-[#6B1A1A]"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium text-slate-700">
                  Pin Code
                  <input
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="Enter 6-digit code"
                    className="h-8 rounded border border-slate-200 px-2 text-xs outline-none placeholder:text-slate-400 focus:border-[#6B1A1A]"
                  />
                </label>

                <button
                  type="submit"
                  aria-label="Submit enquiry"
                  className="flex h-8 w-full items-center justify-center rounded bg-[#6B1A1A] text-white transition hover:bg-[#561414] sm:w-12"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M8 7h9v9" />
                  </svg>
                </button>
              </div>
            </form>

            {/* WhatsApp contact card (Figma node 211:5054) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              className="flex min-h-[104px] w-full flex-col justify-between overflow-hidden rounded-lg bg-[#0D8C27] px-4 py-[14px] text-white transition hover:bg-[#0b7a22] sm:w-[117px] sm:shrink-0"
            >
              <div className="flex items-start justify-between">
                {/* WhatsApp icon */}
                <svg width="40" height="41" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 3.9A10.2 10.2 0 0 0 3.3 16.2L2 22l5.9-1.5A10.2 10.2 0 1 0 20 3.9Z" />
                  <g transform="translate(6.6 6.6) scale(0.45)">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </g>
                </svg>

                {/* Arrow up-right */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7M8.5 7H17v8.5" />
                </svg>
              </div>

              <p className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.96px]">
                Contact
              </p>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}