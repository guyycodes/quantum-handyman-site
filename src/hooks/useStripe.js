import { useState } from 'react';
import useGoogleScript from './useGoogleScript';
import { useWorld } from '../contexts/WorldContext';

/**
 * Custom hook for handling Stripe payments
 * Provides three payment methods:
 * 1. AI Estimate payment ($1.95 fixed)
 * 2. Booking deposit payment ($25 fixed) 
 * 3. Job payment (dynamic amount based on job details)
 */
const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentWorld } = useWorld();
  
  const { callGoogleScript, getAdditionalTimeCost, getMaterialsCost, isConfigured: isGoogleScriptConfigured } = useGoogleScript();
  const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Check if Stripe is configured
  const isStripeConfigured = Boolean(STRIPE_PUBLISHABLE_KEY && isGoogleScriptConfigured);

  /**
   * Create AI Estimate payment session ($1.95 - using Stripe product price)
   * @param {Object} customerInfo - { name, email, phone, description }
   * @returns {Promise} Stripe checkout URL or error
   */
  const createAIEstimatePayment = async (customerInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isStripeConfigured) {
        throw new Error('Payment system not configured');
      }
      
      const result = await callGoogleScript({
        action: 'createStripeCheckoutSession',
        paymentType: 'ai_estimate',
        // Amount not needed - uses Stripe product price ID
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        successUrl: `${window.location.origin}/${currentWorld}/payment-success`,
        cancelUrl: `${window.location.origin}/${currentWorld}/payment-cancel`,
        metadata: {
          service: 'ai_estimate',
          phone: customerInfo.phone,
          description: customerInfo.description?.substring(0, 500), // Stripe metadata limit
          timestamp: new Date().toISOString()
        }
      }, true); // Skip loading state
      
      // Debug: Log what Google Apps Script returned
      console.log('🔍 Google Apps Script Response for AI Estimate:', result);
      
          if (result.success && result.url) {
            // Store minimal payment context in session storage for fallback/redirect scenarios
            sessionStorage.setItem('pendingAIEstimate', JSON.stringify({
              customerInfo,
              timestamp: Date.now()
            }));
            
            console.log('🔗 Stripe Checkout URL created:', result.url);
            console.log('💡 Check if URL contains session_id:', result.url.includes('cs_'));
            
            setLoading(false);
            return { success: true, url: result.url };
          } else {
            throw new Error(result.error || 'Failed to create payment session');
          }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Create Booking Deposit payment session ($25)
   * @param {Object} bookingInfo - { bookingRef, customerName, email, service, date, time }
   * @returns {Promise} Stripe checkout URL or error
   */
  const createBookingDepositPayment = async (bookingInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isStripeConfigured) {
        throw new Error('Payment system not configured');
      }
      
      const result = await callGoogleScript({
        action: 'createStripeCheckoutSession',
        paymentType: 'booking_deposit',
        amount: 2500, // $25.00 in cents (fallback if no price ID configured)
        customerEmail: bookingInfo.email,
        customerName: bookingInfo.customerName,
        successUrl: `${window.location.origin}/${currentWorld}/payment-success`,
        cancelUrl: `${window.location.origin}/${currentWorld}/payment-cancel`,
        metadata: {
          service: 'booking_deposit',
          bookingReference: bookingInfo.bookingRef,
          serviceName: bookingInfo.service,
          date: bookingInfo.date,
          time: bookingInfo.time,
          timestamp: new Date().toISOString()
        }
      }, true); // Skip loading state
      
      if (result.success && result.url) {
        // Store payment context in session storage for return page
        sessionStorage.setItem('pendingBookingDeposit', JSON.stringify({
          bookingInfo,
          timestamp: Date.now()
        }));
        
        setLoading(false);
        return { success: true, url: result.url };
      } else {
        throw new Error(result.error || 'Failed to create payment session');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Create Job Payment session (dynamic amount from job details)
   * First fetches job details from Google Sheets, then creates payment
   * @param {string} bookingReference - The job reference (e.g., 'QH-241209-A1B2')
   * @param {number} tipAmount - Optional tip amount in dollars (not cents)
   * @returns {Promise} Stripe checkout URL or error
   */
  const createJobPayment = async (bookingReference, tipAmount = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isStripeConfigured) {
        throw new Error('Payment system not configured');
      }
      
      // Step 1: Fetch job details from Google Sheets
      const lookupResult = await callGoogleScript({
        action: 'lookupByReference',
        reference: bookingReference
      }, true); // Skip loading state
      
      if (!lookupResult.success || !lookupResult.items || lookupResult.items.length === 0) {
        throw new Error('Job not found');
      }
      
      const job = lookupResult.items[0];
      
      // Step 2: Calculate payment amount
      // Extract base total from job (e.g., "$150" → 15000 cents)
      const priceValue = job['Price'] || '$0';
      const estimateText = String(priceValue); // Convert to string first
      const baseAmount = parseInt(estimateText.replace(/[^0-9]/g, '')) * 100;
      
      // Step 3: Get additional time cost separately
      let additionalTimeCost = 0;
      try {
        const additionalTimeResult = await getAdditionalTimeCost(bookingReference);
        if (additionalTimeResult.success) {
          additionalTimeCost = Math.round((additionalTimeResult.totalCost || 0) * 100); // Convert to cents
        }
      } catch (error) {
        console.warn('Could not fetch additional time cost:', error);
        // Continue with base amount only
      }

      // Step 4: Get materials cost separately
      let materialsCost = 0;
      try {
        const materialsResult = await getMaterialsCost(bookingReference);
        if (materialsResult.success) {
          materialsCost = Math.round((materialsResult.totalCost || 0) * 100); // Convert to cents
        }
      } catch (error) {
        console.warn('Could not fetch materials cost:', error);
        // Continue without materials cost
      }
      
      // Step 5: Calculate final payment amount
      const totalAmount = baseAmount + additionalTimeCost + materialsCost;
      const depositPaid = job['Deposit Paid'] === 'Yes' ? 2500 : 0; // $25 in cents
      const tipInCents = Math.round(tipAmount * 100); // Convert tip to cents
      const amountDue = totalAmount - depositPaid + tipInCents;
      
      if (amountDue <= 0) {
        throw new Error('Payment link is not available');
      }
      
      // Step 6: Create Stripe checkout session
      const paymentResult = await callGoogleScript({
        action: 'createStripeCheckoutSession',
        paymentType: 'job_payment',
        amount: amountDue,
        customerEmail: job['Email'] || '',
        customerName: job['Name'] || '',
        successUrl: `${window.location.origin}/${currentWorld}/payment-success`,
        cancelUrl: `${window.location.origin}/${currentWorld}/payment-cancel`,
        metadata: {
          service: 'job_payment',
          bookingReference: bookingReference,
          baseAmount: baseAmount,
          additionalTimeCost: additionalTimeCost,
          materialsCost: materialsCost,
          totalAmount: totalAmount,
          depositPaid: depositPaid,
          tipAmount: tipInCents,
          jobDate: job['Date'],
          address: job['Address'],
          serviceName: job['Service'],
          timestamp: new Date().toISOString()
        }
      }, true); // Skip loading state
      
      if (paymentResult.success && paymentResult.url) {
        // Store payment context in session storage for return page
        sessionStorage.setItem('pendingJobPayment', JSON.stringify({
          bookingReference,
          jobDetails: job,
          baseAmount: baseAmount / 100,
          additionalTimeCost: additionalTimeCost / 100,
          materialsCost: materialsCost / 100,
          totalAmount: totalAmount / 100,
          depositPaid: depositPaid / 100,
          amountDue: amountDue / 100,
          timestamp: Date.now()
        }));
        
        setLoading(false);
        return { 
          success: true, 
          url: paymentResult.url,
          jobDetails: {
            baseAmount: baseAmount / 100,         // Base job cost in dollars
            additionalTimeCost: additionalTimeCost / 100, // Additional time cost in dollars
            materialsCost: materialsCost / 100,   // Materials cost in dollars
            totalAmount: totalAmount / 100,       // Total (base + additional + materials) in dollars
            depositPaid: depositPaid / 100,       // Deposit paid in dollars
            amountDue: amountDue / 100            // Final amount due in dollars
          }
        };
      } else {
        throw new Error(paymentResult.error || 'Failed to create payment session');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Open Stripe checkout in a popup window
   * @param {string} checkoutUrl - The Stripe checkout URL
   * @param {function} onComplete - Callback for payment completion
   * @param {function} onBlocked - Callback when popup is blocked
   * @returns {object} Popup window reference and cleanup function, or null if blocked
   */
  const openStripeCheckout = (checkoutUrl, onComplete = null, onBlocked = null) => {
    if (!checkoutUrl) return null;
    
    // Calculate center position for popup
    const width = 600;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Open Stripe checkout in popup
    const popup = window.open(
      checkoutUrl,
      'stripe-checkout',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    
    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.warn('Popup was blocked by browser');
      
      // Call the onBlocked callback to handle this gracefully
      if (onBlocked) {
        onBlocked({
          url: checkoutUrl,
          message: 'Please allow popups for this site to complete payment'
        });
      }
      
      return null;
    }
    
    // Listen for messages from the popup
    const messageHandler = (event) => {
      // Verify the message is from our domain
      if (event.origin !== window.location.origin) return;
      
      console.log('📨 Message received from popup:', event.data.type);
      
      if (event.data.type === 'payment-success') {
        console.log('✅ Payment Success message received from success page!');
        cleanup();
        if (onComplete) {
          onComplete({ success: true, data: event.data.payload });
        }
      } else if (event.data.type === 'payment-cancelled') {
        console.log('❌ Payment Cancelled message received from cancel page');
        cleanup();
        if (onComplete) {
          onComplete({ success: false, cancelled: true });
        }
      }
    };
    
    // Check if popup is closed
    const checkInterval = setInterval(() => {
      if (popup.closed) {
        console.log('🔴 Stripe popup closed without redirect to success/cancel page');
        cleanup();
        if (onComplete) {
          onComplete({ success: false, closed: true });
        }
      }
    }, 1000);
    
    // Add event listener for messages
    window.addEventListener('message', messageHandler);
    
    // Cleanup function
    const cleanup = () => {
      clearInterval(checkInterval);
      window.removeEventListener('message', messageHandler);
      if (!popup.closed) {
        popup.close();
      }
    };
    
    return { popup, cleanup };
  };
  
  /**
   * Legacy redirect method (kept for backward compatibility)
   * @param {string} checkoutUrl - The Stripe checkout URL
   */
  const redirectToCheckout = (checkoutUrl) => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return {
    // State
    loading,
    error,
    isStripeConfigured,
    
    // Payment methods
    createAIEstimatePayment,
    createBookingDepositPayment,
    createJobPayment,
    
    // Checkout methods
    openStripeCheckout,
    redirectToCheckout // Kept for backward compatibility
  };
};

export default useStripe;
