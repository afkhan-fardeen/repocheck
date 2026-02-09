# Quick Start Guide

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. (Optional) Add GitHub token for higher rate limits:
```bash
# Create .env.local file
echo "GITHUB_TOKEN=your_token_here" > .env.local
```

3. Start development server:
```bash
pnpm dev
```

4. Open http://localhost:3000

## Testing

Try analyzing a popular repository:
- https://github.com/vercel/next.js
- https://github.com/facebook/react
- https://github.com/microsoft/typescript

## Project Structure

- `app/` - Next.js pages and API routes
- `components/` - React components
- `lib/` - Core business logic
  - `analyzer.ts` - Main analysis engine
  - `github.ts` - GitHub API client
  - `scoring.ts` - Scoring algorithms
  - `cache.ts` - Caching layer
- `types/` - TypeScript type definitions

## Key Features Implemented

✅ Landing page with repo input
✅ Report page with health score
✅ Five-pillar scoring system
✅ Risk and strength analysis
✅ About and FAQ pages
✅ GitHub API integration
✅ In-memory caching (7-day TTL)
✅ Rate limiting
✅ Dark mode UI
✅ Responsive design

## Next Steps for Production

1. Replace in-memory cache with PostgreSQL
2. Add Redis for rate limiting
3. Set up background job queue
4. Add monitoring and error tracking
5. Configure environment variables properly
6. Add CI/CD pipeline
