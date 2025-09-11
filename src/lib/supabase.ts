import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Create Supabase client for server-side usage with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (you can generate these with: npx supabase gen types typescript --project-id chkbamuurntcmhgraxrh)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          avatar: string | null
          role: 'CLIENT' | 'PHOTOGRAPHER' | 'ADMIN'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          avatar?: string | null
          role?: 'CLIENT' | 'PHOTOGRAPHER' | 'ADMIN'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          avatar?: string | null
          role?: 'CLIENT' | 'PHOTOGRAPHER' | 'ADMIN'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      photographer_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          title: string | null
          bio: string | null
          location: string
          website: string | null
          portfolio_url: string | null
          instagram_handle: string | null
          years_experience: number
          is_verified: boolean
          is_available: boolean
          response_time: string | null
          total_clients: number
          average_rating: number
          total_reviews: number
          profile_image: string | null
          cover_image: string | null
          application_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
          application_date: string
          approved_at: string
          approved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          title?: string | null
          bio?: string | null
          location: string
          website?: string | null
          portfolio_url?: string | null
          instagram_handle?: string | null
          years_experience?: number
          is_verified?: boolean
          is_available?: boolean
          response_time?: string | null
          total_clients?: number
          average_rating?: number
          total_reviews?: number
          profile_image?: string | null
          cover_image?: string | null
          application_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
          application_date?: string
          approved_at?: string
          approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          title?: string | null
          bio?: string | null
          location?: string
          website?: string | null
          portfolio_url?: string | null
          instagram_handle?: string | null
          years_experience?: number
          is_verified?: boolean
          is_available?: boolean
          response_time?: string | null
          total_clients?: number
          average_rating?: number
          total_reviews?: number
          profile_image?: string | null
          cover_image?: string | null
          application_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
          application_date?: string
          approved_at?: string
          approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Sign up new user
  async signUp(email: string, password: string, userData: { firstName: string; lastName: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  // Sign in user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get photographer profile
  async getPhotographerProfile(userId: string) {
    const { data, error } = await supabase
      .from('photographer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Create photographer profile
  async createPhotographerProfile(profileData: Database['public']['Tables']['photographer_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('photographer_profiles')
      .insert(profileData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update photographer profile
  async updatePhotographerProfile(id: string, updates: Database['public']['Tables']['photographer_profiles']['Update']) {
    const { data, error } = await supabase
      .from('photographer_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}




