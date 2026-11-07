import {
  AboutHeroSection,
  AboutStorySection,
  PreviousExperiences,
} from './sections'
import { ContactSection } from '@/components/common/ContactSection'

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#252422] text-[#FFFCF2]">
      <AboutHeroSection />
      <AboutStorySection />
      <PreviousExperiences />
      <ContactSection />
    </div>
  )
}

export default AboutPage
