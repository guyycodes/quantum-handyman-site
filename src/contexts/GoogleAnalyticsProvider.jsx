import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Queue for analytics events before GA is loaded
let analyticsQueue = [];
let isAnalyticsLoaded = false;

// Initialize Google Analytics
export function GoogleAnalyticsProvider({ children }) {
  const location = useLocation();
  const hasInteracted = useRef(false);
  const loadTimeout = useRef(null);

  // Load Google Analytics script
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics Measurement ID not found');
      return;
    }

    const loadAnalytics = () => {
      // Check if already loaded or loading
      if (isAnalyticsLoaded || window.gtag) return;
      isAnalyticsLoaded = true;

      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      script.onload = () => {
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID, {
          send_page_view: false // We'll handle page views manually
        });

        // Process queued events
        analyticsQueue.forEach(args => {
          if (window.gtag) {
            window.gtag(...args);
          }
        });
        analyticsQueue = [];
      };
    };

    // Load analytics only after user interaction or after 10 seconds
    const interactionEvents = ['scroll', 'click', 'touchstart', 'mousedown', 'keydown'];
    
    const handleInteraction = () => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        // Clean up listeners
        interactionEvents.forEach(event => {
          window.removeEventListener(event, handleInteraction);
        });
        // Clear timeout since user interacted
        if (loadTimeout.current) {
          clearTimeout(loadTimeout.current);
        }
        // Load analytics after a small delay
        setTimeout(loadAnalytics, 100);
      }
    };

    // Add interaction listeners
    interactionEvents.forEach(event => {
      window.addEventListener(event, handleInteraction, { passive: true, once: true });
    });

    // Fallback: Load after 10 seconds even without interaction
    // This ensures bots/crawlers still get tracked
    loadTimeout.current = setTimeout(() => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        loadAnalytics();
      }
    }, 10000);

    return () => {
      // Cleanup
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
      if (loadTimeout.current) {
        clearTimeout(loadTimeout.current);
      }
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const trackPageView = () => {
      // Send page view to Google Analytics
      if (window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: location.pathname + location.search,
          page_title: document.title
        });
      } else {
        // Queue the pageview if gtag isn't loaded yet
        analyticsQueue.push(['config', GA_MEASUREMENT_ID, {
          page_path: location.pathname + location.search,
          page_title: document.title
        }]);
      }
    };

    // Small delay to ensure title is updated
    setTimeout(trackPageView, 0);
  }, [location]);

  return children;
}

// Helper function to queue or execute analytics calls
const executeOrQueue = (args) => {
  if (window.gtag) {
    window.gtag(...args);
  } else {
    analyticsQueue.push(args);
  }
};

// Export helper functions for tracking events
export const gaEvent = (action, category, label, value) => {
  if (!GA_MEASUREMENT_ID) return;
  
  executeOrQueue(['event', action, {
    event_category: category,
    event_label: label,
    value: value
  }]);
};

// Track conversions (bookings, estimates)
export const gaConversion = (conversionLabel, value) => {
  if (!GA_MEASUREMENT_ID) return;
  
  executeOrQueue(['event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/${conversionLabel}`,
    value: value,
    currency: 'USD'
  }]);
};

// Track form submissions
export const gaFormSubmit = (formName) => {
  if (!GA_MEASUREMENT_ID) return;
  
  executeOrQueue(['event', 'form_submit', {
    event_category: 'engagement',
    event_label: formName
  }]);
};

// Track clicks
export const gaClick = (elementName, category = 'engagement') => {
  if (!GA_MEASUREMENT_ID) return;
  
  executeOrQueue(['event', 'click', {
    event_category: category,
    event_label: elementName
  }]);
};
