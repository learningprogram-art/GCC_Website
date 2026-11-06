import {
  NavbarSection,
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
  FooterSection,
} from './sections'

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Navbar */}
      <NavbarSection />

      {/* 2. Hero */}
      <HeroSection />

      {/* 3. One Team, Not 12 */}
      <OneTeamSection />

      {/* 4. Structures We Build */}
      <StructuresWeBuildSection />

      {/* 5. About & Stats */}
      <AboutStatsSection />

      {/* 6. Why GCC */}
      <WhyGccSection />

      {/* 7. How We Build */}
      <HowWeBuildSection />

      {/* 8. Cost Calculator */}
      <CostCalculatorSection />

      {/* 9. Transparency */}
      <TransparencySection />

      {/* 10. Our Purpose */}
      <OurPurposeSection />

      {/* 11. GCC AMC Portal Access */}
      <PortalAccessSection />

      {/* 12. Testimonials */}
      <TestimonialsSection />

      {/* 13. Contact / Journey CTA */}
      <ContactCtaSection />

      {/* 14. Footer */}
      <FooterSection />
    </div>
  )
}

export default HomePage
