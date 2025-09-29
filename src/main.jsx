import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { PostHogProvider } from './contexts/PostHogProvider.jsx';
import { GoogleAnalyticsProvider } from './contexts/GoogleAnalyticsProvider.jsx';

// Suppress all console logs in production
if (import.meta.env.PROD) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};
}

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