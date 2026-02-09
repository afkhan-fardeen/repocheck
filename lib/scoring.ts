import { ScoreBreakdown } from '@/types/report'

export function calculateBusFactorScore(topContributorPercent: number, hasSecondaryContributors: boolean): number {
  let score = 20

  // Penalize high single-contributor concentration
  if (topContributorPercent > 70) {
    score -= 12
  } else if (topContributorPercent > 50) {
    score -= 8
  } else if (topContributorPercent > 30) {
    score -= 4
  }

  // Penalize lack of secondary contributors
  if (!hasSecondaryContributors) {
    score -= 4
  }

  return Math.max(0, Math.min(20, score))
}

export function calculateMaintenanceScore(
  daysSinceLastCommit: number,
  commitConsistency: number,
  avgIssueResponseDays: number | null,
  avgPRMergeDays: number | null
): number {
  let score = 20

  // Time since last commit
  if (daysSinceLastCommit > 180) {
    score -= 10
  } else if (daysSinceLastCommit > 90) {
    score -= 6
  } else if (daysSinceLastCommit > 30) {
    score -= 3
  }

  // Commit consistency (0-1 scale)
  score -= (1 - commitConsistency) * 5

  // Issue response time
  if (avgIssueResponseDays !== null) {
    if (avgIssueResponseDays > 14) {
      score -= 3
    } else if (avgIssueResponseDays > 7) {
      score -= 1
    }
  } else {
    score -= 2 // No issues = no engagement signal
  }

  // PR merge time
  if (avgPRMergeDays !== null) {
    if (avgPRMergeDays > 7) {
      score -= 2
    }
  }

  return Math.max(0, Math.min(20, score))
}

export function calculateDependencyScore(
  dependencyCount: number,
  outdatedCount: number,
  abandonedCount: number
): number {
  let score = 20

  // Too many dependencies = complexity risk
  if (dependencyCount > 100) {
    score -= 4
  } else if (dependencyCount > 50) {
    score -= 2
  }

  // Outdated dependencies
  const outdatedRatio = dependencyCount > 0 ? outdatedCount / dependencyCount : 0
  if (outdatedRatio > 0.3) {
    score -= 6
  } else if (outdatedRatio > 0.15) {
    score -= 3
  }

  // Abandoned packages
  if (abandonedCount > 0) {
    score -= Math.min(6, abandonedCount * 2)
  }

  return Math.max(0, Math.min(20, score))
}

export function calculateOpsReadinessScore(
  hasReadme: boolean,
  hasSetupInstructions: boolean,
  hasCI: boolean,
  hasTests: boolean
): number {
  let score = 0

  if (hasReadme) score += 5
  if (hasSetupInstructions) score += 7
  if (hasCI) score += 5
  if (hasTests) score += 3

  return Math.min(20, score)
}

export function calculateOwnershipScore(
  hasCodeowners: boolean,
  hasMultipleReviewers: boolean,
  maintainerActivity: number
): number {
  let score = 0

  if (hasCodeowners) score += 8
  if (hasMultipleReviewers) score += 7
  score += Math.min(5, maintainerActivity)

  return Math.min(20, score)
}

export function getRiskLevel(totalScore: number): 'Low Risk' | 'Moderate Risk' | 'High Risk' {
  if (totalScore >= 80) return 'Low Risk'
  if (totalScore >= 50) return 'Moderate Risk'
  return 'High Risk'
}

export function generateRisks(breakdown: ScoreBreakdown, hasReadme: boolean, hasCI: boolean): string[] {
  const risks: string[] = []

  if (breakdown.busFactor < 8) {
    risks.push('Single-maintainer dependency')
  } else if (breakdown.busFactor < 12) {
    risks.push('High contributor concentration')
  }

  if (breakdown.maintenance < 8) {
    risks.push('Inactive or inconsistent maintenance')
  } else if (breakdown.maintenance < 12) {
    risks.push('Slow response to issues')
  }

  if (breakdown.dependencies < 8) {
    risks.push('High dependency fragility risk')
  } else if (breakdown.dependencies < 12) {
    risks.push('Outdated dependencies')
  }

  if (breakdown.opsReadiness < 8) {
    risks.push('High onboarding friction')
  } else if (!hasReadme) {
    risks.push('Missing documentation')
  } else if (!hasCI) {
    risks.push('No CI/CD pipeline')
  }

  if (breakdown.ownership < 8) {
    risks.push('Unclear ownership structure')
  }

  return risks.slice(0, 3)
}

export function generateStrengths(breakdown: ScoreBreakdown, hasCI: boolean, hasTests: boolean): string[] {
  const strengths: string[] = []

  if (breakdown.busFactor >= 15) {
    strengths.push('Distributed contributor base')
  }

  if (breakdown.maintenance >= 15) {
    strengths.push('Consistent maintenance')
  }

  if (breakdown.dependencies >= 15) {
    strengths.push('Well-maintained dependencies')
  }

  if (hasCI) {
    strengths.push('CI pipeline present')
  }

  if (hasTests) {
    strengths.push('Test coverage')
  }

  if (breakdown.opsReadiness >= 15) {
    strengths.push('Clear setup documentation')
  }

  if (breakdown.ownership >= 15) {
    strengths.push('Clear ownership structure')
  }

  return strengths.slice(0, 2)
}

export function generateTakeoverReadiness(
  totalScore: number,
  risks: string[],
  breakdown: ScoreBreakdown
): string {
  if (totalScore >= 80) {
    return 'This repository is well-maintained and ready for takeover. Minimal stabilization time required (1-2 weeks).'
  }

  if (totalScore >= 50) {
    const mainRisk = risks[0] || 'general maintenance gaps'
    const weeks = breakdown.busFactor < 10 ? '3-4' : '2-3'
    return `If this repository were acquired today, the biggest risk would be ${mainRisk}. Stabilization would likely require ${weeks} weeks.`
  }

  return 'This repository requires significant stabilization work before it can be reliably maintained. Estimated stabilization time: 4-6 weeks or more.'
}
