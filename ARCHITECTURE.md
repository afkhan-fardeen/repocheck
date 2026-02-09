# RepoCheck Architecture

## Core Principle

**A repo analysis is NOT user-specific. It is repo-specific.**

- Compute once
- Reuse forever (until stale)
- Same repo = same report
- Users never change output

## System Flow

```
User → Landing Page → Submit Repo URL
  ↓
CACHE CHECK
  ├─ HIT → Return Result (0 API calls)
  └─ MISS
       ↓
    Queue Job (max 2-3 concurrent)
       ↓
    Controlled Analyzer
       ↓
    Save Result (TTL: 10 days)
       ↓
    Return Result
```

## API Call Budget

**Hard Limit: Max 8 API calls per repo analysis**

### Call Order (Cheapest → Expensive)

1. **GraphQL Core Query (1 call)** - OR REST fallback
   - Repo metadata
   - Commits (last 100)
   - Issues (last 50)
   - PRs (last 50)
   - Contributors

2. **Repo Contents (2-3 calls max)**
   - README.md
   - Dependency file (package.json, requirements.txt, etc.)
   - CI/CD check (.github/workflows)

3. **Optional (if budget allows)**
   - CODEOWNERS file
   - Additional dependency files

## Rate Limit Protection

- Track remaining API calls from GitHub headers
- Pause jobs if remaining < 50
- Return cached-only results when rate limit is low
- Users never see rate limit errors

## Abuse Protection

- Max 3-5 new repo analyses per IP per hour
- Cached repos: unlimited access
- Blocks bots politely
- Protects more than tokens do

## Queue System

- Max 2-3 concurrent jobs
- 400ms delay between jobs
- Prevents burst exhaustion
- Serializes heavy work

## Cache Strategy

- TTL: 10 days (configurable: 7-14 days)
- Repo-specific (not user-specific)
- Analysis version tracking for cache invalidation
- Same repo = same report (deterministic)

## Scoring

- Pure, deterministic logic
- No randomness
- No AI
- Versioned for cache invalidation
- Reproducible results

## What We Never Do

❌ Ask users to login  
❌ Ask for GitHub tokens  
❌ Recompute same repo  
❌ Fetch full commit history  
❌ Promise "unlimited"  
❌ Analyze on every page load  

## Result

- 1 repo = 1 analysis per week
- Popular repos become free traffic
- Limits disappear
- Costs stay flat
- Product feels premium
