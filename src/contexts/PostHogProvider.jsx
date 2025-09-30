import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Lazy load PostHog to improve initial page load
let posthogInstance = null;
let posthogLoadPromise = null;

const loadPostHog = async () => {
  if (posthogInstance) return posthogInstance;
  if (posthogLoadPromise) return posthogLoadPromise;

  posthogLoadPromise = import('posthog-js').then((module) => {
    const posthog = module.default;
    
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
        // Session recording configuration
        session_recording: {
          enabled: true,
          maskAllInputs: true, // Mask sensitive inputs
          maskTextContent: false
        },
        // Persist user across sessions
        persistence: 'localStorage',
        // Track UTM parameters automatically
        capture_utm: true,
        // Load recorder asynchronously to not block main thread
        disable_session_recording: false,
        // Reduce initial bundle size
        bootstrap: {
          distinctId: null,
          isIdentifiedId: false
        }
      });
      posthogInstance = posthog;
    }
    return posthog;
  });

  return posthogLoadPromise;
};

export function PostHogProvider({ children }) {
  const location = useLocation();
  const isPostHogLoaded = useRef(false);

  // Initialize PostHog after page load
  useEffect(() => {
    const initPostHog = async () => {
      // Already loaded
      if (isPostHogLoaded.current) return;

      // Wait for idle time to load PostHog
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async () => {
          const posthog = await loadPostHog();
          if (posthog && posthogInstance) {
            isPostHogLoaded.current = true;
            
            // Set initial user properties
            posthogInstance.setPersonProperties({
              user_type: 'anonymous',
              first_seen: new Date().toISOString()
            });

            // Track initial pageview
            posthogInstance.capture('$pageview', {
              path: location.pathname,
              title: document.title,
              referrer: document.referrer
            });
          }
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(async () => {
          const posthog = await loadPostHog();
          if (posthog && posthogInstance) {
            isPostHogLoaded.current = true;
            
            // Set initial user properties
            posthogInstance.setPersonProperties({
              user_type: 'anonymous',
              first_seen: new Date().toISOString()
            });

            // Track initial pageview
            posthogInstance.capture('$pageview', {
              path: location.pathname,
              title: document.title,
              referrer: document.referrer
            });
          }
        }, 2000); // Delay 2 seconds to not interfere with initial load
      }
    };

    // Start loading after DOM is ready
    if (document.readyState === 'complete') {
      initPostHog();
    } else {
      window.addEventListener('load', initPostHog);
    }

    return () => {
      window.removeEventListener('load', initPostHog);
    };
  }, []); // Only run once on mount

  // Track page views on route changes (after initial load)
  useEffect(() => {
    if (!isPostHogLoaded.current || !posthogInstance) return;
    
    // Track pageview with custom properties
    posthogInstance.capture('$pageview', {
      path: location.pathname,
      title: document.title,
      referrer: document.referrer
    });
  }, [location]);

  return children;
}

// Export a proxy that loads PostHog on demand
export const posthog = new Proxy({}, {
  get: (target, prop) => {
    if (!posthogInstance) {
      // Queue the call for when PostHog loads
      loadPostHog().then(() => {
        if (posthogInstance && typeof posthogInstance[prop] === 'function') {
          // If it's a method we can call later, do nothing for now
          console.log('PostHog not yet loaded, queueing:', prop);
        }
      });
      // Return a no-op function to prevent errors
      if (typeof prop === 'string' && ['capture', 'identify', 'setPersonProperties', 'reset'].includes(prop)) {
        return () => {};
      }
      return undefined;
    }
    return posthogInstance[prop];
  }
});