// Rate limit tracking and abuse protection

interface RateLimitState {
  remaining: number
  resetAt: number
  lastChecked: number
}

let rateLimitState: RateLimitState = {
  remaining: 5000, // Assume high limit initially
  resetAt: Date.now() + 3600000, // 1 hour from now
  lastChecked: Date.now(),
}

// Abuse protection: track new analyses per IP
const newAnalysisCounts = new Map<string, { count: number; resetAt: number }>()
const MAX_NEW_ANALYSES_PER_HOUR = 5

export function updateRateLimit(remaining: number, resetAt: number): void {
  rateLimitState = {
    remaining,
    resetAt: resetAt * 1000, // Convert to milliseconds
    lastChecked: Date.now(),
  }
}

export function canMakeAPICall(): boolean {
  // If remaining is low, pause
  if (rateLimitState.remaining < 50) {
    return false
  }
  return true
}

export function getRateLimitState(): RateLimitState {
  return rateLimitState
}

export function checkAbuseProtection(ip: string): boolean {
  const now = Date.now()
  const record = newAnalysisCounts.get(ip)

  if (!record || now > record.resetAt) {
    newAnalysisCounts.set(ip, {
      count: 1,
      resetAt: now + 3600000, // 1 hour
    })
    return true
  }

  if (record.count >= MAX_NEW_ANALYSES_PER_HOUR) {
    return false
  }

  record.count++
  return true
}

export function isCachedRepo(owner: string, repo: string): boolean {
  // This would check cache - for now assume false
  // In real implementation, check cache first
  return false
}
