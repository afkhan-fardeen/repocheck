// GraphQL-based GitHub API client (reduces API calls significantly)
// Falls back to REST if GraphQL fails or token not available

interface GraphQLResponse {
  data?: any
  errors?: Array<{ message: string }>
}

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

async function graphqlQuery(query: string, variables?: Record<string, any>): Promise<any> {
  const token = process.env.GITHUB_TOKEN
  
  if (!token) {
    // Fallback to REST if no token
    return null
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })

    const result: GraphQLResponse = await response.json()

    if (result.errors) {
      console.warn('GraphQL errors:', result.errors)
      return null // Fallback to REST
    }

    // Update rate limit from headers
    const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0')
    const resetAt = parseInt(response.headers.get('x-ratelimit-reset') || '0')
    
    if (remaining > 0 && resetAt > 0) {
      const { updateRateLimit } = await import('./rate-limit')
      updateRateLimit(remaining, resetAt)
    }

    return result.data
  } catch (error) {
    console.warn('GraphQL query failed, falling back to REST:', error)
    return null
  }
}

export async function getRepoDataGraphQL(owner: string, repo: string) {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        name
        description
        isPrivate
        isArchived
        hasIssuesEnabled
        defaultBranchRef {
          name
        }
        primaryLanguage {
          name
        }
        stargazerCount
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) {
                edges {
                  node {
                    author {
                      user {
                        login
                      }
                      date
                    }
                    message
                  }
                }
              }
            }
          }
        }
        issues(first: 50, states: [OPEN, CLOSED], orderBy: {field: UPDATED_AT, direction: DESC}) {
          edges {
            node {
              createdAt
              closedAt
              state
            }
          }
        }
        pullRequests(first: 50, states: [OPEN, CLOSED, MERGED], orderBy: {field: UPDATED_AT, direction: DESC}) {
          edges {
            node {
              createdAt
              mergedAt
              state
              reviews(first: 10) {
                edges {
                  node {
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
        contributors: defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) {
                edges {
                  node {
                    author {
                      user {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await graphqlQuery(query, { owner, repo })
  
  // Return null if GraphQL failed (will trigger REST fallback)
  if (!data || !data.repository) {
    return null
  }

  if (data.repository.isPrivate) {
    throw new Error('Private repositories are not supported')
  }

  return {
    name: data.repository.name,
    description: data.repository.description,
    language: data.repository.primaryLanguage?.name || null,
    stars: data.repository.stargazerCount,
    defaultBranch: data.repository.defaultBranchRef?.name || 'main',
    isArchived: data.repository.isArchived,
    hasIssuesEnabled: data.repository.hasIssuesEnabled,
    commits: data.repository.defaultBranchRef?.target?.history?.edges || [],
    issues: data.repository.issues?.edges || [],
    pullRequests: data.repository.pullRequests?.edges || [],
  }
}
