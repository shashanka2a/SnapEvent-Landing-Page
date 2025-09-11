"use client";

import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from './ui/utils';
import { format, isSameDay, isBefore } from 'date-fns';

interface AvailabilityManagerProps {
  photographerId: string;
  onClose: () => void;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
  timeSlots?: string[];
}

export function AvailabilityManager({ photographerId, onClose }: AvailabilityManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock blocked dates - in real app, this would come from API
  useEffect(() => {
    // Simulate loading blocked dates
    setBlockedDates([
      { id: '1', date: '2024-01-15', reason: 'Personal vacation' },
      { id: '2', date: '2024-01-20', reason: 'Equipment maintenance' },
    ]);
  }, []);

  const handleBlockDate = async () => {
    if (!selectedDate) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const reason = prompt('Reason for blocking this date:') || 'Unavailable';

    setIsLoading(true);
    
    try {
      // In real app, this would call your API
      const newBlockedDate: BlockedDate = {
        id: Date.now().toString(),
        date: dateStr,
        reason
      };

      setBlockedDates(prev => [...prev, newBlockedDate]);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Failed to block date:', error);
      alert('Failed to block date. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockDate = async (blockedDateId: string) => {
    setIsLoading(true);
    
    try {
      // In real app, this would call your API
      setBlockedDates(prev => prev.filter(date => date.id !== blockedDateId));
    } catch (error) {
      console.error('Failed to unblock date:', error);
      alert('Failed to unblock date. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedDates.some(blocked => blocked.date === dateStr);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today) || isDateBlocked(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Manage Availability</CardTitle>
            <p className="text-muted-foreground">Block or unblock dates for bookings</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Calendar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date to Block
            </h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md border"
                modifiers={{
                  blocked: blockedDates.map(bd => new Date(bd.date))
                }}
                modifiersStyles={{
                  blocked: { backgroundColor: '#ef4444', color: 'white' }
                }}
              />
            </div>
            
            {selectedDate && !isDateBlocked(selectedDate) && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleBlockDate}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? 'Blocking...' : 'Block This Date'}
                </Button>
              </div>
            )}
          </div>

          {/* Blocked Dates List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Blocked Dates</h3>
            {blockedDates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No blocked dates. All dates are available for booking.
              </p>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((blockedDate) => (
                  <div
                    key={blockedDate.id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-red-900">
                        {format(new Date(blockedDate.date), 'EEEE, MMMM do, yyyy')}
                      </p>
                      <p className="text-sm text-red-700">{blockedDate.reason}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnblockDate(blockedDate.id)}
                      disabled={isLoading}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Unblock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Legend</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Blocked dates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Past dates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span>Available dates</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
