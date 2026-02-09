import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Repository Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The repository you&apos;re looking for doesn&apos;t exist or is private.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
