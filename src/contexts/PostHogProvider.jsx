import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

// Initialize PostHog
if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_API_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    // Disable debug mode to suppress console logs
    debug: false,
    // Suppress all PostHog logs
    silence_errors: true,
    // Capture pageviews automatically
    capture_pageview: false, // We'll handle this manually for better control
    // Capture sessions automatically
    autocapture: true,
    // Session recording - DISABLE to prevent large payloads
    session_recording: {
      enabled: false,
      maskAllInputs: true,
      maskTextContent: true
    },
    disable_session_recording: true,
    // Persist user across sessions
    persistence: 'localStorage',
    // Track UTM parameters automatically
    capture_utm: true,
    // FIX: Disable feature flags to prevent 400 error on /flags/ endpoint
    advanced_disable_feature_flags: true,
    // FIX: Disable compression to prevent hex escape errors
    disable_compression: true,
    // FIX: Sanitize properties to remove problematic characters
    sanitize_properties: function(properties) {
      if (!properties) return properties;
      
      // Clean each property value
      const cleaned = {};
      for (let key in properties) {
        const value = properties[key];
        if (value !== undefined && value !== null) {
          // Convert to string and remove problematic characters
          if (typeof value === 'string') {
            // Remove non-printable and non-ASCII characters
            cleaned[key] = value.replace(/[^\x20-\x7E]/g, '');
          } else {
            cleaned[key] = value;
          }
        }
      }
      return cleaned;
    }
  });
}

export function PostHogProvider({ children }) {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    if (!posthog) return;
    
    // Track pageview with custom properties
    posthog.capture('$pageview', {
      path: location.pathname,
      title: document.title,
      referrer: document.referrer
    });
  }, [location]);

  // Set up a persistent anonymous user ID
  useEffect(() => {
    if (!posthog) return;
    
    // Set user properties for anonymous users
    posthog.setPersonProperties({
      // Mark as anonymous user
      user_type: 'anonymous',
      // Track first visit
      first_seen: new Date().toISOString()
    });
  }, []);

  return children;
}

// Export posthog instance for use in components
export { posthog };