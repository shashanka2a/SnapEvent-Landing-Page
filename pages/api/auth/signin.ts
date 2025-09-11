import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../src/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, password' 
      })
    }

    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return res.status(401).json({ error: authError.message })
    }

    if (!authData.user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Get user profile from our custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    return res.status(200).json({
      message: 'Sign in successful',
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        avatar: userData.avatar
      },
      session: authData.session
    })

  } catch (error) {
    console.error('Signin error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


