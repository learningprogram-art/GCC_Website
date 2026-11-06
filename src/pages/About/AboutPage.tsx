import {
  NavbarSection,
  AboutHeroSection,
  AboutStorySection,
  PreviousExperiences,
} from './sections'

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <NavbarSection />

      <AboutHeroSection />

      <AboutStorySection />

      <PreviousExperiences />
    </div>
  )
}

export default AboutPage

