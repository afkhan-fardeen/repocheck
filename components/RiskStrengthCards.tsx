import { HiExclamationTriangle, HiCheckCircle } from 'react-icons/hi2'

interface RiskStrengthCardsProps {
  risks: string[]
  strengths: string[]
}

export default function RiskStrengthCards({ risks, strengths }: RiskStrengthCardsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Risks */}
      <div className="rounded-xl border-2 border-danger/20 dark:border-danger/30 bg-danger/5 dark:bg-danger/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiExclamationTriangle className="w-5 h-5 text-danger" />
          <h3 className="text-lg font-bold text-text-primary dark:text-[#E5E7EB]">
            Primary Risks
          </h3>
        </div>
        {risks.length > 0 ? (
          <ul className="space-y-3">
            {risks.map((risk, index) => (
              <li key={index} className="flex items-start gap-3 text-text-primary dark:text-[#E5E7EB]">
                <span className="text-danger mt-1 flex-shrink-0">•</span>
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted dark:text-[#9CA3AF] text-sm">
            No significant risks identified.
          </p>
        )}
      </div>

      {/* Strengths */}
      <div className="rounded-xl border-2 border-success/20 dark:border-success/30 bg-success/5 dark:bg-success/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiCheckCircle className="w-5 h-5 text-success" />
          <h3 className="text-lg font-bold text-text-primary dark:text-[#E5E7EB]">
            Strengths
          </h3>
        </div>
        {strengths.length > 0 ? (
          <ul className="space-y-3">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3 text-text-primary dark:text-[#E5E7EB]">
                <span className="text-success mt-1 flex-shrink-0">•</span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted dark:text-[#9CA3AF] text-sm">
            No significant strengths identified.
          </p>
        )}
      </div>
    </div>
  )
}
