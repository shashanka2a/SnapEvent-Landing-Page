import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client for API routes
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Admin client for server-side operations that require elevated privileges
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Helper functions for server-side operations
export const serverSupabaseHelpers = {
  // Get user from server-side
  async getUser() {
    const supabase = createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Get user with profile data
  async getUserWithProfile() {
    const supabase = createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    
    if (!user) return null

    // Get user profile from your custom users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    return { user, profile }
  },

  // Admin operations
  async adminGetAllUsers() {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async adminGetAllPhotographers() {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('photographer_profiles')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name,
          avatar
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async adminUpdateUserStatus(userId: string, isActive: boolean) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
