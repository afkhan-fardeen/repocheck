'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RepoInput() {
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL')
      return
    }

    const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/]+)/
    const match = repoUrl.match(githubUrlPattern)
    
    if (!match) {
      setError('Please enter a valid GitHub URL (e.g., github.com/owner/repo)')
      return
    }

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')

    setIsLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: `https://github.com/${owner}/${cleanRepo}` }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const errorMsg = data.error || 'Failed to analyze repository'
        
        // Better error messages
        if (errorMsg.includes('rate limit')) {
          setError('GitHub API rate limit reached. Please wait a few minutes and try again.')
        } else if (errorMsg.includes('not found') || errorMsg.includes('private')) {
          setError('Repository not found or is private. Only public repositories are supported.')
        } else {
          setError(errorMsg)
        }
        setIsLoading(false)
        return
      }

      router.push(`/report/${owner}/${cleanRepo}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="github.com/owner/repo"
          className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-primary/20 text-base sm:text-lg"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
          <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 text-center">{error}</p>
        </div>
      )}
    </form>
  )
}
