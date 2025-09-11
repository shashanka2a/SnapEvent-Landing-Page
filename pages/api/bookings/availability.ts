import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { photographerId, date } = req.query;

    if (!photographerId || !date) {
      return res.status(400).json({ 
        error: 'Missing required parameters: photographerId and date' 
      });
    }

    // Check existing bookings for the photographer on the given date
    // Only check confirmed bookings to prevent double booking
    // Pending bookings can still be booked (photographer will decide)
    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('event_time, status')
      .eq('photographer_id', photographerId)
      .eq('event_date', date)
      .eq('status', 'confirmed');

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return res.status(500).json({ error: 'Failed to check availability' });
    }

    // Define available time slots
    const allTimeSlots = [
      { id: 'morning-1', time: '09:00 AM', price: 150 },
      { id: 'morning-2', time: '10:00 AM', price: 150 },
      { id: 'morning-3', time: '11:00 AM', price: 150 },
      { id: 'afternoon-1', time: '12:00 PM', price: 175 },
      { id: 'afternoon-2', time: '01:00 PM', price: 175 },
      { id: 'afternoon-3', time: '02:00 PM', price: 175 },
      { id: 'afternoon-4', time: '03:00 PM', price: 175 },
      { id: 'evening-1', time: '04:00 PM', price: 200 },
      { id: 'evening-2', time: '05:00 PM', price: 200 },
      { id: 'evening-3', time: '06:00 PM', price: 200 },
    ];

    // Get booked times
    const bookedTimes = existingBookings?.map(booking => booking.event_time) || [];

    // Mark slots as available/unavailable
    const availability = allTimeSlots.map(slot => ({
      ...slot,
      available: !bookedTimes.includes(slot.time)
    }));

    return res.status(200).json({
      date,
      photographerId,
      availability,
      totalSlots: allTimeSlots.length,
      availableSlots: availability.filter(slot => slot.available).length
    });

  } catch (error) {
    console.error('Availability check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
