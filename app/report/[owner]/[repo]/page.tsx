import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCachedReport, setCachedReport } from '@/lib/cache'
import { analyzeRepository } from '@/lib/analyzer-optimized'
import { isAnalysisInProgress } from '@/lib/queue'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { 
  HiCodeBracket, 
  HiStar, 
  HiArrowTopRightOnSquare, 
  HiExclamationTriangle, 
  HiCheckCircle,
  HiChartBar,
  HiBriefcase,
  HiArrowLeft
} from 'react-icons/hi2'
import { 
  HiUsers, 
  HiArrowPath, 
  HiCube, 
  HiDocumentText, 
  HiShieldCheck 
} from 'react-icons/hi2'

interface PageProps {
  params: {
    owner: string
    repo: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { owner, repo } = params
  return {
    title: `${owner}/${repo} - Repository Health Report | RepoCheck`,
    description: `Health report for ${owner}/${repo}. View risks, strengths, and maintainability score.`,
  }
}

export default async function ReportPage({ params }: PageProps) {
  const { owner, repo } = params

  // Check cache first (core principle: repo-specific, not user-specific)
  let report = getCachedReport(owner, repo)

  // If not cached and not in progress, redirect to trigger analysis via API
  if (!report && !isAnalysisInProgress(owner, repo)) {
    // This should trigger via the API route, not directly
    // For now, we'll analyze but in production this should go through queue
    try {
      report = await analyzeRepository(owner, repo)
      if (report) {
        setCachedReport(owner, repo, report)
      }
    } catch (error: any) {
      if (error.status === 404) {
        notFound()
      }
      throw error
    }
  }

  if (!report) {
    // Show loading state if analysis is in progress
    // In production, this would poll or use websockets
    notFound()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50'
    if (score >= 50) return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50'
    return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
  }

  const getRiskBadgeColor = () => {
    if (report.riskLevel === 'Low Risk') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800'
    if (report.riskLevel === 'Moderate Risk') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800'
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                {report.repoMetadata?.name || `${owner}/${repo}`}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {report.repoMetadata?.language && (
                  <span className="flex items-center gap-1">
                    <HiCodeBracket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {report.repoMetadata.language}
                  </span>
                )}
                {report.repoMetadata?.stars !== undefined && (
                  <span className="flex items-center gap-1">
                    <HiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {report.repoMetadata.stars.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              <HiArrowTopRightOnSquare className="w-4 h-4" />
              <span className="hidden sm:inline">View on GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </Link>
          </div>
          {report.repoMetadata?.description && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">{report.repoMetadata.description}</p>
          )}
        </div>

        {/* Score Card */}
        <div className={`rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border-2 ${getScoreBg(report.score)}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Health Score
            </h2>
            <span className={`w-fit px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getRiskBadgeColor()}`}>
              {report.riskLevel}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-5xl sm:text-6xl md:text-7xl font-bold ${getScoreColor(report.score)}`}>
              {report.score}
            </span>
            <span className="text-2xl sm:text-3xl text-gray-500 dark:text-gray-500">/ 100</span>
          </div>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            {report.riskLevel === 'Low Risk' && 'This repository is well-maintained and ready for production use.'}
            {report.riskLevel === 'Moderate Risk' && 'This repository is usable but has some concerns to address.'}
            {report.riskLevel === 'High Risk' && 'This repository needs significant work before production use.'}
          </p>
        </div>

        {/* Risks & Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {report.risks.length > 0 && (
            <div className="rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 sm:p-6">
              <h3 className="font-semibold text-red-900 dark:text-red-400 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                <HiExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                Risks
              </h3>
              <ul className="space-y-2">
                {report.risks.map((risk, i) => (
                  <li key={i} className="text-xs sm:text-sm text-red-800 dark:text-red-300">
                    • {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {report.strengths.length > 0 && (
            <div className="rounded-xl border-2 border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20 p-4 sm:p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-400 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {report.strengths.map((strength, i) => (
                  <li key={i} className="text-xs sm:text-sm text-green-800 dark:text-green-300">
                    • {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
            <HiChartBar className="w-4 h-4 sm:w-5 sm:h-5" />
            Score Breakdown
          </h3>
          <div className="space-y-4 sm:space-y-5">
            {[
              { key: 'busFactor', label: 'Bus Factor', desc: 'Contributor distribution', icon: HiUsers },
              { key: 'maintenance', label: 'Maintenance', desc: 'Activity consistency', icon: HiArrowPath },
              { key: 'dependencies', label: 'Dependencies', desc: 'Package health', icon: HiCube },
              { key: 'opsReadiness', label: 'Documentation', desc: 'Setup & docs', icon: HiDocumentText },
              { key: 'ownership', label: 'Ownership', desc: 'Clear responsibility', icon: HiShieldCheck },
            ].map(({ key, label, desc, icon: Icon }) => {
              const score = report.breakdown[key as keyof typeof report.breakdown]
              const percentage = (score / 20) * 100
              const color = percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              
              return (
                <div key={key}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 ml-2 hidden sm:inline">({desc})</span>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 sm:ml-auto">
                      {score}/20
                    </span>
                  </div>
                  <div className="h-2 sm:h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${color} transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Takeover Readiness */}
        <div className="rounded-xl border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
            <HiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            Takeover Readiness
          </h3>
          <p className="text-sm sm:text-base text-blue-800 dark:text-blue-300 leading-relaxed">
            {report.takeoverReadiness}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="flex-1 text-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Check Another Repo</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <Link
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
          >
            <span className="hidden sm:inline">View on GitHub</span>
            <span className="sm:hidden">GitHub</span>
            <HiArrowTopRightOnSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
