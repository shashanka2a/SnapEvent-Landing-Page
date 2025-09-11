import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getBooking(req, res, id);
      case 'PATCH':
        return await updateBooking(req, res, id);
      case 'DELETE':
        return await deleteBooking(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getBooking(req: NextApiRequest, res: NextApiResponse, bookingId: string) {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
}

async function updateBooking(req: NextApiRequest, res: NextApiResponse, bookingId: string) {
  try {
    const { status, notes } = req.body;

    if (!status || !['pending', 'confirmed', 'declined', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: pending, confirmed, declined, cancelled' 
      });
    }

    // Check if booking exists
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // If confirming a booking, check for conflicts
    if (status === 'confirmed') {
      const { data: conflictingBookings, error: conflictError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('photographer_id', existingBooking.photographer_id)
        .eq('event_date', existingBooking.event_date)
        .eq('event_time', existingBooking.event_time)
        .in('status', ['confirmed', 'pending'])
        .neq('id', bookingId);

      if (conflictError) {
        console.error('Error checking for conflicts:', conflictError);
        return res.status(500).json({ error: 'Failed to check for booking conflicts' });
      }

      if (conflictingBookings && conflictingBookings.length > 0) {
        return res.status(409).json({ 
          error: 'Time slot is already booked or has a pending request' 
        });
      }
    }

    // Update the booking
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.photographer_notes = notes;
    }

    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return res.status(500).json({ error: 'Failed to update booking' });
    }

    // Send email notification to client
    try {
      await sendBookingStatusNotification(updatedBooking, status);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(200).json({ 
      booking: updatedBooking,
      message: `Booking ${status} successfully` 
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
}

async function deleteBooking(req: NextApiRequest, res: NextApiResponse, bookingId: string) {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error('Error deleting booking:', error);
      return res.status(500).json({ error: 'Failed to delete booking' });
    }

    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    return res.status(500).json({ error: 'Failed to delete booking' });
  }
}

async function sendBookingStatusNotification(booking: any, status: string) {
  // This would integrate with your email service
  // For now, we'll just log the notification
  console.log(`Email notification: Booking ${status} for ${booking.client_name} on ${booking.event_date} at ${booking.event_time}`);
  
  // In a real implementation, you would:
  // 1. Use your email service (Nodemailer, SendGrid, etc.)
  // 2. Send appropriate email based on status
  // 3. Include booking details and next steps
  
  const emailTemplates = {
    confirmed: {
      subject: `Booking Confirmed - ${booking.event_type} on ${booking.event_date}`,
      body: `Dear ${booking.client_name},\n\nYour booking for ${booking.event_type} on ${booking.event_date} at ${booking.event_time} has been confirmed!\n\nLocation: ${booking.event_location}\nTotal: $${booking.total_amount}\n\nWe look forward to working with you!\n\nBest regards,\nYour Photographer`
    },
    declined: {
      subject: `Booking Request Update - ${booking.event_type} on ${booking.event_date}`,
      body: `Dear ${booking.client_name},\n\nThank you for your interest in our photography services. Unfortunately, we are unable to accommodate your request for ${booking.event_type} on ${booking.event_date} at ${booking.event_time}.\n\nWe apologize for any inconvenience and hope to work with you in the future.\n\nBest regards,\nYour Photographer`
    }
  };

  const template = emailTemplates[status as keyof typeof emailTemplates];
  if (template) {
    console.log('Email template:', template);
  }
}
