import {
  HeroSection,
  OneTeamSection,
  StructuresWeBuildSection,
  AboutStatsSection,
  WhyGccSection,
  HowWeBuildSection,
  CostCalculatorSection,
  TransparencySection,
  OurPurposeSection,
  PortalAccessSection,
  TestimonialsSection,
  ContactCtaSection,
} from './sections'

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. One Team, Not 12 */}
      <OneTeamSection />

      {/* 3. Structures We Build */}
      <StructuresWeBuildSection />

      {/* 4. About & Stats */}
      <AboutStatsSection />

      {/* 5. Why GCC */}
      <WhyGccSection />

      {/* 6. How We Build */}
      <HowWeBuildSection />

      {/* 7. Cost Calculator */}
      <CostCalculatorSection />

      {/* 8. Transparency */}
      <TransparencySection />

      {/* 9. Our Purpose */}
      <OurPurposeSection />

      {/* 10. GCC AMC Portal Access */}
      <PortalAccessSection />

      {/* 11. Testimonials */}
      <TestimonialsSection />

      {/* 12. Contact / Journey CTA */}
      <ContactCtaSection />
    </div>
  )
}

export default HomePage
