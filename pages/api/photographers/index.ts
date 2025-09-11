import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../src/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getPhotographers(req, res)
  } else if (req.method === 'POST') {
    return createPhotographerProfile(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getPhotographers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { location, specialty, minRating, limit = 20, offset = 0 } = req.query

    let query = supabase
      .from('photographer_profiles')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name,
          avatar
        ),
        specialties (
          id,
          name
        )
      `)
      .eq('application_status', 'APPROVED')
      .eq('is_available', true)
      .order('average_rating', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    if (minRating) {
      query = query.gte('average_rating', Number(minRating))
    }

    if (specialty) {
      query = query.contains('specialties', [{ name: specialty }])
    }

    const { data: photographers, error } = await query

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({
      photographers,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: photographers?.length || 0
      }
    })

  } catch (error) {
    console.error('Get photographers error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function createPhotographerProfile(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      userId,
      businessName,
      title,
      bio,
      location,
      website,
      instagramHandle,
      yearsExperience,
      specialties,
      services
    } = req.body

    // Validate required fields
    if (!userId || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, location' 
      })
    }

    // Create photographer profile
    const { data: profileData, error: profileError } = await supabase
      .from('photographer_profiles')
      .insert({
        user_id: userId,
        business_name: businessName,
        title,
        bio,
        location,
        website,
        instagram_handle: instagramHandle,
        years_experience: yearsExperience || 0
      })
      .select()
      .single()

    if (profileError) {
      return res.status(400).json({ error: profileError.message })
    }

    // Add specialties if provided
    if (specialties && specialties.length > 0) {
      const specialtyInserts = specialties.map((specialtyId: string) => ({
        photographer_id: profileData.id,
        specialty_id: specialtyId
      }))

      const { error: specialtyError } = await supabase
        .from('photographer_specialties')
        .insert(specialtyInserts)

      if (specialtyError) {
        console.error('Specialty insert error:', specialtyError)
      }
    }

    // Add services if provided
    if (services && services.length > 0) {
      const serviceInserts = services.map((service: any) => ({
        photographer_id: profileData.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        deliverables: service.deliverables
      }))

      const { error: serviceError } = await supabase
        .from('services')
        .insert(serviceInserts)

      if (serviceError) {
        console.error('Service insert error:', serviceError)
      }
    }

    return res.status(201).json({
      message: 'Photographer profile created successfully',
      profile: profileData
    })

  } catch (error) {
    console.error('Create photographer profile error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


