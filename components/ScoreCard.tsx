interface ScoreCardProps {
  score: number
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk'
}

export default function ScoreCard({ score, riskLevel }: ScoreCardProps) {
  const getRiskColor = () => {
    if (riskLevel === 'Low Risk') return 'bg-success/20 dark:bg-success/20 text-success border-success/30'
    if (riskLevel === 'Moderate Risk') return 'bg-warning/20 dark:bg-warning/20 text-warning border-warning/30'
    return 'bg-danger/20 dark:bg-danger/20 text-danger border-danger/30'
  }

  const getRiskDescription = () => {
    if (riskLevel === 'Low Risk') {
      return 'This repository is well-maintained and ready for use.'
    }
    if (riskLevel === 'Moderate Risk') {
      return 'This repo is usable but has some risks to consider.'
    }
    return 'This repository requires significant attention before reliable use.'
  }

  const getScoreColor = () => {
    if (score >= 80) return 'text-success'
    if (score >= 50) return 'text-warning'
    return 'text-danger'
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-border dark:border-[#1F2937] bg-gradient-to-br from-surface dark:from-[#111418] to-surface/50 dark:to-[#111418]/50 p-8 mb-8 shadow-xl">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-text-muted dark:text-[#9CA3AF] uppercase tracking-wide mb-2">
              Overall Health Score
            </p>
            <div className="flex items-baseline gap-3">
              <span className={`text-6xl md:text-7xl font-black ${getScoreColor()}`}>
                {score}
              </span>
              <span className="text-2xl text-text-muted dark:text-[#9CA3AF]">/ 100</span>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-xl border ${getRiskColor()} font-semibold text-center sm:text-left`}>
            {riskLevel}
          </div>
        </div>
        <p className="text-lg text-text-primary dark:text-[#E5E7EB] leading-relaxed">
          {getRiskDescription()}
        </p>
      </div>
    </div>
  )
}
