import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            RepoCheck
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <Link 
              href="/about" 
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              About
            </Link>
            <Link 
              href="/faq" 
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              FAQ
            </Link>
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
