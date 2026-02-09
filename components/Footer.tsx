import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">RepoCheck</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mb-3 sm:mb-4">
              Free GitHub repository health checker. Analyze maintainability, risks, and takeover readiness in seconds.
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              <p>Developed by <span className="font-medium text-gray-700 dark:text-gray-300">Afkhan Fardeen Khan</span></p>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} RepoCheck. Free and open source tool for evaluating GitHub repository health.
          </p>
        </div>
      </div>
    </footer>
  )
}
