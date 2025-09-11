import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../src/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { role } = req.body

    if (!role || !['CLIENT', 'PHOTOGRAPHER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be CLIENT or PHOTOGRAPHER' })
    }

    // Get the current user from the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Update user role in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({ role: role })
      .eq('id', session.user.id)
      .select()
      .single()

    if (userError) {
      return res.status(400).json({ error: userError.message })
    }

    return res.status(200).json({
      message: 'User role updated successfully',
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role
      }
    })

  } catch (error) {
    console.error('Update role error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
