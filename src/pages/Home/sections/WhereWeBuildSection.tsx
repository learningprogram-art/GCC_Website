import React, { useState } from 'react';
import { useInViewOnce } from '@/hooks/useInViewOnce';

const SERVICEABLE_PREFIXES = ['11', '201', '203']; // Delhi (11xxxx), Noida/Ghaziabad (201xxx), Jewar/Bulandshahr (203xxx)

export const WhereWeBuildCard: React.FC = () => {
  const [cardRef, cardIn] = useInViewOnce<HTMLDivElement>(0.15);
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<null | { serviceable: boolean; message: string }>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setStatus({ serviceable: false, message: 'Please enter a valid 6-digit pincode.' });
      return;
    }

    const isServiceable = SERVICEABLE_PREFIXES.some((prefix) => cleanPin.startsWith(prefix));
    if (isServiceable) {
      setStatus({
        serviceable: true,
        message: `Great news! Pincode ${cleanPin} is fully serviceable by GCC engineers.`,
      });
    } else {
      setStatus({
        serviceable: false,
        message: `Pincode ${cleanPin} is outside our core belt, but custom projects may be accommodated. Contact our team!`,
      });
    }
  };

  return (
    <>
      {/* ==============================================================
          MOBILE VIEW (Figma Node 203:3977: M / Where We Build)
          w-full max-w-[350px] mx-auto h-[600px], rounded-[16px]
          Glass card: 310px wide, top: 156px, backdrop-blur-[8px], bg-[rgba(37,36,34,0.55)]
         ============================================================== */}
      <div
        ref={cardRef}
        data-node-id="203:3978"
        className={`sm:hidden relative w-full max-w-[350px] mx-auto h-[600px] rounded-[16px] overflow-hidden border border-white/20 shadow-2xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          cardIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Mobile Background Map (where-we-build-mob.webp) */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="/assets/images/where-we-build-mob.webp"
            alt="Where We Build - Noida, Delhi, Jewar Aerial Map"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        {/* Mobile Glass Card (Figma Node 203:3982) */}
        <div
          data-node-id="203:3982"
          className="absolute z-10 top-[156px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[310px] rounded-[14px] backdrop-blur-[8px] bg-[rgba(37,36,34,0.55)] pt-[36px] pb-[20px] px-[20px] flex flex-col gap-[33px] items-center shadow-xl border border-white/10"
        >
          {/* Text Block (Figma Node 203:3996) */}
          <div data-node-id="203:3996" className="flex flex-col gap-[10px] items-center text-white text-center w-full">
            <h2
              data-node-id="203:3983"
              style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
              className="m-0 font-bold text-[30px] leading-[1.1] tracking-[-0.15px] uppercase text-white whitespace-nowrap"
            >
              Where we build
            </h2>

            <p
              data-node-id="203:3984"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              className="m-0 font-medium text-[14px] leading-[20px] text-white/80 text-center w-full max-w-[250px]"
            >
              Focused on villa and farmhouse <br />
              construction across <br />
              Noida, Jewar and beyond.
            </p>
          </div>

          {/* Pincode Check Form (Figma Node 203:3985) */}
          <form
            onSubmit={handleCheck}
            data-node-id="203:3985"
            className="flex gap-[8px] items-start w-full"
          >
            {/* Input (Figma Node 203:3986) */}
            <div
              data-node-id="203:3986"
              className="flex-1 bg-white rounded-[8px] h-[52px] px-[14px] flex items-center shadow-sm"
            >
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value);
                  if (status) setStatus(null);
                }}
                placeholder="Check your pincode"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                className="w-full bg-transparent text-[16px] leading-[24px] text-[#252422] placeholder:text-[#403D39]/70 outline-none border-none p-0"
                aria-label="Pincode"
              />
            </div>

            {/* Check Button (Figma Node 203:3988) */}
            <button
              type="submit"
              data-node-id="203:3988"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              className="h-[52px] px-[18px] py-[14px] bg-[#6F1D1B] hover:bg-[#5A1716] active:bg-[#481211] text-white font-bold text-[18px] leading-[28px] tracking-[-0.36px] rounded-[8px] whitespace-nowrap cursor-pointer shadow-sm border-none flex items-center justify-center shrink-0 transition-colors"
            >
              Check
            </button>
          </form>

          {status && (
            <p
              role="status"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              className={`text-xs -mt-2 px-3 py-1.5 rounded ${
                status.serviceable ? 'text-emerald-300 bg-emerald-950/60' : 'text-amber-200 bg-amber-950/60'
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </div>

      {/* ==============================================================
          DESKTOP VIEW (Figma Node 211:5553 & 211:5555)
          w-full sm:aspect-[1248/600], rounded-[16px]
         ============================================================== */}
      <div
        data-node-id="211:5553"
        className={`hidden sm:flex w-full relative rounded-[16px] overflow-hidden border border-white/30 sm:aspect-[1248/600] items-center justify-center shadow-2xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          cardIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Background Image: desktop wide illustration */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="/assets/images/where-we-build.webp"
            alt="Where We Build - Noida, Delhi, Jewar Aerial Map"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        {/* Central Glass Card (Figma Node 211:5555) */}
        <div
          data-node-id="211:5555"
          className="relative z-10 w-[38.8rem] max-w-[38.8rem] rounded-[0.75rem] bg-[rgba(0,0,0,0.4)] px-[4.5rem] py-[2.625rem] flex flex-col items-center text-center shadow-xl"
        >
          <div data-node-id="211:5556" className="w-full flex flex-col items-center justify-center gap-[1.875rem]">
            {/* Title & Description Block (Figma Node 211:5557) */}
            <div data-node-id="211:5557" className="w-full flex flex-col items-center gap-[1rem] text-white">
              <h2
                data-node-id="211:5558"
                className="m-0 font-['Bai_Jamjuree',sans-serif] text-[2.25rem] font-semibold leading-[2.75rem] tracking-[-0.0225rem] text-white whitespace-nowrap"
              >
                WHERE WE BUILD
              </h2>

              <div
                data-node-id="211:5559"
                className="w-full max-w-[29.8rem] font-['Hanken_Grotesk',sans-serif] text-[1.25rem] font-normal leading-[1.3] text-white/90 text-center"
              >
                <p className="m-0 leading-[1.3]">Your vision. Our expertise. Across locations.</p>
                <p className="m-0 leading-[1.3] mt-0">
                  <span>Focused on villa and farmhouse construction across</span>{' '}
                  <br />
                  <span className="font-bold text-white whitespace-nowrap">
                    Noida, Jewar and beyond.
                  </span>
                </p>
              </div>
            </div>

            {/* Input + Button Form Row (Figma Node 211:5560) */}
            <form
              onSubmit={handleCheck}
              data-node-id="211:5560"
              className="flex flex-row items-center justify-center gap-[0.75rem] w-auto"
            >
              {/* Input (Figma Node 211:5561) */}
              <div
                data-node-id="211:5561"
                className="w-[11.9375rem] h-[3.25rem] bg-white rounded-[0.45rem] border border-[#e5e7eb] flex items-center px-[1rem] shadow-sm"
              >
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    if (status) setStatus(null);
                  }}
                  placeholder="Check your pincode"
                  className="w-full bg-transparent font-['Hanken_Grotesk',sans-serif] text-[0.875rem] font-normal leading-[1.05rem] text-[#252422] placeholder:text-[#7b7d80] outline-none border-none p-0"
                  aria-label="Pincode"
                />
              </div>

              {/* Button (Figma Node 211:5563) */}
              <button
                type="submit"
                data-node-id="211:5563"
                className="h-[3.25rem] pl-[1.5rem] pr-[1.25rem] py-[0.75rem] bg-[#6f1d1b] hover:bg-[#5a1716] active:bg-[#481211] font-['Hanken_Grotesk',sans-serif] text-[0.875rem] font-bold leading-[1.75rem] tracking-[-0.0175rem] text-white rounded-[0.5rem] flex items-center justify-center gap-[0.5rem] transition-colors whitespace-nowrap cursor-pointer shadow-sm border-none"
              >
                Check
              </button>
            </form>

            {status && (
              <p
                role="status"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                className={`text-sm -mt-2 px-3 py-1.5 rounded ${
                  status.serviceable ? 'text-emerald-300 bg-emerald-950/50' : 'text-amber-200 bg-amber-950/50'
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const WhereWeBuildSection: React.FC = () => {
  return (
    <div id="where-we-build" className="w-full px-5 sm:px-12 md:px-[96px] lg:px-[6rem]">
      <WhereWeBuildCard />
    </div>
  );
};

export default WhereWeBuildCard;
