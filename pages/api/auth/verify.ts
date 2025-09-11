import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { supabase } from '../../../src/lib/supabase'

const TOKEN_TTL_MINUTES = 30

function signToken(payload: any) {
  const secret = process.env.NEXTAUTH_SECRET || 'dev-secret'
  return jwt.sign(payload, secret, { expiresIn: `${TOKEN_TTL_MINUTES}m` })
}

function verifyToken(token: string) {
  const secret = process.env.NEXTAUTH_SECRET || 'dev-secret'
  return jwt.verify(token, secret) as any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Generate and send verification email link
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'email is required' })

    const token = signToken({ email })
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verifyUrl = `${baseUrl}/auth/email-verify?token=${token}`

    try {
      const { sendVerificationEmail } = await import('../../../src/utils/mailer')
      await sendVerificationEmail(email, verifyUrl)
      return res.status(200).json({ message: 'Verification email sent' })
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Failed to send email' })
    }
  }

  if (req.method === 'GET') {
    // Verify token and mark user as verified
    const { token } = req.query
    if (!token || typeof token !== 'string') return res.status(400).send('Invalid token')

    try {
      const payload = verifyToken(token)
      const email = payload.email as string

      // Optionally update user metadata or custom users table
      await supabase
        .from('users')
        .update({ is_active: true })
        .eq('email', email)

      // Redirect to profile setup
      const redirect = encodeURI((process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/profile/setup')
      res.writeHead(302, { Location: redirect })
      res.end()
      return
    } catch (e) {
      return res.status(400).send('Verification link invalid or expired')
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


