import googleScriptService from './googleScriptService';

// Lazy load Stripe to improve initial page load
let stripeModule = null;
let stripeLoadPromise = null;
let stripeInstance = null;

// Stripe configuration
const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  aiEstimatePrice: 195, // $1.95 in cents
  currency: 'usd',
  successUrl: window.location.origin + '/payment-success',
  cancelUrl: window.location.origin + '/payment-cancelled'
};

// Load Stripe on demand
const getStripe = async () => {
  if (stripeInstance) return stripeInstance;
  
  if (!stripeLoadPromise) {
    stripeLoadPromise = import('@stripe/stripe-js').then(async (module) => {
      stripeModule = module;
      if (STRIPE_CONFIG.publishableKey) {
        stripeInstance = await module.loadStripe(STRIPE_CONFIG.publishableKey);
      }
      return stripeInstance;
    });
  }
  
  return stripeLoadPromise;
};

/**
 * Create a Stripe Checkout session for AI estimate payment
 * @param {Object} customerInfo - Customer information
 * @returns {Promise} Checkout session response
 */
export const createAIEstimateCheckoutSession = async (customerInfo) => {
  try {
    if (!googleScriptService.isConfigured() && STRIPE_CONFIG.publishableKey) {
      throw new Error('Google Apps Script URL not configured for Stripe payments');
    }
    
    // Call Google Apps Script to create checkout session
    const result = await googleScriptService.createStripeCheckoutSession({
      amount: STRIPE_CONFIG.aiEstimatePrice,
      currency: STRIPE_CONFIG.currency,
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      metadata: {
        service: 'ai_estimate',
        customerPhone: customerInfo.phone,
        timestamp: new Date().toISOString()
      }
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create checkout session');
    }
    
    return {
      success: true,
      sessionId: result.id,
      url: result.url
    };
  } catch (error) {
    // Log error only in development
    if (import.meta.env.DEV) {
      console.error('Stripe Checkout Session Error:', error);
    }
    return {
      success: false,
      error: error.message || 'Failed to create payment session'
    };
  }
};

/**
 * Redirect to Stripe Checkout
 * @param {string} sessionId - Stripe checkout session ID
 */
export const redirectToCheckout = async (sessionId) => {
  const stripe = await getStripe();
  
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    throw error;
  }
};

/**
 * Process payment using Stripe Payment Element (embedded UI)
 * This is an alternative to redirect checkout - keeps user on your site
 */
export const processPaymentWithElement = async (customerInfo, paymentElementRef) => {
  try {
    const stripe = await getStripe();
    
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    // Create payment intent on your backend
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: STRIPE_CONFIG.aiEstimatePrice,
        currency: STRIPE_CONFIG.currency,
        customerEmail: customerInfo.email,
        metadata: {
          service: 'ai_estimate',
          customerName: customerInfo.name
        }
      })
    });

    const { clientSecret } = await response.json();

    // Confirm the payment
    const result = await stripe.confirmPayment({
      elements: paymentElementRef.current,
      clientSecret,
      confirmParams: {
        return_url: STRIPE_CONFIG.successUrl,
        receipt_email: customerInfo.email
      }
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message
      };
    }

    return {
      success: true,
      paymentIntent: result.paymentIntent
    };
  } catch (error) {
    // Log error only in development
    if (import.meta.env.DEV) {
      console.error('Payment processing error:', error);
    }
    return {
      success: false,
      error: error.message || 'Payment processing failed'
    };
  }
};

/**
 * For development/testing: Mock payment processing
 */
export const mockPayment = async (customerInfo) => {
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For testing, randomly succeed or fail
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    return {
      success: true,
      paymentId: `mock_${Date.now()}`,
      amount: STRIPE_CONFIG.aiEstimatePrice,
      currency: STRIPE_CONFIG.currency
    };
  } else {
    return {
      success: false,
      error: 'Mock payment failed for testing'
    };
  }
};

/**
 * Validate Stripe configuration
 */
export const validateStripeConfig = () => {
  return {
    isValid: !!STRIPE_CONFIG.publishableKey,
    hasKey: !!STRIPE_CONFIG.publishableKey,
    amount: STRIPE_CONFIG.aiEstimatePrice,
    currency: STRIPE_CONFIG.currency
  };
};

export default {
  createAIEstimateCheckoutSession,
  redirectToCheckout,
  processPaymentWithElement,
  mockPayment,
  validateStripeConfig,
  STRIPE_CONFIG
};
