import dynamic from 'next/dynamic'
import { useState } from 'react'

// Lazy-load your existing onboarding/portfolio builder component
// Adjust the import path if needed based on your repo
const PortfolioPage = dynamic(() => import('../src/components/PortfolioPage').then(mod => ({ default: mod.PortfolioPage })), {
  ssr: false,
})

export default function OnboardingPage() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'onboarding' | 'portfolio'>('onboarding')
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('default-photographer')

  const handleNavigate = (page: 'landing' | 'onboarding' | 'portfolio', photographerId?: string) => {
    setCurrentPage(page)
    if (photographerId) {
      setSelectedPhotographerId(photographerId)
    }
  }

  return <PortfolioPage photographerId={selectedPhotographerId} onNavigate={handleNavigate} />
}


