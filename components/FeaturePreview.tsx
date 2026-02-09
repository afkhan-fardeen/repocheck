const features = [
  {
    title: 'Risk Assessment',
    color: 'bg-primary',
    bars: [100, 67],
  },
  {
    title: 'Maintainability',
    color: 'bg-green-500',
    bars: [100, 75],
  },
  {
    title: 'Technical Debt',
    color: 'bg-purple-500',
    bars: [100, 50],
  },
]

export default function FeaturePreview() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#111418]/50 backdrop-blur-sm p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="space-y-4">
              <div className={`h-2 w-12 ${feature.color} rounded-full`}></div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <div className="space-y-2">
                {feature.bars.map((width, barIndex) => (
                  <div
                    key={barIndex}
                    className="h-4 bg-slate-200 dark:bg-slate-800 rounded"
                    style={{ width: `${width}%` }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Subtle Image Overlay to hint at dashboard */}
        <div className="mt-8 relative h-64 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background-dark/80 backdrop-blur px-6 py-3 rounded-full border border-white/10 text-white font-medium flex items-center gap-2">
              <span className="material-symbols-outlined">visibility</span>
              Preview Analysis Report
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
