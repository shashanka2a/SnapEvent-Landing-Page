import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/router'

// Lazy-load the generalized signup flow
const GeneralizedSignupFlow = dynamic(() => import('../src/components/GeneralizedSignupFlow').then(mod => ({ default: mod.GeneralizedSignupFlow })), {
  ssr: false,
})

export default function SignupPage() {
  const router = useRouter()

  const handleSignupComplete = (userType: 'CLIENT' | 'PHOTOGRAPHER') => {
    if (userType === 'PHOTOGRAPHER') {
      // Navigate to portfolio for photographers
      router.push('/onboarding')
    } else {
      // Navigate back to landing for clients
      router.push('/')
    }
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <GeneralizedSignupFlow 
      onComplete={handleSignupComplete}
      onBack={handleBack}
    />
  )
}
