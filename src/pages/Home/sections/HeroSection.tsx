import { Button } from '@/components/ui/Button'
import heroHome from '/assets/images/hero-home.webp'
import heroHomeMobile from '/assets/images/hero-home-mobile.webp'
import heroPlane from '/assets/images/hero-plane.webp'

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
    <section
  id="hero-mobile"
  style={hanken}
  className="relative z-[1] -mb-px bg-[#FFFCF2] px-3 pb-10 pt-3 lg:hidden"
>
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

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
        >
          Book a Consultation
        </Button>
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

        {/* Plane */}
        <img
          src={heroPlane}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[87.5%] top-[28%] w-[4.5%] select-none"
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
              className="flex flex-1 flex-col gap-3 rounded-lg bg-[#FFE4A0] p-1.5 shadow-lg lg:flex-row lg:items-center lg:pl-[9px]"
            >
              {/* Left: image placeholder + heading */}
              <div className="flex items-center gap-[18px] lg:w-[210px] lg:shrink-0">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-md bg-[#252422] text-[#FFE4A0] shadow-sm">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 20a10 10 0 0 1 20 0" />
                    <circle cx="12" cy="10" r="4" />
                    <path d="M12 2v2" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-700">
                    Let&apos;s talk
                  </p>
                  <p className="text-sm font-semibold text-slate-900">Talk to an engineer</p>
                  <p className="text-[11px] text-slate-700">Free 30-min consultation</p>
                </div>
              </div>

              {/* Right: white panel with fields + tall submit button */}
              <div className="flex flex-1 flex-col gap-2 rounded-md bg-white p-2.5 sm:flex-row sm:items-stretch">
                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Type
                  <select
                    name="type"
                    defaultValue="Villa House"
                    className="h-7 rounded-md bg-[#EEF2F6] px-2.5 text-[10px] text-slate-800 outline-none"
                  >
                    <option value="Villa House">Villa House</option>
                    <option value="Farmhouse">Farmhouse</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Name
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="h-7 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-[10px] text-slate-800 outline-none placeholder:text-[#9A9A9A] focus:border-[#6B1A1A]"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Phone Number
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="e.g. +123 456 7890"
                    className="h-7 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-[10px] text-slate-800 outline-none placeholder:text-[#9A9A9A] focus:border-[#6B1A1A]"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-1 text-[10px] font-medium leading-[14px] text-slate-700">
                  Pin Code
                  <input
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="Enter 6-digit code"
                    className="h-7 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-[10px] text-slate-800 outline-none placeholder:text-[#9A9A9A] focus:border-[#6B1A1A]"
                  />
                </label>

                {/* Stretches to the full label + input height */}
                <button
                  type="submit"
                  aria-label="Submit enquiry"
                  className="flex h-9 w-full items-center justify-center rounded-md bg-[#6B1A1A] text-white transition hover:bg-[#561414] sm:h-auto sm:w-[58px]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M8.5 7H17v8.5" />
                  </svg>
                </button>
              </div>
            </form>

            {/* WhatsApp contact card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              className="flex w-full flex-col justify-between overflow-hidden rounded-lg bg-[#0D8C27] px-4 py-3 text-white transition hover:bg-[#0b7a22] sm:w-[117px] sm:shrink-0"
            >
              <div className="flex items-start justify-between">
                {/* WhatsApp logo */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>

                {/* Arrow up-right */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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