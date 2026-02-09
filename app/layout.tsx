import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RepoCheck - Free GitHub Repository Health Checker',
  description: 'Instantly assess GitHub repository health, risks, and maintainability. Get actionable insights on bus factor, dependencies, documentation, and more. Free, no login required.',
  keywords: ['github', 'repository health', 'code quality', 'maintainability', 'bus factor', 'technical debt', 'open source'],
  authors: [{ name: 'Afkhan Fardeen Khan' }],
  openGraph: {
    title: 'RepoCheck - Free GitHub Repository Health Checker',
    description: 'Instantly assess GitHub repository health, risks, and maintainability.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RepoCheck - Free GitHub Repository Health Checker',
    description: 'Instantly assess GitHub repository health, risks, and maintainability.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
