import { useState, useId, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

type ProjectType = 'villa' | 'farmhouse' | 'floors'
type PackageTier = 'standard' | 'premium' | 'luxury'

interface PackageOption {
  id: PackageTier
  name: string
  ratePerSqFt: number
  description: string
}

const PACKAGES: Record<PackageTier, PackageOption> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    ratePerSqFt: 1950,
    description: 'High-grade RCC, vitrified tiles & branded sanitary fittings',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    ratePerSqFt: 2450,
    description: 'Italian marble, engineered wood & premium Kohler / Grohe fittings',
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    ratePerSqFt: 3200,
    description: 'Bespoke architectural finishes, VRV HVAC & smart home automation',
  },
}

const PROJECT_TYPE_MODIFIERS: Record<ProjectType, { label: string; multiplier: number }> = {
  villa: { label: 'Villa', multiplier: 1.0 },
  farmhouse: { label: 'Farmhouse', multiplier: 1.08 },
  floors: { label: 'Independent Floor', multiplier: 0.95 },
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function CostCalculatorSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectType, setProjectType] = useState<ProjectType>('villa')
  const [area, setArea] = useState<number>(3200)
  const [floors, setFloors] = useState<number>(2)
  const [tier, setTier] = useState<PackageTier>('premium')

  const areaInputId = useId()

  // Base rate calculation
  const currentPackage = PACKAGES[tier]
  const typeMod = PROJECT_TYPE_MODIFIERS[projectType].multiplier
  const floorMultiplier = 1 + (floors - 1) * 0.04
  const estimatedRatePerSqFt = Math.round(currentPackage.ratePerSqFt * typeMod * floorMultiplier)
  const totalEstimate = area * estimatedRatePerSqFt
  const estimatedMonths = Math.max(8, Math.round(area / 320) + (floors > 2 ? 2 : 0))

  // Close modal on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
      }
    },
    [isModalOpen]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <section
      id="cost-calculator"
      data-node-id="211:6073"
      aria-label="Home Construction Cost Estimator"
      className="relative w-full bg-[#FFFCF2] py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-[96px]"
    >
      <div className="mx-auto max-w-[1248px] w-full">
        {/* Banner Container: Figma Node 211:6073 (1248px x 160px, rounded-[12px], bg-[#701E1C], pl-[12px] pr-[30px] py-[12px]) */}
        <div className="relative w-full min-h-[160px] rounded-[12px] bg-[#701E1C] overflow-hidden flex flex-col md:flex-row items-center justify-between py-[12px] pl-[12px] pr-4 sm:pr-[30px] gap-6 md:gap-[30px] shadow-md">
          {/* Decorative geometric circle arc pattern (calculator-design.png aligned to right edge) */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full select-none overflow-hidden"
            aria-hidden="true"
          >
            <img
              src="/assets/images/how-we-build/calculator-design.png"
              alt=""
              className="h-full w-auto max-w-none object-cover object-right"
              loading="lazy"
            />
          </div>

          {/* Left / Content cluster */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-[30px] w-full md:w-auto">
            {/* Left Preview Image Card (Figma Node 213:6077: 206px x 136px, rounded-[12px]) */}
            <div className="relative w-[206px] h-[136px] rounded-[12px] overflow-hidden shrink-0 bg-[#E1DCDC] shadow-inner">
              <img
                src="/assets/images/how-we-build/calculator-img.png"
                alt="Home Construction Cost Preview"
                className="w-full h-full object-cover object-left block select-none pointer-events-none"
                loading="lazy"
              />
            </div>

            {/* Headline Title (Figma Node 211:6065: Bai Jamjuree SemiBold 36px/44px, text-white) */}
            <h3
              style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
              className="text-white text-[24px] sm:text-[30px] lg:text-[36px] font-semibold leading-[1.2] lg:leading-[44px] tracking-[-0.36px] text-center sm:text-left shrink-0 max-w-[340px]"
            >
              Home Construction <br className="hidden sm:inline" />
              Estimator
            </h3>
          </div>

          {/* Right Action Button (Figma Node 211:6066: Button on-dark, 226px x 56px, rounded-[8px]) */}
          <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end shrink-0">
            <Button
              variant="on-dark"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-[226px] h-[52px] sm:h-[56px] text-[18px] font-bold rounded-[8px] tracking-[-0.36px] shadow-sm cursor-pointer"
            >
              Calculate now
            </Button>
          </div>
        </div>
      </div>

      {/* Cost Calculator Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="calculator-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-[16px] bg-[#FFFCF2] text-[#252422] p-6 sm:p-8 shadow-2xl border border-[#CCC5B9]/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#CCC5B9]/40">
              <div>
                <span
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                  className="text-[12px] font-semibold uppercase tracking-[0.96px] text-[#6F1D1B]"
                >
                  Quick Estimate
                </span>
                <h4
                  id="calculator-modal-title"
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                  className="text-[26px] sm:text-[30px] font-bold text-[#252422] leading-tight mt-1"
                >
                  Construction Cost Estimator
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close calculator modal"
                className="size-10 rounded-full flex items-center justify-center text-[#403D39] hover:bg-[#CCC5B9]/30 transition-colors cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Controls */}
            <div className="flex flex-col gap-6 py-6">
              {/* 1. Project Type Selector */}
              <div>
                <label className="block text-[14px] font-semibold text-[#403D39] mb-2 font-['Hanken_Grotesk',sans-serif]">
                  Structure Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PROJECT_TYPE_MODIFIERS) as ProjectType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProjectType(type)}
                      className={cn(
                        'py-2.5 px-3 rounded-[8px] text-[14px] font-semibold border transition-all cursor-pointer font-[\'Hanken_Grotesk\',sans-serif]',
                        projectType === type
                          ? 'bg-[#6F1D1B] text-white border-[#6F1D1B] shadow-sm'
                          : 'bg-white text-[#403D39] border-[#CCC5B9]/70 hover:border-[#6F1D1B]/50'
                      )}
                    >
                      {PROJECT_TYPE_MODIFIERS[type].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Built-up Area Slider + Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor={areaInputId} className="text-[14px] font-semibold text-[#403D39] font-['Hanken_Grotesk',sans-serif]">
                    Built-up Area (sq. ft.)
                  </label>
                  <div className="flex items-center gap-1.5 font-['Bai_Jamjuree',sans-serif] font-bold text-[18px] text-[#6F1D1B]">
                    <span>{area.toLocaleString('en-IN')}</span>
                    <span className="text-[13px] font-normal text-[#403D39]">sq ft</span>
                  </div>
                </div>
                <input
                  id={areaInputId}
                  type="range"
                  min="800"
                  max="12000"
                  step="100"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full accent-[#6F1D1B] h-2 bg-[#CCC5B9]/40 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#403D39]/70 mt-1 font-['Hanken_Grotesk',sans-serif]">
                  <span>800 sq ft</span>
                  <span>5,000 sq ft</span>
                  <span>12,000 sq ft</span>
                </div>
              </div>

              {/* 3. Number of Floors */}
              <div>
                <label className="block text-[14px] font-semibold text-[#403D39] mb-2 font-['Hanken_Grotesk',sans-serif]">
                  Number of Floors
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFloors(f)}
                      className={cn(
                        'flex-1 py-2 rounded-[8px] text-[14px] font-semibold border transition-all cursor-pointer font-[\'Hanken_Grotesk\',sans-serif]',
                        floors === f
                          ? 'bg-[#252422] text-[#FFFCF2] border-[#252422]'
                          : 'bg-white text-[#403D39] border-[#CCC5B9]/70 hover:border-[#252422]/50'
                      )}
                    >
                      {f === 1 ? 'Ground' : `G+${f - 1}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Specification Tier */}
              <div>
                <label className="block text-[14px] font-semibold text-[#403D39] mb-2 font-['Hanken_Grotesk',sans-serif]">
                  Finishing & Material Specification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(PACKAGES) as PackageTier[]).map((pkgKey) => {
                    const pkg = PACKAGES[pkgKey]
                    const isSelected = tier === pkgKey
                    return (
                      <button
                        key={pkgKey}
                        type="button"
                        onClick={() => setTier(pkgKey)}
                        className={cn(
                          'p-3 rounded-[10px] text-left border transition-all cursor-pointer flex flex-col justify-between',
                          isSelected
                            ? 'bg-[#FFE6A7]/30 border-[#6F1D1B] ring-1 ring-[#6F1D1B]'
                            : 'bg-white border-[#CCC5B9]/70 hover:border-[#6F1D1B]/40'
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-[15px] text-[#252422]">
                              {pkg.name}
                            </span>
                            {isSelected && (
                              <span className="size-2 rounded-full bg-[#E06422]" aria-hidden />
                            )}
                          </div>
                          <p className="text-[11px] text-[#403D39] mt-1 leading-snug line-clamp-2">
                            {pkg.description}
                          </p>
                        </div>
                        <div className="font-['Bai_Jamjuree',sans-serif] font-semibold text-[13px] text-[#6F1D1B] mt-2">
                          ₹{pkg.ratePerSqFt.toLocaleString('en-IN')}/sq ft
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Estimate Calculation Result Card */}
              <div className="rounded-[12px] bg-[#252422] text-[#FFFCF2] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[12px] uppercase tracking-wider text-[#CCC5B9] font-['Hanken_Grotesk',sans-serif]">
                    Estimated Project Cost
                  </span>
                  <div
                    style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                    className="text-[28px] sm:text-[34px] font-bold text-[#FFFCF2] tracking-tight mt-0.5"
                  >
                    {formatINR(totalEstimate)}
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-[#CCC5B9] mt-1 font-['Hanken_Grotesk',sans-serif]">
                    <span>~₹{estimatedRatePerSqFt.toLocaleString('en-IN')} / sq ft</span>
                    <span>•</span>
                    <span>~{estimatedMonths} months delivery</span>
                  </div>
                </div>

                <a
                  href="#contact-cta"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-[8px] bg-[#E06422] hover:bg-[#d05718] text-white font-['Hanken_Grotesk',sans-serif] font-bold text-[15px] transition-colors shadow-sm"
                >
                  Get Detailed Quote
                </a>
              </div>
            </div>

            {/* Modal Footer Note */}
            <p className="text-[11px] text-[#403D39]/70 text-center font-['Hanken_Grotesk',sans-serif]">
              *Indicative estimate based on standard architectural assumptions. Exact budget finalized after site soil report and structural plan.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default CostCalculatorSection
