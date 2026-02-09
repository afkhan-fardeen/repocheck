import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HiArrowLeft } from 'react-icons/hi2'

export const metadata = {
  title: 'About RepoCheck - GitHub Repository Health Checker',
  description: 'Learn about RepoCheck, a free tool for assessing GitHub repository health, maintainability, and risks.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">About RepoCheck</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12">
          A free tool to help you evaluate GitHub repositories before using them.
        </p>

        <div className="space-y-8 sm:space-y-12">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">What This Tool Does</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              RepoCheck analyzes public GitHub repositories and gives you a health score from 0-100. 
              We check five key areas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 ml-2 sm:ml-4">
              <li><strong>Bus Factor:</strong> How many people actually contribute? One person = risky.</li>
              <li><strong>Maintenance:</strong> Is it actively maintained or abandoned?</li>
              <li><strong>Dependencies:</strong> Are packages outdated or abandoned?</li>
              <li><strong>Documentation:</strong> Can someone actually use this project?</li>
              <li><strong>Ownership:</strong> Is it clear who&apos;s responsible?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Why Use It</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Before adding a dependency or buying a codebase, you should know:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 ml-2 sm:ml-4">
              <li>Will this project be maintained next year?</li>
              <li>What happens if the main developer leaves?</li>
              <li>Can my team actually use this code?</li>
              <li>Are there hidden risks I should know about?</li>
            </ul>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mt-3 sm:mt-4">
              RepoCheck answers these questions in seconds, not hours of manual research.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">How It Works</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              RepoCheck uses a cache-first architecture:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 ml-2 sm:ml-4">
              <li>Each repository is analyzed once and cached for 7-14 days</li>
              <li>Same repo = same report (deterministic scoring)</li>
              <li>Results are shared across all users (repo-specific, not user-specific)</li>
              <li>This keeps costs low and ensures GitHub rate limits never surface</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">What It&apos;s Not</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              This tool doesn&apos;t:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 ml-2 sm:ml-4">
              <li>Check code quality or security vulnerabilities</li>
              <li>Work with private repositories</li>
              <li>Require any login or signup</li>
              <li>Cost anything (it&apos;s completely free)</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-800 pt-6 sm:pt-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Developer</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              RepoCheck is developed by <strong className="text-gray-900 dark:text-white">Afkhan Fardeen Khan</strong>.
            </p>
          </section>

          <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/"
              className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
