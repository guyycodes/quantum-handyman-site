import { posthog } from '../contexts/PostHogProvider';

export function usePostHog() {
  return {
    // Track booking funnel steps
    trackFunnelStep: (step, properties = {}) => {
      if (posthog) {
        posthog.capture('booking_funnel_step', {
          step_name: step,
          step_number: properties.stepNumber || 0,
          ...properties
        });
      }
    },
    
    // Track custom events
    trackEvent: (eventName, properties = {}) => {
      if (posthog) {
        posthog.capture(eventName, properties);
      }
    },
    
    // Track clicks with automatic element info
    trackClick: (elementName, properties = {}) => {
      if (posthog) {
        posthog.capture('clicked', {
          element: elementName,
          ...properties
        });
      }
    },
    
    // Track form submissions
    trackFormSubmit: (formName, properties = {}) => {
      if (posthog) {
        posthog.capture('form_submitted', {
          form_name: formName,
          ...properties
        });
      }
    },
    
    // Track booking conversions
    trackBookingComplete: (bookingData) => {
      if (posthog) {
        posthog.capture('booking_completed', {
          service: bookingData.service?.name,
          service_id: bookingData.service?.id,
          price: bookingData.service?.price,
          is_urgent: bookingData.isUrgent || false,
          is_estimate: bookingData.isEstimateFlow || false,
          booking_ref: bookingData.bookingRef || bookingData.estimateRef,
          ...bookingData
        });
      }
    },
    
    // Track feature usage
    trackFeatureUsage: (featureName, properties = {}) => {
      if (posthog) {
        posthog.capture('feature_used', {
          feature: featureName,
          ...properties
        });
      }
    },
    
    // Track errors
    trackError: (errorName, properties = {}) => {
      if (posthog) {
        posthog.capture('error_occurred', {
          error_name: errorName,
          ...properties
        });
      }
    },
    
    // Direct access to posthog instance for advanced usage
    posthog
  };
}