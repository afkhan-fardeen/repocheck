import {
  getRepo,
  getContributors,
  getCommits,
  getIssues,
  getPullRequests,
  getFileContent,
  checkFileExists,
  getTree,
} from './github'
import {
  calculateBusFactorScore,
  calculateMaintenanceScore,
  calculateDependencyScore,
  calculateOpsReadinessScore,
  calculateOwnershipScore,
  getRiskLevel,
  generateRisks,
  generateStrengths,
  generateTakeoverReadiness,
} from './scoring'
import { Report, ScoreBreakdown } from '@/types/report'

export async function analyzeRepository(owner: string, repo: string): Promise<Report> {
  // Step 1: Get repo metadata
  const repoData = await getRepo(owner, repo)

  // Step 2: Contributor analysis (Bus Factor)
  const contributors = await getContributors(owner, repo)
  const commits = await getCommits(owner, repo, new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

  let topContributorPercent = 0
  let hasSecondaryContributors = false

  if (contributors.length > 0) {
    const totalCommits = contributors.reduce((sum, c) => sum + (c.contributions || 0), 0)
    if (totalCommits > 0) {
      topContributorPercent = ((contributors[0].contributions || 0) / totalCommits) * 100
      hasSecondaryContributors = contributors.length > 1 && (contributors[1].contributions || 0) > 0
    }
  } else if (commits.length > 0) {
    // Fallback: analyze commits directly
    const commitAuthors: Record<string, number> = {}
    commits.forEach((commit) => {
      const author = commit.author?.login || 'unknown'
      commitAuthors[author] = (commitAuthors[author] || 0) + 1
    })

    const sortedAuthors = Object.entries(commitAuthors).sort((a, b) => b[1] - a[1])
    const totalCommits = commits.length
    if (totalCommits > 0 && sortedAuthors.length > 0) {
      topContributorPercent = (sortedAuthors[0][1] / totalCommits) * 100
      hasSecondaryContributors = sortedAuthors.length > 1 && sortedAuthors[1][1] > 0
    }
  }

  const busFactorScore = calculateBusFactorScore(topContributorPercent, hasSecondaryContributors)

  // Step 3: Maintenance analysis
  const now = Date.now()
  const lastCommit = commits[0]
  const daysSinceLastCommit = lastCommit
    ? Math.floor((now - new Date(lastCommit.commit.author.date).getTime()) / (1000 * 60 * 60 * 24))
    : 365

  // Calculate commit consistency (commits per month over last 6 months)
  const sixMonthsAgo = new Date(now - 180 * 24 * 60 * 60 * 1000)
  const recentCommits = commits.filter(
    (c) => new Date(c.commit.author.date) > sixMonthsAgo
  )
  const commitConsistency = Math.min(1, recentCommits.length / 30) // Normalize to 0-1

  // Issue response time
  const issues = await getIssues(owner, repo)
  let avgIssueResponseDays: number | null = null
  if (issues.length > 0) {
    const respondedIssues = issues.filter((issue) => issue.closed_at && issue.created_at)
    if (respondedIssues.length > 0) {
      const responseTimes = respondedIssues.map((issue) => {
        const created = new Date(issue.created_at).getTime()
        const closed = new Date(issue.closed_at!).getTime()
        return (closed - created) / (1000 * 60 * 60 * 24)
      })
      avgIssueResponseDays = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    }
  }

  // PR merge time
  const pullRequests = await getPullRequests(owner, repo)
  let avgPRMergeDays: number | null = null
  if (pullRequests.length > 0) {
    const mergedPRs = pullRequests.filter((pr) => pr.merged_at && pr.created_at)
    if (mergedPRs.length > 0) {
      const mergeTimes = mergedPRs.map((pr) => {
        const created = new Date(pr.created_at).getTime()
        const merged = new Date(pr.merged_at!).getTime()
        return (merged - created) / (1000 * 60 * 60 * 24)
      })
      avgPRMergeDays = mergeTimes.reduce((a, b) => a + b, 0) / mergeTimes.length
    }
  }

  const maintenanceScore = calculateMaintenanceScore(
    daysSinceLastCommit,
    commitConsistency,
    avgIssueResponseDays,
    avgPRMergeDays
  )

  // Step 4: Dependency scan
  const defaultBranch = repoData.default_branch
  let dependencyCount = 0
  let outdatedCount = 0
  let abandonedCount = 0

  // Check for package.json (Node.js)
  const packageJsonContent = await getFileContent(owner, repo, 'package.json', defaultBranch)
  if (packageJsonContent) {
    try {
      const packageJson = JSON.parse(packageJsonContent)
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }
      dependencyCount = Object.keys(deps).length
      // Simple heuristic: check for old version patterns
      outdatedCount = Object.values(deps).filter((v: any) =>
        /[\^~]?[0-9]+\.[0-9]+/.test(v) && !v.includes('latest')
      ).length
    } catch (e) {
      // Invalid JSON
    }
  }

  // Check for requirements.txt (Python)
  const requirementsContent = await getFileContent(owner, repo, 'requirements.txt', defaultBranch)
  if (requirementsContent) {
    const lines = requirementsContent.split('\n').filter((line) => line.trim() && !line.startsWith('#'))
    dependencyCount += lines.length
  }

  // Check for go.mod (Go)
  const goModContent = await getFileContent(owner, repo, 'go.mod', defaultBranch)
  if (goModContent) {
    const lines = goModContent.split('\n').filter((line) => line.startsWith('require') && !line.includes('// indirect'))
    dependencyCount += lines.length
  }

  const dependencyScore = calculateDependencyScore(dependencyCount, outdatedCount, abandonedCount)

  // Step 5: Operational readiness
  const hasReadme = await checkFileExists(owner, repo, 'README.md', defaultBranch)
  const readmeContent = hasReadme ? await getFileContent(owner, repo, 'README.md', defaultBranch) : null
  const hasSetupInstructions =
    readmeContent !== null &&
    (readmeContent.toLowerCase().includes('install') ||
      readmeContent.toLowerCase().includes('setup') ||
      readmeContent.toLowerCase().includes('getting started') ||
      readmeContent.toLowerCase().includes('prerequisites'))

  const hasCI = await checkFileExists(owner, repo, '.github/workflows', defaultBranch)
  const tree = await getTree(owner, repo, defaultBranch)
  const hasTests =
    tree.some(
      (item: any) =>
        item.path?.includes('test') ||
        item.path?.includes('spec') ||
        item.path?.includes('__tests__') ||
        item.path?.endsWith('.test.js') ||
        item.path?.endsWith('.test.ts') ||
        item.path?.endsWith('.spec.js')
    ) || false

  const opsReadinessScore = calculateOpsReadinessScore(hasReadme, hasSetupInstructions, hasCI, hasTests)

  // Step 6: Ownership clarity
  const hasCodeowners = await checkFileExists(owner, repo, 'CODEOWNERS', defaultBranch)
  const hasMultipleReviewers = pullRequests.some((pr) => {
    const reviewers = pr.requested_reviewers?.length || 0
    return reviewers > 1
  })
  const maintainerActivity = Math.min(5, Math.floor(commitConsistency * 5))

  const ownershipScore = calculateOwnershipScore(hasCodeowners, hasMultipleReviewers, maintainerActivity)

  // Calculate total score
  const breakdown: ScoreBreakdown = {
    busFactor: busFactorScore,
    maintenance: maintenanceScore,
    dependencies: dependencyScore,
    opsReadiness: opsReadinessScore,
    ownership: ownershipScore,
  }

  const totalScore = Math.round(
    breakdown.busFactor +
      breakdown.maintenance +
      breakdown.dependencies +
      breakdown.opsReadiness +
      breakdown.ownership
  )

  const riskLevel = getRiskLevel(totalScore)
  const risks = generateRisks(breakdown, hasReadme, hasCI)
  const strengths = generateStrengths(breakdown, hasCI, hasTests)
  const takeoverReadiness = generateTakeoverReadiness(totalScore, risks, breakdown)

  return {
    owner,
    repo,
    score: totalScore,
    riskLevel,
    breakdown,
    risks,
    strengths,
    takeoverReadiness,
    repoMetadata: {
      name: repoData.name,
      language: repoData.language,
      stars: repoData.stargazers_count,
      description: repoData.description,
    },
    updatedAt: new Date(),
  }
}
