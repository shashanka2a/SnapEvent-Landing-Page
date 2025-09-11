import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../src/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getBookings(req, res)
  } else if (req.method === 'POST') {
    return createBooking(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getBookings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, photographerId, status, limit = 20, offset = 0 } = req.query

    let query = supabase
      .from('bookings')
      .select(`
        *,
        client:users!bookings_client_id_fkey (
          id,
          email,
          first_name,
          last_name,
          avatar
        ),
        photographer:photographer_profiles!bookings_photographer_id_fkey (
          id,
          business_name,
          title,
          location,
          users (
            id,
            first_name,
            last_name,
            avatar
          )
        ),
        service:services (
          id,
          name,
          description,
          price,
          duration
        )
      `)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    // Apply filters
    if (userId) {
      query = query.eq('client_id', userId)
    }

    if (photographerId) {
      query = query.eq('photographer_id', photographerId)
    }

    if (status) {
      const statusValue = Array.isArray(status) ? status[0] : status
      query = query.eq('status', statusValue.toUpperCase())
    }

    const { data: bookings, error } = await query

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({
      bookings,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: bookings?.length || 0
      }
    })

  } catch (error) {
    console.error('Get bookings error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function createBooking(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      clientId,
      photographerId,
      serviceId,
      eventType,
      eventDate,
      eventTime,
      eventLocation,
      duration,
      guestCount,
      specialRequests,
      totalAmount,
      depositAmount,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      status = 'pending'
    } = req.body

    // Validate required fields
    if (!clientId || !photographerId || !eventType || !eventDate || !eventLocation || !totalAmount) {
      return res.status(400).json({ 
        error: 'Missing required fields: clientId, photographerId, eventType, eventDate, eventLocation, totalAmount' 
      })
    }

    // Check for conflicts with confirmed bookings
    if (eventTime) {
      const { data: conflictingBookings, error: conflictError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('photographer_id', photographerId)
        .eq('event_date', eventDate)
        .eq('event_time', eventTime)
        .eq('status', 'confirmed');

      if (conflictError) {
        console.error('Error checking for conflicts:', conflictError);
        return res.status(500).json({ error: 'Failed to check for booking conflicts' });
      }

      if (conflictingBookings && conflictingBookings.length > 0) {
        return res.status(409).json({ 
          error: 'This time slot is already booked' 
        });
      }
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        client_id: clientId,
        photographer_id: photographerId,
        service_id: serviceId,
        event_type: eventType,
        event_date: eventDate,
        event_time: eventTime,
        event_location: eventLocation,
        duration,
        guest_count: guestCount,
        special_requests: specialRequests,
        total_amount: totalAmount,
        deposit_amount: depositAmount || 0,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        notes: notes,
        status: status
      })
      .select(`
        *,
        client:users!bookings_client_id_fkey (
          id,
          email,
          first_name,
          last_name
        ),
        photographer:photographer_profiles!bookings_photographer_id_fkey (
          id,
          business_name,
          title,
          users (
            id,
            first_name,
            last_name
          )
        )
      `)
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Create notification for photographer
    await supabase
      .from('notifications')
      .insert({
        user_id: photographerId,
        title: 'New Booking Request',
        message: `You have a new booking request for ${eventType} on ${eventDate}`,
        type: 'BOOKING_REQUEST',
        action_url: `/bookings/${booking.id}`
      })

    return res.status(201).json({
      message: 'Booking created successfully',
      booking
    })

  } catch (error) {
    console.error('Create booking error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


