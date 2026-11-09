import React, { useEffect, useRef } from 'react';
import { WhereWeBuildCard } from './WhereWeBuildSection';
import { useInViewOnce } from '@/hooks/useInViewOnce';

export const OurPurposeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostMarkRef = useRef<HTMLDivElement>(null);
  const [purposeRef, purposeIn] = useInViewOnce<HTMLDivElement>(0.2);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current || !ghostMarkRef.current) {
        ticking = false;
        return;
      }
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start the parallax effect as soon as the "Where We Build" card enters the viewport
      const isMobile = window.innerWidth < 640;
      const cardOffset = isMobile ? 360 : 60;
      const triggerPoint = windowHeight + cardOffset;

      if (rect.bottom >= 0 && rect.top <= triggerPoint) {
        const scrolledDistance = triggerPoint - rect.top;
        const PARALLAX_SPEED = isMobile ? 0.30 : 0.31;
        const y = scrolledDistance * PARALLAX_SPEED;
        ghostMarkRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      } else if (rect.top > triggerPoint) {
        ghostMarkRef.current.style.transform = 'translate3d(0, 0px, 0)';
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      animationFrameRef.current = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-purpose-section"
      data-node-id="211:5359"
      className="relative w-full self-stretch min-h-[840px] sm:min-h-[920px] lg:h-[1112px] lg:min-h-[1112px] flex flex-col justify-start"
      style={{
        backgroundImage:
          'linear-gradient(123.65deg, #2A0A09 4.84%, #6F1D1B 32.26%, #E06422 61.29%, #FB8B24 85.48%)',
      }}
    >
      {/* 
        Decorative background glows & Ghost GCC mark container:
        ONLY this sub-container has overflow-hidden, so glows and logo stay clipped to the section
        without causing horizontal page scroll, WHILE the parent section allows the Where We Build
        card (-mt-[70px]) to extend UP seamlessly onto the yellowish Transparency background!
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {/* Glow / deep (top-left) - Figma Node 211:5360 */}
        <div
          className="absolute -top-[360px] -left-[380px] w-[1000px] h-[700px] rounded-full blur-[140px] opacity-80"
          style={{ background: 'radial-gradient(circle, #2A0A09 0%, transparent 70%)' }}
        />

        {/* Glow / maroon (centre) - Figma Node 211:5361 */}
        <div
          className="absolute top-[120px] left-[200px] w-[900px] h-[520px] rounded-full blur-[130px] opacity-60"
          style={{ background: 'radial-gradient(circle, #6F1D1B 0%, transparent 70%)' }}
        />

        {/* Glow / sand (bottom-right) - Figma Node 211:5362 (#FFE6A7 · 55%) */}
        <div
          data-node-id="211:5362"
          className="absolute top-[360px] lg:top-[390px] left-[45%] sm:left-[50%] lg:left-[calc(50%+40px)] min-[1440px]:left-[calc(50%+80px)] w-[700px] lg:w-[820px] h-[480px] lg:h-[520px] rounded-full pointer-events-none select-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255, 230, 167, 0.75) 0%, rgba(255, 230, 167, 0.55) 40%, rgba(255, 230, 167, 0.25) 65%, transparent 80%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Glow / orange (right) - Figma Node 211:5363 */}
        <div
          data-node-id="211:5363"
          className="absolute top-[120px] left-[1000px] min-[1440px]:left-[calc(50%+280px)] w-[600px] h-[420px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #E06422 0%, transparent 70%)' }}
        />

        {/* Ghost / GCC mark (Figma Node 211:5364 Desktop & 199:3355 Mobile) */}
        <div
          ref={ghostMarkRef}
          data-node-id="211:5364"
          className="absolute left-[52px] sm:left-[51%] lg:left-[calc(50%+20px)] min-[1440px]:left-[calc(50%+40px)] xl:left-[calc(50%+30px)] top-[180px] sm:top-[120px] lg:top-[110px] w-[676.72px] sm:w-[1268.027px] h-[300px] sm:h-[562.132px] pointer-events-none select-none"
          style={{
            transform: 'translate3d(0, 0px, 0)',
            willChange: 'transform',
          }}
        >
          <img
            src="/assets/images/gcc-mark-purpose.svg"
            alt=""
            className="w-full h-full object-contain object-left pointer-events-none select-none max-w-none"
          />
        </div>
      </div>

      {/* 
        Where We Build Card (Figma Node 211:5553 & 203:3977):
        Mobile: pulled UP 250px onto yellowish Transparency background (#FFE6A7),
        leaving 80px gap from the Book a Consultation button and exactly 250px yellow overlap per Figma Node 196:3203.
      */}
      <div
        id="where-we-build"
        className="relative z-30 -mt-[250px] sm:-mt-[35px] lg:-mt-[40px] w-full px-5 sm:px-12 lg:px-[96px]"
      >
        <WhereWeBuildCard />
      </div>

      {/* 
        Purpose Content Block (Figma Node 211:5376 Desktop & 203:3975 Mobile):
        width: 342px (mobile) / 1040px (desktop);
        gap: 24px (mobile) / 32px (desktop);
      */}
      <div
        ref={purposeRef}
        id="our-purpose"
        data-node-id="211:5376"
        className={`relative z-20 mx-auto px-6 sm:px-4 min-[1080px]:px-0 flex flex-col items-center gap-[24px] lg:gap-[32px] text-center mt-[96px] sm:mt-28 lg:mt-[215px] pb-12 sm:pb-16 lg:pb-[110px] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${purposeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
      >
        {/* Eyebrow (Figma Node 211:5377 & 199:3367) */}
        <div
          data-node-id="211:5377"
          className="flex items-center gap-[10px] sm:gap-[12px] overflow-hidden shrink-0"
        >
          <div
            data-node-id="211:5378"
            className="size-[6px] bg-[#fb8b24] shrink-0"
            aria-hidden="true"
          />
          <p
            data-node-id="211:5379"
            style={{
              fontFamily: '"Hanken Grotesk", sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              letterSpacing: '0.96px',
            }}
            className="m-0 text-[#ffe6a7] uppercase whitespace-nowrap"
          >
            Our purpose
          </p>
          <div
            data-node-id="211:5380"
            className="size-[6px] bg-[#fb8b24] shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* Statement (Figma Node 211:5381 Desktop & 199:3371 Mobile) */}
        <h2
          data-node-id="211:5381"
          style={{
            fontFamily: '"Bai Jamjuree", sans-serif',
          }}
          className="m-0 text-center font-medium text-[32px] sm:text-[clamp(32px,3.8vw,48px)] min-[1080px]:text-[60px] leading-[1.18] min-[1080px]:leading-[1.12] tracking-[-0.32px] min-[1080px]:tracking-[-0.9px] text-[#FFFCF2] w-full max-w-[342px] sm:max-w-[650px] min-[1080px]:max-w-[1040px]"
        >
          <span>GCC exists to bring </span>
          <br className="block sm:hidden" />
          <span className="text-[#FFE6A7]">clarity and</span>{' '}
          <br className="hidden min-[1080px]:inline" />
          <span className="text-[#FFE6A7]">confidence</span>
          <span> to how spaces are</span>
          <br className="block sm:hidden" />
          <br className="hidden min-[1080px]:inline" />{' '}
          <span>imagined, engineered </span>
          <br className="block sm:hidden" />
          <span>and built.</span>
        </h2>
      </div>
    </section>
  );
};

export default OurPurposeSection;
