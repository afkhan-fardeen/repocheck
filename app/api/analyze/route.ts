import { NextRequest, NextResponse } from 'next/server'
import { analyzeRepository } from '@/lib/analyzer-optimized'
import { getCachedReport, setCachedReport } from '@/lib/cache'
import { isAnalysisInProgress, startAnalysis, finishAnalysis } from '@/lib/queue'
import { checkAbuseProtection, canMakeAPICall, isCachedRepo } from '@/lib/rate-limit'

// Simple rate limiting (in-memory, per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      )
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { repoUrl } = body

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 })
    }

    // Extract owner/repo from URL
    const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/]+)/
    const match = repoUrl.match(githubUrlPattern)

    if (!match) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      )
    }

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')

    // Step 1: Check cache first (CRITICAL - this is the core principle)
    const cachedReport = getCachedReport(owner, cleanRepo)
    if (cachedReport) {
      return NextResponse.json({ 
        owner, 
        repo: cleanRepo, 
        cached: true,
        message: 'Returning cached result'
      })
    }

    // Step 2: Check if analysis is in progress
    if (isAnalysisInProgress(owner, cleanRepo)) {
      return NextResponse.json({
        owner,
        repo: cleanRepo,
        inProgress: true,
        message: 'Analysis in progress. Please check back in a moment.'
      })
    }

    // Step 3: Abuse protection (only for NEW analyses, not cached)
    if (!checkAbuseProtection(ip)) {
      return NextResponse.json(
        { error: 'Too many new repository analyses. Please wait an hour or check a cached repository.' },
        { status: 429 }
      )
    }

    // Step 4: Check if we can make API calls
    if (!canMakeAPICall()) {
      // Return cached results only if available, otherwise error
      return NextResponse.json(
        { error: 'GitHub API rate limit is low. Please try again later.' },
        { status: 429 }
      )
    }

    // Step 5: Start analysis job
    if (!startAnalysis(owner, cleanRepo)) {
      return NextResponse.json(
        { error: 'Analysis queue is full. Please try again in a moment.' },
        { status: 503 }
      )
    }

    try {
      // Step 6: Analyze repository (this is async and queued)
      const report = await analyzeRepository(owner, cleanRepo)
      
      // Step 7: Cache the result
      setCachedReport(owner, cleanRepo, report)
      
      return NextResponse.json({ 
        owner, 
        repo: cleanRepo, 
        cached: false,
        message: 'Analysis complete'
      })
    } catch (error: any) {
      // Better error handling
      if (error.status === 404) {
        return NextResponse.json(
          { error: 'Repository not found or is private. Only public repositories are supported.' },
          { status: 404 }
        )
      }

      if (error.status === 403 || error.message?.includes('rate limit') || error.message?.includes('API rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit reached. Please wait a few minutes and try again.' },
          { status: 429 }
        )
      }

      if (error.message?.includes('Exceeded API call budget')) {
        return NextResponse.json(
          { error: 'Analysis failed due to API limits. Please try again later.' },
          { status: 500 }
        )
      }

      console.error('Analysis error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to analyze repository. Please try again later.' },
        { status: 500 }
      )
    } finally {
      // Always finish the job
      finishAnalysis(owner, cleanRepo)
    }
  } catch (error: any) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
