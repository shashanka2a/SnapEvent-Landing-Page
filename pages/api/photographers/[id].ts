import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../src/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    return getPhotographerProfile(req, res, id as string)
  } else if (req.method === 'PUT') {
    return updatePhotographerProfile(req, res, id as string)
  } else if (req.method === 'DELETE') {
    return deletePhotographerProfile(req, res, id as string)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getPhotographerProfile(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { data: profile, error } = await supabase
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
          name,
          description
        ),
        services (
          id,
          name,
          description,
          price,
          duration,
          deliverables
        ),
        portfolio_items (
          id,
          title,
          description,
          image_url,
          category,
          tags,
          is_featured
        ),
        awards (
          id,
          title,
          organization,
          year,
          description
        ),
        testimonials (
          id,
          client_name,
          event_type,
          rating,
          comment,
          is_approved
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Photographer profile not found' })
    }

    return res.status(200).json({ profile })

  } catch (error) {
    console.error('Get photographer profile error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function updatePhotographerProfile(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const {
      businessName,
      title,
      bio,
      location,
      website,
      instagramHandle,
      yearsExperience,
      isAvailable,
      responseTime
    } = req.body

    const updateData: any = {}
    
    if (businessName !== undefined) updateData.business_name = businessName
    if (title !== undefined) updateData.title = title
    if (bio !== undefined) updateData.bio = bio
    if (location !== undefined) updateData.location = location
    if (website !== undefined) updateData.website = website
    if (instagramHandle !== undefined) updateData.instagram_handle = instagramHandle
    if (yearsExperience !== undefined) updateData.years_experience = yearsExperience
    if (isAvailable !== undefined) updateData.is_available = isAvailable
    if (responseTime !== undefined) updateData.response_time = responseTime

    const { data: profile, error } = await supabase
      .from('photographer_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({
      message: 'Photographer profile updated successfully',
      profile
    })

  } catch (error) {
    console.error('Update photographer profile error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function deletePhotographerProfile(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { error } = await supabase
      .from('photographer_profiles')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({
      message: 'Photographer profile deleted successfully'
    })

  } catch (error) {
    console.error('Delete photographer profile error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


