import { Octokit } from '@octokit/rest'
import { GitHubRepo, Contributor, Commit } from '@/types/report'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional, increases rate limit
})

export async function getRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const { data } = await octokit.repos.get({
    owner,
    repo,
  })

  if (data.private) {
    throw new Error('Private repositories are not supported')
  }

  return data
}

export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
  try {
    const { data } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    })
    return data
      .filter((c: any) => c.type === 'User' && c.login)
      .map((c: any) => ({
        login: c.login,
        contributions: c.contributions || 0,
        type: c.type,
      })) as Contributor[]
  } catch (error) {
    // Some repos don't allow contributor listing
    return []
  }
}

export async function getCommits(owner: string, repo: string, since?: string): Promise<Commit[]> {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 100,
      since,
    })
    return data as Commit[]
  } catch (error) {
    return []
  }
}

export async function getIssues(owner: string, repo: string): Promise<any[]> {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100,
      sort: 'updated',
    })
    return data.filter((issue: any) => !issue.pull_request) // Only issues, not PRs
  } catch (error) {
    return []
  }
}

export async function getPullRequests(owner: string, repo: string): Promise<any[]> {
  try {
    const { data } = await octokit.pulls.list({
      owner,
      repo,
      state: 'all',
      per_page: 100,
      sort: 'updated',
    })
    return data
  } catch (error) {
    return []
  }
}

export async function getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    })

    if ('content' in data && 'encoding' in data) {
      const content = (data as any).content
      // Buffer is available in Node.js environment (Next.js API routes)
      return Buffer.from(content, 'base64').toString('utf-8')
    }

    return null
  } catch (error) {
    return null
  }
}

export async function checkFileExists(owner: string, repo: string, path: string, ref?: string): Promise<boolean> {
  try {
    await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    })
    return true
  } catch (error) {
    return false
  }
}

export async function getTree(owner: string, repo: string, ref: string): Promise<any[]> {
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: ref,
      recursive: '1',
    })
    return data.tree || []
  } catch (error) {
    return []
  }
}
