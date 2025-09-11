import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../src/lib/supabase'

// Lazy-load the generalized signup flow
const GeneralizedSignupFlow = dynamic(() => import('../src/components/GeneralizedSignupFlow').then(mod => ({ default: mod.GeneralizedSignupFlow })), {
  ssr: false,
})

// Lazy-load the user type selection
const UserTypeSelection = dynamic(() => import('../src/components/UserTypeSelection').then(mod => ({ default: mod.UserTypeSelection })), {
  ssr: false,
})

export default function SignupPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleSignupComplete = (userType: 'CLIENT' | 'PHOTOGRAPHER') => {
    if (userType === 'PHOTOGRAPHER') {
      // Navigate to portfolio for photographers
      router.push('/onboarding')
    } else {
      // Navigate back to landing for clients
      router.push('/')
    }
  }

  const handleUserTypeSelect = async (userType: 'CLIENT' | 'PHOTOGRAPHER') => {
    try {
      // Update user role in database
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: userType
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      handleSignupComplete(userType)
    } catch (error) {
      console.error('Error updating user role:', error)
      // Still proceed with the flow even if role update fails
      handleSignupComplete(userType)
    }
  }

  const handleBack = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    )
  }

  // If user is already authenticated and step is userType, show user type selection
  if (isAuthenticated && router.query.step === 'userType') {
    return (
      <UserTypeSelection 
        onUserTypeSelect={handleUserTypeSelect}
        onBack={handleBack}
      />
    )
  }

  // If user is not authenticated, show full signup flow
  if (!isAuthenticated) {
    return (
      <GeneralizedSignupFlow 
        onComplete={handleSignupComplete}
        onBack={handleBack}
      />
    )
  }

  // If authenticated but no step specified, redirect to user type selection
  useEffect(() => {
    if (isAuthenticated && !router.query.step) {
      router.replace('/signup?step=userType')
    }
  }, [isAuthenticated, router])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>Redirecting...</p>
    </div>
  )
}
