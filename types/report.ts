export interface ScoreBreakdown {
  busFactor: number
  maintenance: number
  dependencies: number
  opsReadiness: number
  ownership: number
}

export interface Report {
  owner: string
  repo: string
  score: number
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk'
  breakdown: ScoreBreakdown
  risks: string[]
  strengths: string[]
  takeoverReadiness: string
  repoMetadata?: {
    name: string
    language: string | null
    stars: number
    description: string | null
  }
  updatedAt: Date
  analysisVersion?: number // For cache invalidation
}

export interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  default_branch: string
  private: boolean
  owner: {
    login: string
  }
}

export interface Contributor {
  login: string
  contributions: number
  type?: string
}

export interface Commit {
  commit: {
    author: {
      date: string
    }
    message: string
  }
  author: {
    login: string | null
  }
}
