import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HiArrowLeft } from 'react-icons/hi2'

export const metadata = {
  title: 'FAQ - RepoCheck GitHub Repository Health Checker',
  description: 'Frequently asked questions about RepoCheck.',
}

export default function FAQPage() {
  const faqs = [
    {
      question: 'Is it really free?',
      answer: 'Yes, completely free. No signup, no credit card, no limits.',
    },
    {
      question: 'Do you store my data?',
      answer: 'We cache results for 7 days to speed things up, but we don\'t track you or store personal info.',
    },
    {
      question: 'Why is my repo score low?',
      answer: 'Low scores usually mean: single maintainer, inactive maintenance, outdated dependencies, missing docs, or unclear ownership. Check the breakdown to see what to improve.',
    },
    {
      question: 'Is this a security audit?',
      answer: 'No. We check maintainability and risks, not security vulnerabilities. Use dedicated security tools for that.',
    },
    {
      question: 'Can I check private repos?',
      answer: 'No, only public repositories. This keeps the tool free and simple.',
    },
    {
      question: 'How accurate is the score?',
      answer: 'It\'s based on GitHub data and proven patterns. Use it as a starting point, not the final word. Every repo is different.',
    },
    {
      question: 'What if I get a rate limit error?',
      answer: 'GitHub limits API calls. Wait a few minutes and try again. We also limit requests per IP to be fair to everyone.',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">FAQ</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12">
          Common questions about RepoCheck
        </p>

        <div className="space-y-6 sm:space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-6 sm:pb-8 last:border-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">{faq.question}</h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="pt-8 sm:pt-12 border-t border-gray-200 dark:border-gray-800 mt-8 sm:mt-12">
          <Link
            href="/"
            className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-2 text-sm sm:text-base"
          >
            <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
