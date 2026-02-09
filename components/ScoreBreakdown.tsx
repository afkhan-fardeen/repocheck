'use client'

import { useState } from 'react'
import { ScoreBreakdown } from '@/types/report'

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown
}

const scoreLabels: Record<keyof ScoreBreakdown, { label: string; description: string }> = {
  busFactor: {
    label: 'Bus Factor',
    description: 'Risk of single-person dependency. Higher score means more distributed contributors.',
  },
  maintenance: {
    label: 'Maintenance',
    description: 'How actively and consistently the repository is maintained.',
  },
  dependencies: {
    label: 'Dependencies',
    description: 'Health of external dependencies and technical debt risk.',
  },
  opsReadiness: {
    label: 'Operational Readiness',
    description: 'How easy it is for someone new to set up and run this project.',
  },
  ownership: {
    label: 'Ownership Clarity',
    description: 'How clear the ownership structure and review process is.',
  },
}

export default function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<keyof ScoreBreakdown | null>(null)

  const items = Object.entries(breakdown).map(([key, score]) => ({
    key: key as keyof ScoreBreakdown,
    score,
    max: 20,
    ...scoreLabels[key as keyof ScoreBreakdown],
  }))

  return (
    <div className="rounded-xl border border-border dark:border-[#1F2937] bg-surface dark:bg-[#111418] p-6 mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div>
          <h3 className="text-lg font-bold text-text-primary dark:text-[#E5E7EB] mb-1">
            Detailed Score Breakdown
          </h3>
          <p className="text-sm text-text-muted dark:text-[#9CA3AF]">
            Click to {isExpanded ? 'collapse' : 'expand'} individual scores
          </p>
        </div>
        <span className="material-symbols-outlined text-text-muted dark:text-[#9CA3AF] group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6 pt-6 border-t border-border dark:border-[#1F2937]">
          {items.map((item) => {
            const percentage = (item.score / item.max) * 100
            const getColor = () => {
              if (percentage >= 75) return 'bg-success'
              if (percentage >= 50) return 'bg-warning'
              return 'bg-danger'
            }

            const isHovered = hoveredItem === item.key

            return (
              <div
                key={item.key}
                className="space-y-2"
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-semibold text-text-primary dark:text-[#E5E7EB]">
                        {item.label}
                      </span>
                      <span className="text-sm text-text-muted dark:text-[#9CA3AF]">
                        {item.score} / {item.max}
                      </span>
                    </div>
                    {isHovered && (
                      <p className="text-xs text-text-muted dark:text-[#9CA3AF] mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="h-3 bg-border dark:bg-border-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getColor()} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
