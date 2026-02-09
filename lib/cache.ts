import { Report } from '@/types/report'

// Simple in-memory cache (replace with PostgreSQL in production)
const cache = new Map<string, { report: Report; expiresAt: number }>()

const CACHE_TTL_MS = 10 * 24 * 60 * 60 * 1000 // 10 days (configurable: 7-14 days)
const ANALYSIS_VERSION = 1 // Increment when scoring logic changes

export function getCachedReport(owner: string, repo: string): Report | null {
  const key = `${owner}/${repo}`
  const cached = cache.get(key)

  if (!cached) {
    return null
  }

  if (Date.now() > cached.expiresAt) {
    cache.delete(key)
    return null
  }

  return cached.report
}

export function setCachedReport(owner: string, repo: string, report: Report): void {
  const key = `${owner}/${repo}`
  cache.set(key, {
    report: {
      ...report,
      // Store version for cache invalidation
      analysisVersion: ANALYSIS_VERSION,
    },
    expiresAt: Date.now() + CACHE_TTL_MS,
  })
}

export function getAnalysisVersion(): number {
  return ANALYSIS_VERSION
}

export function clearExpiredReports(): void {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now > value.expiresAt) {
      cache.delete(key)
    }
  }
}
