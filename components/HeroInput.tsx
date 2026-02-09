'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroInput() {
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

    // Extract owner/repo from URL
    const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/]+)/
    const match = repoUrl.match(githubUrlPattern)
    
    if (!match) {
      setError('Please enter a valid GitHub repository URL (e.g., github.com/owner/repo)')
      return
    }

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')

    setIsLoading(true)

    try {
      // Call analyze API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: `https://github.com/${owner}/${cleanRepo}` }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to analyze repository'
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Redirect to report page
      router.push(`/report/${owner}/${cleanRepo}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-xl bg-white dark:bg-[#111418] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/40 transition-all group">
          <div className="flex-1 flex items-center px-4 gap-3">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">link</span>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="github.com/username/repository"
              className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">analytics</span>
            {isLoading ? 'Analyzing...' : 'Check Health'}
          </button>
        </div>
      </form>
      {error && (
        <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  )
}
