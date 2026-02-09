# Vercel Deployment Guide

This project is configured for deployment on Vercel using pnpm.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A GitHub repository with your code
3. A GitHub Personal Access Token (optional but recommended)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and pnpm settings from `vercel.json`

### 2. Configure Environment Variables

In Vercel project settings, add these environment variables:

- `GITHUB_TOKEN` (optional but recommended)
  - Get one at: https://github.com/settings/tokens
  - Permissions needed: `public_repo` (read-only)
  - This increases your GitHub API rate limit from 60 to 5000 requests/hour

### 3. Deploy

Vercel will automatically:
- Install dependencies using `pnpm install --frozen-lockfile`
- Build the project using `pnpm build`
- Deploy to production

## Configuration Details

The `vercel.json` file includes:

- **pnpm commands**: Configured for pnpm package manager
- **API route timeout**: 30 seconds for analysis endpoints
- **Security headers**: XSS protection, frame options, etc.
- **Region**: Deployed to `iad1` (US East)

## Important Notes

- `pnpm-lock.yaml` should be committed to your repository
- The project uses Node.js 18+ (specified in `package.json` engines)
- API routes have a 30-second timeout limit
- Environment variables are set in Vercel dashboard, not in code

## Troubleshooting

### Build Fails

- Ensure `pnpm-lock.yaml` is committed
- Check Node.js version matches `package.json` engines
- Verify all dependencies are listed in `package.json`

### API Rate Limits

- Add `GITHUB_TOKEN` environment variable in Vercel
- Check rate limit status in API responses

### Function Timeout

- API routes are limited to 30 seconds
- Consider optimizing analysis or using background jobs for long-running tasks
