import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { PostHogProvider } from './contexts/PostHogProvider.jsx';
import { GoogleAnalyticsProvider } from './contexts/GoogleAnalyticsProvider.jsx';

// Store original console methods
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

// // Filter out PostHog logs in all environments
// console.log = (...args) => {
//   // Filter out PostHog logs
//   if (typeof args[0] === 'string' && (args[0].includes('[PostHog') || args[0].includes('PostHog.js'))) {
//     return;
//   }
//   // In production, suppress all logs. In development, show non-PostHog logs
//   if (import.meta.env.DEV) {
//     originalLog(...args);
//   }
// };

// console.warn = (...args) => {
//   // Filter out PostHog warnings
//   if (typeof args[0] === 'string' && (args[0].includes('[PostHog') || args[0].includes('PostHog.js'))) {
//     return;
//   }
//   originalWarn(...args);
// };

// console.error = (...args) => {
//   // Always show errors
//   originalError(...args);
// };

// // Suppress info and debug in production
// if (import.meta.env.PROD) {
//   console.info = () => {};
//   console.debug = () => {};
//   console.log = () => {};
//   console.warn = () => {};
//   console.error = () => {};
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PostHogProvider>
        <GoogleAnalyticsProvider>
          <App />
        </GoogleAnalyticsProvider>
      </PostHogProvider>
    </BrowserRouter>
  </StrictMode>,
)