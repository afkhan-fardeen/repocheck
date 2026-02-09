// Simple in-memory job queue (replace with Redis/BullMQ in production)

interface Job {
  repoId: string
  owner: string
  repo: string
  startedAt: number
}

const jobs = new Map<string, Job>()
const MAX_CONCURRENT_JOBS = 2
const JOB_DELAY_MS = 400 // Delay between jobs

let activeJobs = 0
let lastJobTime = 0

export function isAnalysisInProgress(owner: string, repo: string): boolean {
  const repoId = `${owner}/${repo}`
  return jobs.has(repoId)
}

export function startAnalysis(owner: string, repo: string): boolean {
  const repoId = `${owner}/${repo}`
  
  // Check if already in progress
  if (jobs.has(repoId)) {
    return false
  }

  // Check concurrent job limit
  if (activeJobs >= MAX_CONCURRENT_JOBS) {
    return false
  }

  // Enforce delay between jobs
  const now = Date.now()
  if (now - lastJobTime < JOB_DELAY_MS) {
    return false
  }

  jobs.set(repoId, {
    repoId,
    owner,
    repo,
    startedAt: now,
  })
  
  activeJobs++
  lastJobTime = now
  return true
}

export function finishAnalysis(owner: string, repo: string): void {
  const repoId = `${owner}/${repo}`
  if (jobs.has(repoId)) {
    jobs.delete(repoId)
    activeJobs = Math.max(0, activeJobs - 1)
  }
}

export function getJobStatus(owner: string, repo: string): Job | null {
  const repoId = `${owner}/${repo}`
  return jobs.get(repoId) || null
}
