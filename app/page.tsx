import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import RepoInput from '@/components/RepoInput'
import { HiUsers, HiArrowPath, HiCube, HiDocumentText, HiShieldCheck, HiChartBar } from 'react-icons/hi2'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Check GitHub repository health
            <br className="hidden sm:block" />
            <span className="text-primary"> in seconds</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Analyze any public GitHub repo. Get instant insights on maintainability, risks, and whether it&apos;s production-ready.
          </p>
          
          <div className="mb-8 sm:mb-12 px-2">
            <RepoInput />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-500 px-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Free forever
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              No signup required
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Instant results
            </span>
          </div>
        </section>

        {/* What You Get */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center px-2">
            What you&apos;ll learn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <HiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Team Risk</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                See if the project depends on a single person. High bus factor = safer choice.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <HiArrowPath className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Maintenance</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Check if the repo is actively maintained or abandoned. Recent activity matters.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <HiCube className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Dependencies</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Find outdated or abandoned packages that could cause problems later.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <HiDocumentText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Documentation</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Verify if others can actually use this project. Good docs = easier adoption.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <HiShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Quality</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Check for tests, CI/CD, and code review processes. Quality signals matter.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3 sm:mb-4">
                <HiChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Verdict</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Get a clear score and plain English summary. No charts, just answers.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white dark:bg-gray-900 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center px-2">
              How it works
            </h2>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto sm:mx-0">
                  <span className="text-primary font-bold text-lg sm:text-base">1</span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Paste a GitHub URL</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Just paste any public repository URL. We&apos;ll extract the owner and repo name automatically.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto sm:mx-0">
                  <span className="text-primary font-bold text-lg sm:text-base">2</span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">We analyze the repo</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    We check contributors, commits, dependencies, documentation, and more using GitHub&apos;s API.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto sm:mx-0">
                  <span className="text-primary font-bold text-lg sm:text-base">3</span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Get your report</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    See a health score, identified risks, strengths, and whether it&apos;s ready for production use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
