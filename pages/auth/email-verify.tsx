import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function EmailVerifyPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const token = router.query.token
      if (!token || typeof token !== 'string') return
      try {
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
        if (res.redirected) return
        if (res.ok) {
          router.replace('/profile/setup')
        } else {
          router.replace('/auth/signin?error=verify')
        }
      } catch {
        router.replace('/auth/signin?error=verify')
      }
    }
    run()
  }, [router])

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <p>Verifying your email...</p>
    </div>
  )
}


