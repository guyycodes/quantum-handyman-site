import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

// Initialize PostHog
if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_API_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    // Enable debug mode in development
    // debug: import.meta.env.MODE === 'development',
    // Disable debug mode to suppress console logs
    debug: false,
    // Suppress all PostHog logs
    silence_errors: true,
    // Capture pageviews automatically
    capture_pageview: false, // We'll handle this manually for better control
    // Capture sessions automatically
    autocapture: true,
    // Session recording configuration
    session_recording: {
      enabled: true,
      maskAllInputs: true, // Mask sensitive inputs
      maskTextContent: false
    },
    // Persist user across sessions
    persistence: 'localStorage',
    // Track UTM parameters automatically
    capture_utm: true
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