'use client'

import { useState, useEffect } from 'react'

const loadingMessages = [
  'Analyzing contributors...',
  'Checking dependencies...',
  'Evaluating maintenance patterns...',
  'Reviewing documentation...',
  'Assessing risk factors...',
]

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <div className="space-y-2">
          <p className="text-gray-900 dark:text-white font-medium">{loadingMessages[messageIndex]}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">This may take a few moments</p>
        </div>
      </div>
    </div>
  )
}
