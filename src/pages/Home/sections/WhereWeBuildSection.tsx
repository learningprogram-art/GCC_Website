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
    <div
      ref={cardRef}
      data-node-id="211:5553"
      className={`max-w-[1248px] mx-auto relative rounded-[12px] overflow-hidden border border-white/30 min-h-[500px] lg:h-[600px] flex items-center justify-center shadow-2xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        cardIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/images/where-we-build.webp"
          alt="Where We Build - Noida, Delhi, Jewar Aerial Map"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Central Glass Card (Figma Node 211:5555) */}
      <div
        data-node-id="211:5555"
        className={`relative z-10 w-[calc(100%-2rem)] sm:w-[620.853px] max-w-[620.853px] rounded-[12px] px-6 py-8 sm:px-[72px] sm:py-[42px] flex flex-col items-center text-center transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          cardIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.40)',
          transitionDelay: cardIn ? '150ms' : '0ms',
        }}
      >
        <div data-node-id="211:5556" className="w-full flex flex-col items-center justify-center gap-[30px]">
          {/* Title & Description Block (Figma Node 211:5557) */}
          <div data-node-id="211:5557" className="w-full flex flex-col items-center gap-[16px] text-white">
            <h2
              data-node-id="211:5558"
              style={{
                fontFamily: '"Bai Jamjuree", sans-serif',
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '44px',
                letterSpacing: '-0.36px',
              }}
              className="m-0 text-white whitespace-nowrap text-[26px] sm:text-[36px]"
            >
              WHERE WE BUILD
            </h2>

            <div
              data-node-id="211:5559"
              style={{
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: 1.3,
              }}
              className="opacity-90 text-center w-full max-w-[476.853px] text-[15px] sm:text-[20px]"
            >
              <p className="m-0 leading-[1.3]">Your vision. Our expertise. Across locations.</p>
              <p className="m-0 leading-[1.3]">
                Focused on villa and farmhouse construction across{' '}
                <span className="font-bold text-white">Noida, Jewar and beyond.</span>
              </p>
            </div>
          </div>

          {/* Input + Button Form Row (Figma Node 211:5560) */}
          <form
            onSubmit={handleCheck}
            data-node-id="211:5560"
            className="flex flex-col sm:flex-row items-center justify-center gap-[12px] w-full sm:w-auto"
          >
            {/* Input (Figma Node 211:5561) */}
            <div
              data-node-id="211:5561"
              className="w-full sm:w-[191px] h-[52px] bg-white rounded-[7.171px] border border-[#e5e7eb] flex items-center px-[16px] shadow-sm"
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
                style={{
                  fontFamily: '"Hanken Grotesk", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '16.733px',
                }}
                className="w-full bg-transparent text-[#252422] placeholder:text-[#7b7d80] outline-none border-none p-0"
                aria-label="Pincode"
              />
            </div>

            {/* Button (Figma Node 211:5563) */}
            <button
              type="submit"
              data-node-id="211:5563"
              style={{
                fontFamily: '"Hanken Grotesk", sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: '28px',
                letterSpacing: '-0.28px',
              }}
              className="w-full sm:w-auto h-[52px] pl-[24px] pr-[20px] py-[12px] bg-[#6f1d1b] hover:bg-[#5a1716] active:bg-[#481211] text-white rounded-[8px] flex items-center justify-center gap-[8px] transition-colors whitespace-nowrap cursor-pointer shadow-sm border-none"
            >
              Check
            </button>
          </form>

          {status && (
            <p
              role="status"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              className={`text-xs sm:text-sm -mt-2 px-3 py-1.5 rounded ${
                status.serviceable ? 'text-emerald-300 bg-emerald-950/50' : 'text-amber-200 bg-amber-950/50'
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const WhereWeBuildSection: React.FC = () => {
  return (
    <div id="where-we-build" className="w-full">
      <WhereWeBuildCard />
    </div>
  );
};

export default WhereWeBuildCard;
