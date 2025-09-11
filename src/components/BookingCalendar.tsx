"use client";

import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, User, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from './ui/utils';
import { format, addDays, isSameDay, isBefore, isAfter } from 'date-fns';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price?: number;
}

interface BookingCalendarProps {
  photographerId: string;
  photographerName: string;
  photographerLocation: string;
  photographerPhone: string;
  photographerEmail: string;
  onBookingSubmit: (bookingData: BookingData) => void;
  onClose: () => void;
}

interface BookingData {
  eventDate: string;
  eventTime: string;
  eventType: string;
  eventLocation: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalAmount: number;
  notes?: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning-1', time: '09:00 AM', available: true, price: 150 },
  { id: 'morning-2', time: '10:00 AM', available: true, price: 150 },
  { id: 'morning-3', time: '11:00 AM', available: true, price: 150 },
  { id: 'afternoon-1', time: '12:00 PM', available: true, price: 175 },
  { id: 'afternoon-2', time: '01:00 PM', available: true, price: 175 },
  { id: 'afternoon-3', time: '02:00 PM', available: true, price: 175 },
  { id: 'afternoon-4', time: '03:00 PM', available: true, price: 175 },
  { id: 'evening-1', time: '04:00 PM', available: true, price: 200 },
  { id: 'evening-2', time: '05:00 PM', available: true, price: 200 },
  { id: 'evening-3', time: '06:00 PM', available: true, price: 200 },
];

const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', basePrice: 200 },
  { id: 'portrait', name: 'Portrait Session', basePrice: 150 },
  { id: 'event', name: 'Event Photography', basePrice: 175 },
  { id: 'commercial', name: 'Commercial', basePrice: 250 },
];

export function BookingCalendar({
  photographerId,
  photographerName,
  photographerLocation,
  photographerPhone,
  photographerEmail,
  onBookingSubmit,
  onClose
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [eventLocation, setEventLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>(TIME_SLOTS);

  // Check availability from API
  const checkAvailability = async (date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/bookings/availability?photographerId=${photographerId}&date=${dateStr}`);
      
      if (!response.ok) {
        throw new Error('Failed to check availability');
      }
      
      const data = await response.json();
      return data.availability || TIME_SLOTS;
    } catch (error) {
      console.error('Error checking availability:', error);
      // Fallback to mock data if API fails
      const unavailableSlots = ['morning-1', 'afternoon-2', 'evening-1'];
      return TIME_SLOTS.map(slot => ({
        ...slot,
        available: !unavailableSlots.includes(slot.id)
      }));
    }
  };

  useEffect(() => {
    if (selectedDate) {
      checkAvailability(selectedDate).then(setAvailableTimeSlots);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedEventType || !clientInfo.name || !clientInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const eventType = EVENT_TYPES.find(et => et.id === selectedEventType);
      const totalAmount = eventType ? eventType.basePrice + (selectedTimeSlot.price || 0) : 0;

      const bookingData: BookingData = {
        eventDate: format(selectedDate, 'yyyy-MM-dd'),
        eventTime: selectedTimeSlot.time,
        eventType: eventType?.name || '',
        eventLocation: eventLocation || photographerLocation,
        clientName: clientInfo.name,
        clientEmail: clientInfo.email,
        clientPhone: clientInfo.phone,
        totalAmount,
        notes
      };

      // Submit to booking API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photographerId,
          clientId: 'temp-client-id', // In real app, this would come from auth
          eventType: bookingData.eventType,
          eventDate: bookingData.eventDate,
          eventTime: bookingData.eventTime,
          eventLocation: bookingData.eventLocation,
          totalAmount: bookingData.totalAmount,
          clientName: bookingData.clientName,
          clientEmail: bookingData.clientEmail,
          clientPhone: bookingData.clientPhone,
          notes: bookingData.notes,
          status: 'pending'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      await onBookingSubmit(bookingData);
    } catch (error) {
      console.error('Booking submission failed:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Book {photographerName}</CardTitle>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {photographerLocation}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Date Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Step 2: Time Slot Selection */}
          {selectedDate && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Select Time Slot
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableTimeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                    className={cn(
                      "h-12 flex flex-col items-center justify-center",
                      !slot.available && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => handleTimeSlotSelect(slot)}
                    disabled={!slot.available}
                  >
                    <span className="font-medium">{slot.time}</span>
                    {slot.price && (
                      <span className="text-xs text-muted-foreground">
                        ${slot.price}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Event Type Selection */}
          {selectedTimeSlot && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EVENT_TYPES.map((eventType) => (
                  <Button
                    key={eventType.id}
                    variant={selectedEventType === eventType.id ? "default" : "outline"}
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => setSelectedEventType(eventType.id)}
                  >
                    <span className="font-medium">{eventType.name}</span>
                    <span className="text-xs text-muted-foreground">
                      From ${eventType.basePrice}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Client Information */}
          {selectedEventType && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <input
                    type="text"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Event Location</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter event location"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {selectedDate && selectedTimeSlot && selectedEventType && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Booking Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Date:</span>
                <span>{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time:</span>
                <span>{selectedTimeSlot.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Event Type:</span>
                <span>{EVENT_TYPES.find(et => et.id === selectedEventType)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Location:</span>
                <span>{eventLocation || photographerLocation}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Total:</span>
                <span>
                  ${EVENT_TYPES.find(et => et.id === selectedEventType)?.basePrice || 0 + (selectedTimeSlot.price || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTimeSlot || !selectedEventType || !clientInfo.name || !clientInfo.email || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Booking...' : 'Book Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
