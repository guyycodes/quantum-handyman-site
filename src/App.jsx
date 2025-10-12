import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './Components/ScrollToTop'
import SplitLanding from './Components/SplitLanding'
import { WorldProvider } from './contexts/WorldContext'
import { Navigate } from 'react-router-dom'

// Lazy load all route components
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Contact = lazy(() => import('./pages/Contact'))
const Portal = lazy(() => import('./pages/Portal'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'))

// Lazy load ChatBot
const ChatBot = lazy(() => import('./Components/ChatBot'))

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

// World App Wrapper - contains all the app routes within a world context
const WorldApp = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </>
  )
}

function App() {
  return (
    <WorldProvider>
      <Routes>
        {/* Root - Split Landing Page */}
        <Route path="/" element={<SplitLanding />} />
        
        {/* Handyman World - All routes nested under /handyman */}
        <Route path="/handyman/*" element={<WorldApp />} />
        
        {/* Web Dev World - All routes nested under /web */}
        <Route path="/web/*" element={<WorldApp />} />
        
        {/* Fallback for old routes without world prefix - redirect to handyman by default */}
        <Route path="/about" element={<Navigate to="/handyman/about" replace />} />
        <Route path="/services" element={<Navigate to="/handyman/services" replace />} />
        <Route path="/portfolio" element={<Navigate to="/handyman/portfolio" replace />} />
        <Route path="/how-it-works" element={<Navigate to="/handyman/how-it-works" replace />} />
        <Route path="/contact" element={<Navigate to="/handyman/contact" replace />} />
        <Route path="/portal" element={<Navigate to="/handyman/portal" replace />} />
        <Route path="/privacy" element={<Navigate to="/handyman/privacy" replace />} />
        <Route path="/terms" element={<Navigate to="/handyman/terms" replace />} />
        <Route path="/payment-success" element={<Navigate to="/handyman/payment-success" replace />} />
        <Route path="/payment-cancel" element={<Navigate to="/handyman/payment-cancel" replace />} />
        
        {/* 404 for everything else */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </WorldProvider>
  )
}

export default App