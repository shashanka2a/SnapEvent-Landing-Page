import dynamic from 'next/dynamic'
import { useState } from 'react'

const PortfolioPage = dynamic(() => import('../../src/components/PortfolioPage').then(mod => ({ default: mod.PortfolioPage })), { ssr: false })

export default function ProfileSetup() {
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


