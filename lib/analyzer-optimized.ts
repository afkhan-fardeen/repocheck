// Optimized analyzer following the architecture: max 8 API calls, GraphQL-first with REST fallback

import { getRepoDataGraphQL } from './github-graphql'
import { getRepo, getContributors, getCommits, getIssues, getPullRequests, getFileContent, checkFileExists } from './github'
import { canMakeAPICall } from './rate-limit'
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

let apiCallCount = 0
const MAX_API_CALLS = 8

function resetCallCount() {
  apiCallCount = 0
}

function incrementCallCount() {
  apiCallCount++
  if (apiCallCount > MAX_API_CALLS) {
    throw new Error(`Exceeded API call budget: ${apiCallCount} calls`)
  }
}

export async function analyzeRepository(owner: string, repo: string): Promise<Report> {
  resetCallCount()

  // Check rate limit before starting
  if (!canMakeAPICall()) {
    throw new Error('GitHub API rate limit is low. Please try again later.')
  }

  // Step 1: Try GraphQL first (1 call), fallback to REST if needed
  incrementCallCount()
  let repoData = await getRepoDataGraphQL(owner, repo)
  let useGraphQL = !!repoData

  // Fallback to REST if GraphQL failed
  if (!repoData) {
    incrementCallCount()
    const restRepo = await getRepo(owner, repo)
    repoData = {
      name: restRepo.name,
      description: restRepo.description,
      language: restRepo.language,
      stars: restRepo.stargazers_count,
      defaultBranch: restRepo.default_branch,
      isArchived: false,
      hasIssuesEnabled: true,
      commits: [],
      issues: [],
      pullRequests: [],
    }
    useGraphQL = false
  }

  // Early exit if archived
  if (repoData.isArchived) {
    return generateArchivedReport(owner, repo, repoData)
  }

  // Process data (GraphQL or REST)
  let commits: any[] = []
  let issues: any[] = []
  let pullRequests: any[] = []

  if (useGraphQL) {
    commits = repoData.commits.map((edge: any) => edge.node)
    issues = repoData.issues.map((edge: any) => edge.node)
    pullRequests = repoData.pullRequests.map((edge: any) => edge.node)
  } else {
    // Fetch REST data if GraphQL not available
    if (apiCallCount < MAX_API_CALLS) {
      incrementCallCount()
      const restCommits = await getCommits(owner, repo, new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      commits = restCommits
    }
    
    if (apiCallCount < MAX_API_CALLS) {
      incrementCallCount()
      issues = await getIssues(owner, repo)
    }
    
    if (apiCallCount < MAX_API_CALLS) {
      incrementCallCount()
      pullRequests = await getPullRequests(owner, repo)
    }
  }

  // Bus Factor Analysis
  const commitAuthors: Record<string, number> = {}
  commits.forEach((commit: any) => {
    const author = useGraphQL 
      ? (commit.author?.user?.login || 'unknown')
      : (commit.author?.login || 'unknown')
    commitAuthors[author] = (commitAuthors[author] || 0) + 1
  })

  const sortedAuthors = Object.entries(commitAuthors).sort((a, b) => b[1] - a[1])
  const totalCommits = commits.length
  let topContributorPercent = 0
  let hasSecondaryContributors = false

  if (totalCommits > 0 && sortedAuthors.length > 0) {
    topContributorPercent = (sortedAuthors[0][1] / totalCommits) * 100
    hasSecondaryContributors = sortedAuthors.length > 1 && sortedAuthors[1][1] > 0
  }
  
  // Fallback: use contributors endpoint if commits don't give enough data
  if (totalCommits === 0 && apiCallCount < MAX_API_CALLS) {
    incrementCallCount()
    const contributors = await getContributors(owner, repo)
    if (contributors.length > 0) {
      const totalContributions = contributors.reduce((sum, c) => sum + (c.contributions || 0), 0)
      if (totalContributions > 0) {
        topContributorPercent = ((contributors[0].contributions || 0) / totalContributions) * 100
        hasSecondaryContributors = contributors.length > 1 && (contributors[1].contributions || 0) > 0
      }
    }
  }

  const busFactorScore = calculateBusFactorScore(topContributorPercent, hasSecondaryContributors)

  // Maintenance Analysis
  const now = Date.now()
  const lastCommit = commits[0]
  const commitDate = useGraphQL 
    ? lastCommit?.author?.date 
    : lastCommit?.commit?.author?.date
  
  const daysSinceLastCommit = commitDate
    ? Math.floor((now - new Date(commitDate).getTime()) / (1000 * 60 * 60 * 24))
    : 365

  const sixMonthsAgo = new Date(now - 180 * 24 * 60 * 60 * 1000)
  const recentCommits = commits.filter((c: any) => {
    const date = useGraphQL ? c.author?.date : c.commit?.author?.date
    return date && new Date(date) > sixMonthsAgo
  })
  const commitConsistency = Math.min(1, recentCommits.length / 30)

  // Issue response time
  let avgIssueResponseDays: number | null = null
  const respondedIssues = issues.filter((issue: any) => {
    if (useGraphQL) {
      return issue.closedAt && issue.createdAt
    } else {
      return issue.closed_at && issue.created_at
    }
  })
  
  if (respondedIssues.length > 0) {
    const responseTimes = respondedIssues.map((issue: any) => {
      const created = useGraphQL ? issue.createdAt : issue.created_at
      const closed = useGraphQL ? issue.closedAt : issue.closed_at
      return (new Date(closed).getTime() - new Date(created).getTime()) / (1000 * 60 * 60 * 24)
    })
    avgIssueResponseDays = responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
  }

  // PR merge time
  let avgPRMergeDays: number | null = null
  const mergedPRs = pullRequests.filter((pr: any) => {
    if (useGraphQL) {
      return pr.mergedAt && pr.createdAt
    } else {
      return pr.merged_at && pr.created_at
    }
  })
  
  if (mergedPRs.length > 0) {
    const mergeTimes = mergedPRs.map((pr: any) => {
      const created = useGraphQL ? pr.createdAt : pr.created_at
      const merged = useGraphQL ? pr.mergedAt : pr.merged_at
      return (new Date(merged).getTime() - new Date(created).getTime()) / (1000 * 60 * 60 * 24)
    })
    avgPRMergeDays = mergeTimes.reduce((a: number, b: number) => a + b, 0) / mergeTimes.length
  }

  const maintenanceScore = calculateMaintenanceScore(
    daysSinceLastCommit,
    commitConsistency,
    avgIssueResponseDays,
    avgPRMergeDays
  )

  // Ownership Analysis
  let hasMultipleReviewers = false
  if (useGraphQL) {
    hasMultipleReviewers = pullRequests.some((pr: any) => {
      const reviewers = pr.reviews?.edges?.length || 0
      return reviewers > 1
    })
  } else {
    // For REST, check if PRs have multiple reviewers (simplified check)
    hasMultipleReviewers = pullRequests.length > 5 // Heuristic: many PRs = likely multiple reviewers
  }
  const maintainerActivity = Math.min(5, Math.floor(commitConsistency * 5))

  // Step 2: Repo Contents (2-3 calls max)
  const defaultBranch = repoData.defaultBranch || 'main'
  
  // Check README (1 call)
  incrementCallCount()
  const hasReadme = await checkFileExists(owner, repo, 'README.md', defaultBranch)
  
  let readmeContent: string | null = null
  if (hasReadme && apiCallCount < MAX_API_CALLS) {
    incrementCallCount()
    readmeContent = await getFileContent(owner, repo, 'README.md', defaultBranch)
  }

  const hasSetupInstructions =
    readmeContent !== null &&
    (readmeContent.toLowerCase().includes('install') ||
      readmeContent.toLowerCase().includes('setup') ||
      readmeContent.toLowerCase().includes('getting started') ||
      readmeContent.toLowerCase().includes('prerequisites'))

  // Check dependency files (try common ones, max 1 call)
  let dependencyCount = 0
  let outdatedCount = 0

  if (apiCallCount < MAX_API_CALLS) {
    const dependencyFiles = ['package.json', 'requirements.txt', 'go.mod']
    for (const file of dependencyFiles) {
      incrementCallCount()
      const content = await getFileContent(owner, repo, file, defaultBranch)
      if (content) {
        if (file === 'package.json') {
          try {
            const pkg = JSON.parse(content)
            const deps = { ...pkg.dependencies, ...pkg.devDependencies }
            dependencyCount = Object.keys(deps).length
          } catch {}
        } else {
          const lines = content.split('\n').filter((line) => line.trim() && !line.startsWith('#'))
          dependencyCount += lines.length
        }
        break // Found one, stop
      }
      if (apiCallCount >= MAX_API_CALLS) break
    }
  }

  // Check CI/CD (1 call)
  let hasCI = false
  let hasTests = false
  
  if (apiCallCount < MAX_API_CALLS) {
    incrementCallCount()
    hasCI = await checkFileExists(owner, repo, '.github/workflows', defaultBranch)
    
    // Check for test directories (heuristic from README)
    if (readmeContent?.toLowerCase().includes('test')) {
      hasTests = true
    }
  }

  const dependencyScore = calculateDependencyScore(dependencyCount, outdatedCount, 0)
  const opsReadinessScore = calculateOpsReadinessScore(hasReadme, hasSetupInstructions, hasCI, hasTests)
  
  // Check CODEOWNERS (1 call if budget allows)
  let hasCodeowners = false
  if (apiCallCount < MAX_API_CALLS) {
    incrementCallCount()
    hasCodeowners = await checkFileExists(owner, repo, 'CODEOWNERS', defaultBranch)
  }

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
      stars: repoData.stars,
      description: repoData.description,
    },
    updatedAt: new Date(),
  }
}

function generateArchivedReport(owner: string, repo: string, repoData: any): Report {
  return {
    owner,
    repo,
    score: 10,
    riskLevel: 'High Risk',
    breakdown: {
      busFactor: 2,
      maintenance: 2,
      dependencies: 2,
      opsReadiness: 2,
      ownership: 2,
    },
    risks: ['Repository is archived and no longer maintained'],
    strengths: [],
    takeoverReadiness: 'This repository is archived and no longer actively maintained. It should not be used for new projects.',
    repoMetadata: {
      name: repoData.name,
      language: repoData.language,
      stars: repoData.stars,
      description: repoData.description,
    },
    updatedAt: new Date(),
  }
}
