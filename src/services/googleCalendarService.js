// Google Calendar Service for Quantum Handyman
// Using fetch instead of axios to avoid CORS issues with Google Apps Script
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
      console.error('Google Calendar service not configured');
      return [];
    }

    try {
      this.log('Checking availability for:', date, 'Duration:', duration);
      
      // Use fetch instead of axios to avoid CORS preflight
      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'checkAvailability',
          date: date,
          duration: duration
        })
      });
      
      const data = await response.json();

      if (data.success) {
        this.log('Availability response:', data);
        return data.availableSlots || [];
      } else {
        console.error('Availability check failed:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      return [];
    }
  }

  // Create a booking
  async createBooking(bookingData) {
    if (!this.validateConfiguration()) {
      throw new Error('Google Calendar service not configured');
    }

    try {
      this.log('Creating booking:', bookingData);
      
      // Use fetch instead of axios to avoid CORS preflight
      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
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
            images: bookingData.customerInfo.images || '',
            bookingRef: bookingData.bookingRef
          }
        })
      });
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Booking failed');
      }

      this.log('Booking created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
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
