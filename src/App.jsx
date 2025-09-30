import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './Components/ScrollToTop'

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

// Lazy load ChatBot
const ChatBot = lazy(() => import('./Components/ChatBot'))

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

function App() {
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </>
  )
}

export default App