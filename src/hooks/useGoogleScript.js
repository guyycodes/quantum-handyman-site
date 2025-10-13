import { useState } from 'react';

/**
 * Custom hook for Google Apps Script API interactions
 * Handles all Google Script operations across the application
 */
const useGoogleScript = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  /**
   * Generic Google Apps Script API call
   * @param {Object} payload - The data to send to Google Apps Script
   * @param {boolean} skipLoading - Whether to skip setting loading state
   */
  const callGoogleScript = async (payload, skipLoading = false) => {
    if (!scriptUrl) {
      throw new Error('Google Apps Script URL not configured');
    }
    
    if (!skipLoading) {
      setLoading(true);
      setError('');
    }
    
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        // DO NOT set Content-Type header to avoid CORS preflight with Google Apps Script
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (!skipLoading) {
        setLoading(false);
      }
      
      return result;
    } catch (err) {
      console.error('Google Script API error:', err);
      if (!skipLoading) {
        setError('Unable to connect to the server. Please try again later.');
        setLoading(false);
      }
      return { success: false, error: err.message };
    }
  };

  /**
   * Portal Lookups
   */
  const lookupByReference = async (reference) => {
    return callGoogleScript({
      action: 'lookupByReference',
      reference: reference
    });
  };

  const lookupByEmail = async (email) => {
    return callGoogleScript({
      action: 'lookupByEmail',
      email: email
    });
  };

  /**
   * Stripe Payment Sessions
   */
  const createStripeCheckoutSession = async (sessionData) => {
    return callGoogleScript({
      action: 'createStripeCheckoutSession',
      ...sessionData
    }, true); // Skip loading state as components handle their own
  };

  /**
   * Calendar Operations
   */
  const checkCalendarAvailability = async (dateInfo) => {
    return callGoogleScript({
      action: 'checkAvailability',
      ...dateInfo
    }, true);
  };

  const createCalendarBooking = async (bookingData) => {
    return callGoogleScript({
      action: 'createBooking',
      ...bookingData
    }, true);
  };

  /**
   * Booking Operations
   */
  const createEstimateBooking = async (estimateData) => {
    return callGoogleScript({
      action: 'createEstimate',
      ...estimateData
    }, true);
  };

  const sendEstimateEmail = async (emailData) => {
    return callGoogleScript({
      action: 'sendEstimateEmail',
      ...emailData
    }, true);
  };

  const createServiceBooking = async (bookingData) => {
    return callGoogleScript({
      action: 'createServiceBooking',
      ...bookingData
    }, true);
  };

  /**
   * Add additional time to a job
   */
  const addAdditionalTime = async (jobData) => {
    return callGoogleScript({
      action: 'addAdditionalTime',
      ...jobData
    }, true);
  };

  /**
   * Get additional time cost for a job
   */
  const getAdditionalTimeCost = async (bookingReference) => {
    return callGoogleScript({
      action: 'getAdditionalTimeCost',
      bookingReference: bookingReference
    }, true);
  };

  /**
   * Add materials to a job
   */
  const addMaterials = async (materialsData) => {
    return callGoogleScript({
      action: 'addMaterials',
      ...materialsData
    }, true);
  };

  /**
   * Get materials cost for a job
   */
  const getMaterialsCost = async (bookingReference) => {
    return callGoogleScript({
      action: 'getMaterialsCost',
      bookingReference: bookingReference
    }, true);
  };

  /**
   * Test connection to Google Apps Script
   */
  const testConnection = async () => {
    return callGoogleScript({
      action: 'testConnection'
    }, true);
  };

  return {
    // State
    loading,
    error,
    setError,
    setLoading,
    
    // Core function
    callGoogleScript,
    
    // Portal lookups
    lookupByReference,
    lookupByEmail,
    
    // Stripe payments
    createStripeCheckoutSession,
    
    // Calendar operations
    checkCalendarAvailability,
    createCalendarBooking,
    
    // Booking operations
    createEstimateBooking,
    sendEstimateEmail,
    createServiceBooking,
    
    // Job operations
    addAdditionalTime,
    getAdditionalTimeCost,
    addMaterials,
    getMaterialsCost,
    
    // Utilities
    testConnection,
    isConfigured: Boolean(scriptUrl)
  };
};

export default useGoogleScript;
