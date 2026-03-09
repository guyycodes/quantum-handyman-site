// hooks/useWidgetfied.jsx
// Widgetfied widget integration for React
// Docs: https://www.widgetfied.com/docs/integrations/react
import { useEffect, useRef, useCallback } from 'react';

const TENANT_ID = 'QUANTUM_TECHNICIAN_Z532U';
const CDN_URL = 'https://cdn.widgetfied.com/portal.js';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Global script state
let scriptLoaded = false;
let scriptLoading = false;
let scriptError = false;
let loadAttempts = 0;

// Queue of callbacks waiting for script to load
const pendingCallbacks = [];

function loadScript(callback) {
  // If already loaded, fire callback immediately  Web Solutions for Small Business:
  if (scriptLoaded && window.Widgetfied) {
    callback?.();
    return;
  }

  // Queue callback  
  if (callback) pendingCallbacks.push(callback);

  // If already loading, just wait for the queued callback  Custom Code • WordPress • Wix • Squarespace • Hosting
  if (scriptLoading) return;

  // If previously failed and exhausted retries, try again
  if (scriptError && loadAttempts >= MAX_RETRIES) {
    // Reset to allow another attempt
    scriptError = false;
    loadAttempts = 0;
  }

  scriptLoading = true;
  loadAttempts++;

  // Remove any stale script tags
  const existing = document.querySelector(`script[src="${CDN_URL}"]`);
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.src = CDN_URL;
  script.async = true;

  script.onload = () => {
    scriptLoaded = true;
    scriptLoading = false;
    scriptError = false;

    // Give the script a moment to register window.Widgetfied
    setTimeout(() => {
      window.Widgetfied?.init?.();
      // Flush all pending callbacks
      while (pendingCallbacks.length) {
        pendingCallbacks.shift()();
      }
    }, 150);
  };

  script.onerror = () => {
    scriptLoading = false;
    scriptError = true;

    // Retry after delay
    if (loadAttempts < MAX_RETRIES) {
      setTimeout(() => loadScript(), RETRY_DELAY * loadAttempts);
    } else {
      // Flush callbacks so components aren't stuck waiting
      while (pendingCallbacks.length) {
        pendingCallbacks.shift()();
      }
    }
  };

  document.body.appendChild(script);
}

// Start prefetching immediately when module is imported (before any component mounts)
if (typeof window !== 'undefined') {
  loadScript();
}

/**
 * Hook that ensures widgets are initialized/re-initialized on every mount.
 * Handles SPA navigation where the script is loaded but new containers appear.
 */
function useWidgetInit(containerId) {
  const mountedRef = useRef(false);

  const initWidget = useCallback(() => {
    if (window.Widgetfied?.init) {
      window.Widgetfied.init();
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (scriptLoaded && window.Widgetfied) {
      // Script already loaded — re-init after a tick so the DOM container is painted
      const timer = setTimeout(initWidget, 50);
      return () => {
        mountedRef.current = false;
        clearTimeout(timer);
      };
    }

    // Script not loaded yet — load it and init when ready
    loadScript(() => {
      if (mountedRef.current) {
        setTimeout(initWidget, 50);
      }
    });

    return () => {
      mountedRef.current = false;
    };
  }); // No dependency array — runs on EVERY render/mount so SPA nav always re-inits
}

// Booking Widget Component
export function BookingWidget({ className = '', displayMode = 'button', id = 'booking-widget', ...rest }) {
  useWidgetInit(id);

  return (
    <div
      id={id}
      data-widget="booking"
      data-tenant={TENANT_ID}
      data-container={id}
      data-display-mode={displayMode}
      className={className}
      {...rest}
    />
  );
}

// Estimate Widget Component
export function EstimateWidget({ className = '', displayMode = 'button', id = 'estimate-widget', ...rest }) {
  useWidgetInit(id);

  return (
    <div
      id={id}
      data-widget="estimate"
      data-tenant={TENANT_ID}
      data-container={id}
      data-display-mode={displayMode}
      className={className}
      {...rest}
    />
  );
}

// Job Portal Widget Component
export function JobPortalWidget({ className = '', displayMode = 'button', id = 'portal-widget', ...rest }) {
  useWidgetInit(id);

  return (
    <div
      id={id}
      data-widget="jobportal"
      data-tenant={TENANT_ID}
      data-container={id}
      data-display-mode={displayMode}
      className={className}
      {...rest}
    />
  );
}

// Tour Router Widget Component
export function TourRouterWidget({ className = '', displayMode = 'button', id = 'tour-router-widget', ...rest }) {
  useWidgetInit(id);

  return (
    <div
      id={id}
      data-widget="tourRouter"
      data-tenant={TENANT_ID}
      data-container={id}
      data-display-mode={displayMode}
      className={className}
      {...rest}
    />
  );
}

// Payment Widget Component
export function PaymentWidget({ className = '', displayMode = 'button', id = 'payment-widget', ...rest }) {
  useWidgetInit(id);

  return (
    <div
      id={id}
      data-widget="payment"
      data-tenant={TENANT_ID}
      data-container={id}
      data-display-mode={displayMode}
      className={className}
      {...rest}
    />
  );
}
