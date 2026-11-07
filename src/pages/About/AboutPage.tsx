import {
  AboutHeroSection,
  AboutStorySection,
  PreviousExperiences,
  VisitOfficeSection,
} from './sections'
import { TestimonialsSection } from '@/components/common/TestimonialsSection'
import { ContactSection } from '@/components/common/ContactSection'

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#252422] text-[#FFFCF2]">
      <AboutHeroSection />
      {/* Cream wrapper for Story & Previous Experiences eliminates any subpixel seam */}
      <div className="w-full bg-[#FFFCF2]">
        <AboutStorySection />
        <PreviousExperiences />
      </div>
      <VisitOfficeSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  )
}

export default AboutPage
