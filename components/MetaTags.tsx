interface MetaTag {
  icon: string
  text: string
  color: string
}

const tags: MetaTag[] = [
  { icon: 'check_circle', text: 'Public Repos', color: 'text-green-500' },
  { icon: 'lock', text: 'Private Repos', color: 'text-blue-500' },
  { icon: 'history', text: 'Historical Analysis', color: 'text-purple-500' },
]

export default function MetaTags() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 text-slate-500 dark:text-slate-500 text-sm font-medium">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className={`material-symbols-outlined ${tag.color} text-lg`}>{tag.icon}</span>
          {tag.text}
        </div>
      ))}
    </div>
  )
}
