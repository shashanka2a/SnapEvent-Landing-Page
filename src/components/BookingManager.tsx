"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { cn } from './ui/utils';
import { format } from 'date-fns';

interface Booking {
  id: string;
  clientId: string;
  photographerId: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  totalAmount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface BookingManagerProps {
  photographerId: string;
  onClose: () => void;
}

export function BookingManager({ photographerId, onClose }: BookingManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch bookings for the photographer
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/bookings?photographerId=${photographerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Fallback to mock data for demo
        setBookings([
          {
            id: '1',
            clientId: 'client-1',
            photographerId,
            eventType: 'Wedding',
            eventDate: '2024-02-15',
            eventTime: '10:00 AM',
            eventLocation: 'Golden Gate Park, San Francisco',
            totalAmount: 350,
            clientName: 'John & Jane Doe',
            clientEmail: 'john@example.com',
            clientPhone: '+1 (555) 123-4567',
            notes: 'Outdoor wedding ceremony and reception. Please arrive 30 minutes early.',
            status: 'pending',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            clientId: 'client-2',
            photographerId,
            eventType: 'Portrait Session',
            eventDate: '2024-02-20',
            eventTime: '02:00 PM',
            eventLocation: 'Studio Location',
            totalAmount: 200,
            clientName: 'Sarah Johnson',
            clientEmail: 'sarah@example.com',
            clientPhone: '+1 (555) 987-6543',
            notes: 'Family portrait session with 4 people',
            status: 'confirmed',
            createdAt: '2024-01-10T14:30:00Z',
            updatedAt: '2024-01-12T09:15:00Z'
          },
          {
            id: '3',
            clientId: 'client-3',
            photographerId,
            eventType: 'Event Photography',
            eventDate: '2024-02-25',
            eventTime: '06:00 PM',
            eventLocation: 'Conference Center',
            totalAmount: 275,
            clientName: 'Mike Wilson',
            clientEmail: 'mike@example.com',
            clientPhone: '+1 (555) 456-7890',
            notes: 'Corporate event with 100+ attendees',
            status: 'declined',
            createdAt: '2024-01-08T16:45:00Z',
            updatedAt: '2024-01-09T11:20:00Z'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [photographerId]);

  const handleBookingStatusUpdate = async (bookingId: string, newStatus: 'confirmed' | 'declined') => {
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
          : booking
      ));

      // Close detail view if open
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null);
      }

      // Show success message
      alert(`Booking ${newStatus} successfully!`);
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: AlertCircle, color: 'text-yellow-600' },
      confirmed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      declined: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      cancelled: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-600' }
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const declinedBookings = bookings.filter(b => b.status === 'declined');

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading bookings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Booking Management</CardTitle>
            <p className="text-muted-foreground">Manage your booking requests and confirmations</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>

        <CardContent>
          {selectedBooking ? (
            // Booking Detail View
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Booking Details</h3>
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Back to List
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(selectedBooking.eventDate), 'EEEE, MMMM do, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.eventLocation}</span>
                    </div>
                    <div>
                      <strong>Event Type:</strong> {selectedBooking.eventType}
                    </div>
                    <div>
                      <strong>Total Amount:</strong> ${selectedBooking.totalAmount}
                    </div>
                    {selectedBooking.notes && (
                      <div>
                        <strong>Notes:</strong>
                        <p className="text-sm text-muted-foreground mt-1">{selectedBooking.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Client Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.clientEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.clientPhone}</span>
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                    </div>
                    <div>
                      <strong>Requested:</strong>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedBooking.createdAt), 'MMM do, yyyy \'at\' h:mm a')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              {selectedBooking.status === 'pending' && (
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => handleBookingStatusUpdate(selectedBooking.id, 'confirmed')}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Booking
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleBookingStatusUpdate(selectedBooking.id, 'declined')}
                    disabled={isUpdating}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline Booking
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Booking List View
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Pending ({pendingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Confirmed ({confirmedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="declined" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Declined ({declinedBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending booking requests</p>
                  </div>
                ) : (
                  pendingBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{booking.clientName}</h4>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.eventDate), 'MMM do, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.eventTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.eventType}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              ${booking.totalAmount} • {booking.eventLocation}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                              disabled={isUpdating}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleBookingStatusUpdate(booking.id, 'declined')}
                              disabled={isUpdating}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-4">
                {confirmedBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No confirmed bookings</p>
                  </div>
                ) : (
                  confirmedBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{booking.clientName}</h4>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.eventDate), 'MMM do, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.eventTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.eventType}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              ${booking.totalAmount} • {booking.eventLocation}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="declined" className="space-y-4">
                {declinedBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No declined bookings</p>
                  </div>
                ) : (
                  declinedBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{booking.clientName}</h4>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.eventDate), 'MMM do, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.eventTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.eventType}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              ${booking.totalAmount} • {booking.eventLocation}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
