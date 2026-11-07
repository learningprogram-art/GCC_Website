const bai = { fontFamily: '"Bai Jamjuree", sans-serif' }
const hanken = { fontFamily: '"Hanken Grotesk", sans-serif' }

const VALUES = [
  {
    number: '01',
    title: 'Engineering Rigor',
    desc: 'No shortcuts on rebar gauge, concrete grade, curing periods, or structural foundations. We calculate every beam and column to last generations.',
  },
  {
    number: '02',
    title: 'Uncompromised Transparency',
    desc: 'Zero hidden surprise bills or unannounced change orders. You track materials, stage approvals, and milestones in real time on our digital portal.',
  },
  {
    number: '03',
    title: 'Single-Source Ownership',
    desc: 'Architects, civil engineers, MEP consultants, and supervisors united in one team. We take full accountability from initial sketch to final key handover.',
  },
  {
    number: '04',
    title: 'Milestone Punctuality',
    desc: 'Every phase is governed by strict project management workflows. Over 96% of our homes are delivered on or before the contractually agreed date.',
  },
]

export function PreviousExperiences() {
  return (
    <section
      id="about-values"
      className="bg-[#252422] text-[#FFFCF2] px-6 md:px-12 lg:px-24 py-20 lg:py-28 border-t border-[#403D39]"
    >
      <div className="mx-auto max-w-[1252px] flex flex-col gap-12 lg:gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2 bg-[#E06422]" />
            <p
              style={hanken}
              className="text-xs font-semibold uppercase tracking-[0.96px] text-[#FFE6A7]"
            >
              Our Core Principles
            </p>
          </div>

          <h2
            style={bai}
            className="text-[28px] sm:text-[38px] lg:text-[46px] font-bold uppercase leading-[1.15] text-[#FFFCF2]"
          >
            Principles that guide every blueprint and brick.
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((val) => (
            <div
              key={val.number}
              className="flex flex-col justify-between p-6 rounded-xl bg-[#403D39]/30 border border-[#CCC5B9]/15 hover:border-[#CCC5B9]/30 transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                <span
                  style={bai}
                  className="text-2xl font-bold text-[#E06422]"
                >
                  {val.number}
                </span>
                <h3
                  style={bai}
                  className="text-xl font-semibold text-[#FFFCF2]"
                >
                  {val.title}
                </h3>
                <p
                  style={hanken}
                  className="text-sm leading-6 text-[#CCC5B9]"
                >
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PreviousExperiences
