/**
 * Google Apps Script Service
 * For use in non-React contexts (services, utilities, etc.)
 */
class GoogleScriptService {
  constructor() {
    this.scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  }

  /**
   * Check if the service is configured
   */
  isConfigured() {
    return Boolean(this.scriptUrl);
  }

  /**
   * Generic API call to Google Apps Script
   */
  async callGoogleScript(payload) {
    if (!this.scriptUrl) {
      throw new Error('Google Apps Script URL not configured');
    }

    const response = await fetch(this.scriptUrl, {
      method: 'POST',
      // DO NOT set Content-Type header to avoid CORS preflight with Google Apps Script
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Google Script API error: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Create Stripe checkout session
   */
  async createStripeCheckoutSession(sessionData) {
    return this.callGoogleScript({
      action: 'createStripeCheckoutSession',
      ...sessionData
    });
  }

  /**
   * Calendar availability check
   */
  async checkCalendarAvailability(dateInfo) {
    return this.callGoogleScript({
      action: 'checkAvailability',
      ...dateInfo
    });
  }

  /**
   * Create calendar booking
   */
  async createCalendarBooking(bookingData) {
    return this.callGoogleScript({
      action: 'createBooking',
      ...bookingData
    });
  }

  /**
   * Create estimate
   */
  async createEstimate(estimateData) {
    return this.callGoogleScript({
      action: 'createEstimate',
      ...estimateData
    });
  }

  /**
   * Send estimate email
   */
  async sendEstimateEmail(emailData) {
    return this.callGoogleScript({
      action: 'sendEstimateEmail',
      ...emailData
    });
  }

  /**
   * Create service booking
   */
  async createServiceBooking(bookingData) {
    return this.callGoogleScript({
      action: 'createServiceBooking',
      ...bookingData
    });
  }

  /**
   * Lookup by reference
   */
  async lookupByReference(reference) {
    return this.callGoogleScript({
      action: 'lookupByReference',
      reference: reference
    });
  }

  /**
   * Test connection
   */
  async testConnection() {
    return this.callGoogleScript({
      action: 'testConnection'
    });
  }
}

// Export singleton instance
const googleScriptService = new GoogleScriptService();
export default googleScriptService;
