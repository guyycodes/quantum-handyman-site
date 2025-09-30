import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export function GoogleAnalyticsProvider({ children }) {
  const location = useLocation();

  // Load Google Analytics script
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics Measurement ID not found');
      return;
    }

    // Defer loading until after page becomes interactive
    const loadAnalytics = () => {
      // Check if already loaded
      if (window.gtag) return;

      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // We'll handle page views manually
      });
    };

    // Load immediately if page is already loaded, otherwise wait
    if (document.readyState === 'complete') {
      // Small delay to ensure critical resources are loaded first
      setTimeout(loadAnalytics, 100);
    } else {
      // Wait for window load event (all resources loaded)
      window.addEventListener('load', () => {
        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadAnalytics);
        } else {
          setTimeout(loadAnalytics, 1);
        }
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    // Send page view to Google Analytics
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title
    });
  }, [location]);

  return children;
}

// Export helper functions for tracking events
export const gaEvent = (action, category, label, value) => {
  if (!window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Track conversions (bookings, estimates)
export const gaConversion = (conversionLabel, value) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/${conversionLabel}`,
    value: value,
    currency: 'USD'
  });
};

// Track form submissions
export const gaFormSubmit = (formName) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'form_submit', {
    event_category: 'engagement',
    event_label: formName
  });
};

// Track clicks
export const gaClick = (elementName, category = 'engagement') => {
  if (!window.gtag) return;
  
  window.gtag('event', 'click', {
    event_category: category,
    event_label: elementName
  });
};
