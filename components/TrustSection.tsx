const companies = ['NEXT_TECH', 'CLOUD_CORE', 'DEV_FLOW', 'SAFE_DEPLOY']

export default function TrustSection() {
  return (
    <div className="mt-24 border-t border-slate-200 dark:border-slate-800 pt-12">
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-8">
        Trusted by engineering teams at
      </p>
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {companies.map((company, index) => (
            <div
              key={index}
              className="h-8 w-32 bg-slate-300 dark:bg-slate-700 rounded-lg flex items-center justify-center"
            >
              <span className="text-xs font-mono">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
