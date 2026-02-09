import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-[#0B0D10]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-white text-xl">rocket_launch</span>
            </div>
            <span className="text-xl font-bold tracking-tight">RepoPulse</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link
              href="/"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
          </nav>
          <div className="md:hidden">
            <span className="material-symbols-outlined">menu</span>
          </div>
        </div>
      </div>
    </header>
  )
}
