import React, { useEffect, useRef } from 'react';
import { WhereWeBuildCard } from './WhereWeBuildSection';
import { useInViewOnce } from '@/hooks/useInViewOnce';

export const OurPurposeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostMarkRef = useRef<HTMLDivElement>(null);
  const [purposeRef, purposeIn] = useInViewOnce<HTMLDivElement>(0.2);
  const animationFrameRef = useRef<number | null>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !ghostMarkRef.current) {
        tickingRef.current = false;
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
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
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
      className="our-purpose-sec relative w-full self-stretch flex flex-col justify-start"
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
          className="our-purpose-glow-sand absolute rounded-full pointer-events-none select-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255, 230, 167, 0.75) 0%, rgba(255, 230, 167, 0.55) 40%, rgba(255, 230, 167, 0.25) 65%, transparent 80%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Glow / orange (right) - Figma Node 211:5363 */}
        <div
          data-node-id="211:5363"
          className="our-purpose-glow-orange absolute top-[120px] w-[600px] h-[420px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #E06422 0%, transparent 70%)' }}
        />

        {/* Ghost / GCC mark (Figma Node 211:5364 Desktop & 199:3355 Mobile) */}
        <div
          ref={ghostMarkRef}
          data-node-id="211:5364"
          className="our-purpose-ghost absolute pointer-events-none select-none"
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
        className="our-purpose-card-slot relative z-30 w-full px-[1.25rem] sm:px-[3rem] lg:px-[6rem]"
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
        className={`our-purpose-content relative z-20 mx-auto w-full flex flex-col items-center text-center transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          purposeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Eyebrow (Figma Node 211:5377 & 199:3367) */}
        <div
          data-node-id="211:5377"
          className="our-purpose-eyebrow flex items-center overflow-hidden shrink-0"
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
          className="our-purpose-heading m-0 text-center font-medium antialiased text-[#FFFCF2] w-full"
        >
          <span>GCC exists to bring </span>
          <span className="text-[#FFE6A7]">
            clarity and
            <br className="our-purpose-br" /> confidence
          </span>
          <span>
            {' '}
            to how spaces are
            <br className="our-purpose-br" /> imagined, engineered and built.
          </span>
        </h2>
      </div>

      <style>{`
        .our-purpose-sec {
          min-height: 840px;
        }
        .our-purpose-glow-sand {
          top: 360px;
          left: 45%;
          width: 700px;
          height: 480px;
        }
        .our-purpose-glow-orange {
          left: 1000px;
        }
        .our-purpose-ghost {
          left: 52px;
          top: 180px;
          width: 676.72px;
          height: 300px;
        }
        .our-purpose-card-slot {
          margin-top: -250px;
        }
        .our-purpose-content {
          margin-top: 96px;
          padding: 0 24px 48px;
          gap: 24px;
        }
        .our-purpose-eyebrow {
          gap: 10px;
        }
        .our-purpose-heading {
          font-size: 32px;
          line-height: 1.18;
          letter-spacing: -0.32px;
          max-width: 342px;
        }
        .our-purpose-br {
          display: none;
        }

        @media (min-width: 640px) {
          .our-purpose-sec {
            min-height: 920px;
          }
          .our-purpose-glow-sand {
            left: 50%;
          }
          .our-purpose-ghost {
            left: 51%;
            top: 120px;
            width: 1268.027px;
            height: 562.132px;
          }
          .our-purpose-card-slot {
            margin-top: -35px;
          }
          .our-purpose-content {
            margin-top: 112px;
            padding: 0 16px 64px;
          }
          .our-purpose-eyebrow {
            gap: 12px;
          }
          .our-purpose-heading {
            font-size: clamp(36px, 4.5vw, 56px);
            line-height: 1.15;
            letter-spacing: -0.6px;
            max-width: 760px;
          }
        }

        @media (min-width: 1080px) {
          .our-purpose-sec {
            min-height: 1040px;
          }
          .our-purpose-card-slot {
            margin-top: -70px;
          }
          .our-purpose-content {
            margin-top: 122px;
            padding-left: 0;
            padding-right: 0;
            padding-bottom: 110px;
            gap: 32px;
          }
          .our-purpose-heading {
            font-size: 60px;
            line-height: 1.12;
            letter-spacing: -0.9px;
            max-width: 1040px;
          }
          .our-purpose-br {
            display: inline;
          }
        }

        @media (min-width: 1280px) {
          .our-purpose-sec {
            height: 1112px;
            min-height: 1112px;
          }
          .our-purpose-glow-sand {
            top: 390px;
            left: calc(50% + 40px);
            width: 820px;
            height: 520px;
          }
          .our-purpose-ghost {
            left: calc(50% + 30px);
            top: 110px;
          }
          .our-purpose-card-slot {
            margin-top: -70px;
          }
          .our-purpose-content {
            margin-top: 122px;
            padding-bottom: 0;
            gap: 32px;
          }
        }

        @media (min-width: 1440px) {
          .our-purpose-glow-sand {
            left: calc(50% + 80px);
          }
          .our-purpose-glow-orange {
            left: calc(50% + 280px);
          }
          .our-purpose-ghost {
            left: calc(50% + 40px);
          }
          .our-purpose-heading {
            font-size: clamp(60px, 4.16667vw, 80px);
            max-width: clamp(1040px, 72.2222vw, 1386px);
          }
        }
      `}</style>
    </section>
  );
};

export default OurPurposeSection;
