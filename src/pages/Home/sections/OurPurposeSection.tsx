import React, { useEffect, useRef, useState } from 'react';
import { WhereWeBuildCard } from './WhereWeBuildSection';
import { useInViewOnce } from '@/hooks/useInViewOnce';

export const OurPurposeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [purposeRef, purposeIn] = useInViewOnce<HTMLDivElement>(0.2);
  const animationFrameRef = useRef<number | null>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only start moving when the user arrives at the section
      const triggerPoint = windowHeight * 0.5; // Halfway in viewport

if (rect.bottom >= 0 && rect.top <= triggerPoint) {
  const scrolledDistance = triggerPoint - rect.top;
  const PARALLAX_SPEED = 0.4;
  setParallaxY(scrolledDistance * PARALLAX_SPEED);
} else if (rect.top > triggerPoint) {
  setParallaxY(0);
}
    };

    const onScroll = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
      className="relative w-full self-stretch min-h-[920px] lg:h-[1112px] lg:min-h-[1112px] flex flex-col justify-start"
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

        {/* Ghost / GCC mark (Figma Node 211:5364: w=1268.027px, h=562.132px, with 60fps parallax effect) */}
        <div
          data-node-id="211:5364"
          className="absolute left-[48%] sm:left-[51%] lg:left-[calc(50%+20px)] min-[1440px]:left-[calc(50%+40px)] xl:left-[calc(50%+30px)] top-[166px] lg:top-[160px] pointer-events-none select-none transition-transform duration-75 ease-out"
          style={{
            width: '1268.027px',
            height: '562.132px',
            transform: `translate3d(0, ${parallaxY}px, 0)`,
            willChange: 'transform',
          }}
        >
          <img
            src="/assets/images/gcc-mark-purpose.svg"
            alt=""
            style={{
              width: '1268.027px',
              height: '562.132px',
            }}
            className="max-w-none object-contain object-left pointer-events-none select-none"
          />
        </div>
      </div>

      {/* 
        Where We Build Card (Figma Node 211:5553):
        Positioned at the top with negative margin -mt-[70px].
        Extends UP 70px on top of the yellowish Transparency background (#FFE6A7) completely unclipped!
      */}
      <div
        id="where-we-build"
        className="relative z-30 -mt-[20px] sm:-mt-[35px] lg:-mt-[40px] w-full px-6 sm:px-12 md:px-[96px] lg:px-[6rem]"
      >
        <WhereWeBuildCard />
      </div>

      {/* 
        Purpose Content Block (Figma Node 211:5376):
        width: 1040px;
        height: 249px;
        display: inline-flex / flex;
        flex-direction: column;
        align-items: center;
        gap: 32px;
      */}
      <div
        ref={purposeRef}
        id="our-purpose"
        data-node-id="211:5376"
        style={{
          width: '100%',
          maxWidth: '1040px',
        }}
        className={`relative z-20 mx-auto px-4 min-[1080px]:px-0 flex flex-col items-center gap-[32px] text-center mt-20 sm:mt-28 lg:mt-[215px] pb-12 sm:pb-16 lg:pb-[110px] transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          purposeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Eyebrow (Figma Node 211:5377) */}
        <div
          data-node-id="211:5377"
          className="flex items-center gap-[12px] overflow-hidden shrink-0"
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

        {/* Statement (Figma Node 211:5381: width: 1040px, height: 201px, font-size: 60px) */}
        <h2
          data-node-id="211:5381"
          style={{
            fontFamily: '"Bai Jamjuree", sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(26px, 4.16vw, 60px)',
            lineHeight: '112%',
            letterSpacing: '-0.9px',
            color: '#FFFCF2',
            width: '100%',
            maxWidth: '1040px',
          }}
          className="m-0 text-center min-[1080px]:w-[1040px] min-[1080px]:h-[201px]"
        >
          <span>GCC exists to bring </span>
          <span style={{ color: '#FFE6A7' }}>clarity and</span>
          <br className="hidden min-[1080px]:inline" />{' '}
          <span style={{ color: '#FFE6A7' }}>confidence</span>
          <span> to how spaces are</span>
          <br className="hidden min-[1080px]:inline" />{' '}
          <span>imagined, engineered and built.</span>
        </h2>
      </div>
    </section>
  );
};

export default OurPurposeSection;
