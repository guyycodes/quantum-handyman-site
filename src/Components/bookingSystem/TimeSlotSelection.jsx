import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import googleCalendarService from '../../services/googleCalendarService';

// Content Management - All text content in one place
const CONTENT = {
  title: 'Choose Your Time Slot',
  serviceInfo: {
    serviceLabel: 'Service:',
    dateLabel: 'Date:',
    hourSuffix: (hours) => hours > 1 ? 'hours' : 'hour',
    dateFormat: {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }
  },
  timePreferences: {
    filterLabel: 'Filter by time of day:',
    options: [
      { id: 'any', label: 'Any Time', icon: '🕐' },
      { id: 'morning', label: 'Morning', icon: '🌅', description: '8 AM - 12 PM' },
      { id: 'afternoon', label: 'Afternoon', icon: '☀️', description: '12 PM - 5 PM' },
      { id: 'evening', label: 'Evening', icon: '🌆', description: '5 PM - 8 PM' }
    ]
  },
  availability: {
    unavailable: 'Unavailable',
    noSlots: 'No time slots available for this preference.',
    showAll: 'Show all available times'
  },
  selectedTime: {
    prefix: '✅ Selected Time:'
  },
  emergency: {
    title: '🚨 Need Emergency Service?',
    message: 'Call us directly at',
    phone: '(555) 123-4567',
    suffix: 'for immediate assistance.'
  }
};

const TimeSlotSelection = ({ onTimeSelect, selectedDate, selectedTime, service }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timePreference, setTimePreference] = useState('any'); // 'morning', 'afternoon', 'evening', 'any'
  const [isLoading, setIsLoading] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    const duration = service?.duration || 2;
    const selectedDay = new Date(selectedDate + 'T00:00:00').getDay();
    
    // Different hours for different days
    let startHour = 8;
    let endHour = 18;
    
    // Saturday hours
    if (selectedDay === 6) {
      startHour = 9;
      endHour = 16;
    }
    
    // Generate slots based on service duration
    for (let hour = startHour; hour <= endHour - duration; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // 30-minute intervals
        const endHour = hour + duration;
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Skip slots that would end after business hours
        if (endHour > endHour) continue;
        
        // All slots are available by default (will be filtered by Google Calendar)
        const isAvailable = true;
        
        slots.push({
          start: startTime,
          end: endTime,
          display: formatTime(startTime) + ' - ' + formatTime(endTime),
          value: startTime,
          period: getTimePeriod(hour),
          isAvailable
        });
      }
    }
    
    return slots;
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const getTimePeriod = (hour) => {
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  useEffect(() => {
    const loadAvailability = async () => {
      if (!selectedDate || !service) return;
      
      setIsLoading(true);
      try {
        // Use real Google Calendar availability
        const slots = await googleCalendarService.checkAvailability(
          selectedDate,
          service.duration
        );
        
        // Transform slots to match component format
        const formattedSlots = slots.map(slot => ({
          start: slot.value,
          end: '', // Will be set by display
          display: slot.display,
          value: slot.value,
          period: getTimePeriod(parseInt(slot.value.split(':')[0])),
          isAvailable: slot.isAvailable
        }));
        
        setAvailableSlots(formattedSlots);
      } catch (error) {
        console.error('Error loading availability:', error);
        // Fallback to generated slots without Math.random()
        setAvailableSlots(generateTimeSlots());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvailability();
  }, [selectedDate, service]);

  const filteredSlots = timePreference === 'any' 
    ? availableSlots 
    : availableSlots.filter(slot => slot.period === timePreference);

  const timePreferences = CONTENT.timePreferences.options;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-600" />
        {CONTENT.title}
      </h3>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          {CONTENT.serviceInfo.serviceLabel} <strong>{service?.name}</strong> ({service?.duration} {CONTENT.serviceInfo.hourSuffix(service?.duration || 1)})
        </p>
        <p className="text-gray-600">
          {CONTENT.serviceInfo.dateLabel} <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', CONTENT.serviceInfo.dateFormat)}</strong>
        </p>
      </div>

      {/* Time preference filter */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">{CONTENT.timePreferences.filterLabel}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timePreferences.map((pref) => (
            <button
              key={pref.id}
              onClick={() => setTimePreference(pref.id)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${timePreference === pref.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-1">{pref.icon}</div>
              <div className="text-sm font-medium text-gray-900">{pref.label}</div>
              {pref.description && (
                <div className="text-xs text-gray-500">{pref.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Checking availability...</p>
          </div>
        ) : filteredSlots.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredSlots.map((slot) => (
              <button
                key={slot.value}
                onClick={() => slot.isAvailable && onTimeSelect(slot)}
                disabled={!slot.isAvailable}
                className={`
                  p-3 rounded-lg border-2 transition-all text-sm font-medium
                  ${selectedTime?.value === slot.value
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-md'
                    : slot.isAvailable
                      ? 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                  }
                `}
              >
                {slot.display}
                {!slot.isAvailable && (
                  <span className="block text-xs mt-1 font-normal">{CONTENT.availability.unavailable}</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{CONTENT.availability.noSlots}</p>
            <button
              onClick={() => setTimePreference('any')}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              {CONTENT.availability.showAll}
            </button>
          </div>
        )}
      </div>

      {/* Selected time display */}
      {selectedTime && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            {CONTENT.selectedTime.prefix} {selectedTime.display}
          </p>
        </div>
      )}

      {/* Emergency notice */}
      {service?.id === 'custom' && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-800 text-sm">
            <strong>{CONTENT.emergency.title}</strong> {CONTENT.emergency.message}{' '}
            <a href={`tel:${CONTENT.emergency.phone.replace(/[^0-9]/g, '')}`} className="font-bold underline">{CONTENT.emergency.phone}</a>{' '}
            {CONTENT.emergency.suffix}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelection;
