import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../src/lib/supabase'
import { withValidation, commonValidations } from '../../../src/middleware/validation'

async function signupHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password, firstName, lastName, phone, role = 'CLIENT' } = req.body

    // Sign up user with Supabase Auth (email verification enabled in Supabase)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null
        }
      }
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Failed to create user' })
    }

    // Create user profile in our custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role: role.toUpperCase()
      })
      .select()
      .single()

    if (userError) {
      // If user creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return res.status(400).json({ error: userError.message })
    }

    return res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default withValidation([
  commonValidations.email,
  commonValidations.password,
  commonValidations.firstName,
  commonValidations.lastName,
  commonValidations.phone
])(signupHandler)
