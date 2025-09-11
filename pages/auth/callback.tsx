import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../src/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      // Supabase handles the token from the URL automatically in the client
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      // If session exists after verification, redirect to user type selection
      if (!error && session) {
        // Check if user already has a role set
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (userData?.role === 'PHOTOGRAPHER') {
          router.replace('/onboarding')
        } else if (userData?.role === 'CLIENT') {
          router.replace('/')
        } else {
          // No role set, go to user type selection
          router.replace('/signup?step=userType')
        }
        return
      }

      // Fallback: try exchanging code from URL (if present)
      const hash = window.location.hash
      if (hash.includes('access_token')) {
        // Session should be set; attempt redirect regardless
        router.replace('/signup?step=userType')
      } else {
        // If no token found, send to signin
        router.replace('/auth/signin')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>Finalizing sign-in... One moment.</p>
    </div>
  )
}


