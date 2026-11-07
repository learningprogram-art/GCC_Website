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
} from './sections'
import { TestimonialsSection } from '@/components/common/TestimonialsSection'
import { ContactSection } from '@/components/common/ContactSection'

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#252422] text-[#FFFCF2]">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. One Team, Not 10 */}
      <OneTeamSection />

      {/* 3. Structures We Build */}
      <StructuresWeBuildSection />

      {/* 4. About & Stats */}
      <AboutStatsSection />

      {/* 5. Why GCC */}
      <WhyGccSection />

      {/* Cream wrapper for How We Build & Cost Calculator eliminates any subpixel seam */}
      <div className="w-full bg-[#FFFCF2]">
        {/* 6. How We Build */}
        <HowWeBuildSection />

        {/* 7. Cost Calculator */}
        <CostCalculatorSection />
      </div>

      {/* 8. Transparency */}
      <TransparencySection />

      {/* 9. Where We Build & Our Purpose */}
      <OurPurposeSection />

      {/* 11. GCC AMC Portal Access */}
      <PortalAccessSection />

      {/* 12. Testimonials */}
      <TestimonialsSection />

      {/* 13. Contact / Journey CTA */}
      <ContactSection />
    </div>
  )
}

export default HomePage
