import axios from 'axios';

// Google Calendar Service for Quantum Handyman
class GoogleCalendarService {
  constructor() {
    this.scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    this.isConfigured = !!this.scriptUrl;
    this.debug = import.meta.env.DEV; // Enable debug in development
  }

  // Debug logging
  log(...args) {
    if (this.debug) {
      console.log('[GoogleCalendar]', ...args);
    }
  }

  // Check if service is properly configured
  validateConfiguration() {
    if (!this.isConfigured) {
      console.error('Google Script URL not configured. Add VITE_GOOGLE_SCRIPT_URL to .env');
      return false;
    }
    return true;
  }

  // Test connection to Apps Script
  async testConnection() {
    if (!this.validateConfiguration()) {
      return { success: false, error: 'Not configured' };
    }

    try {
      this.log('Testing connection to Apps Script...');
      const response = await axios.post(this.scriptUrl, {
        action: 'testConnection'
      });
      
      this.log('Connection test response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Check calendar availability for a specific date
  async checkAvailability(date, duration = 2) {
    if (!this.validateConfiguration()) {
      // Return mock data if not configured
      this.log('Using mock data - Google Calendar not configured');
      return this.getMockAvailability(date, duration);
    }

    try {
      this.log('Checking availability for:', date, 'Duration:', duration);
      
      const response = await axios.post(this.scriptUrl, {
        action: 'checkAvailability',
        date: date,
        duration: duration
      });

      if (response.data.success) {
        this.log('Availability response:', response.data);
        return response.data.availableSlots || [];
      } else {
        console.error('Availability check failed:', response.data.error);
        return this.getMockAvailability(date, duration);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      // Fallback to mock data
      return this.getMockAvailability(date, duration);
    }
  }

  // Create a booking
  async createBooking(bookingData) {
    if (!this.validateConfiguration()) {
      throw new Error('Google Calendar service not configured');
    }

    try {
      this.log('Creating booking:', bookingData);
      
      const response = await axios.post(this.scriptUrl, {
        action: 'createBooking',
        booking: {
          name: bookingData.customerInfo.name,
          email: bookingData.customerInfo.email,
          phone: bookingData.customerInfo.phone,
          address: bookingData.customerInfo.address,
          service: bookingData.service.name,
          price: bookingData.service.price,
          duration: bookingData.service.duration,
          date: bookingData.date,
          time: bookingData.timeSlot.value,
          description: bookingData.customerInfo.projectDescription || bookingData.customerInfo.jobDescription || '',
          images: bookingData.customerInfo.images || ''
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Booking failed');
      }

      this.log('Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Generate mock availability (fallback when API not configured)
  getMockAvailability(date, duration) {
    console.warn('Using mock availability data - Google Calendar not connected');
    const slots = [];
    
    // Check if it's a weekend
    const dayOfWeek = new Date(date + 'T00:00:00').getDay();
    if (dayOfWeek === 0) { // Sunday - no availability except for emergency
      return slots;
    }

    // Saturday has limited hours (9 AM - 4 PM)
    const startHour = dayOfWeek === 6 ? 9 : 8;
    const endHour = dayOfWeek === 6 ? 16 : 18;
    
    for (let hour = startHour; hour <= endHour - duration; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip lunch hour (12-1 PM) on weekdays
        if (dayOfWeek !== 6 && hour === 12) continue;
        
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = hour + duration;
        const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Simulate some slots being unavailable (but predictably, not randomly!)
        // Make morning slots more available
        const isAvailable = hour < 12 ? true : hour % 2 === 0;
        
        if (isAvailable && endHour <= endHour) {
          slots.push({
            value: startTime,
            display: this.formatTimeRange(startTime, endTime),
            start: `${date}T${startTime}:00`,
            end: `${date}T${endTime}:00`,
            isAvailable: true
          });
        }
      }
    }
    
    return slots;
  }

  // Format time range for display
  formatTimeRange(start, end) {
    const formatTime = (time) => {
      const [hour, minute] = time.split(':').map(Number);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  }

  // Helper to format a single time
  formatTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }
}

// Export singleton instance
const googleCalendarService = new GoogleCalendarService();

// For debugging in development console
if (import.meta.env.DEV) {
  window.googleCalendarService = googleCalendarService;
}

export default googleCalendarService;
