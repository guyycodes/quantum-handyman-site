import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './Components/ScrollToTop'
import SplitLanding from './Components/SplitLanding'

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
  const [selectedWorld, setSelectedWorld] = useState(() => {
    // Check if user has already selected a world
    return localStorage.getItem('qh_world');
  });

  const handleWorldSelect = (world) => {
    setSelectedWorld(world);
    // Apply theme class to document root
    document.documentElement.setAttribute('data-world', world);
  };

  useEffect(() => {
    // Apply theme on mount if world is already selected
    if (selectedWorld) {
      document.documentElement.setAttribute('data-world', selectedWorld);
    }
  }, [selectedWorld]);

  // Show split landing if no world selected
  if (!selectedWorld) {
    return <SplitLanding onWorldSelect={handleWorldSelect} />;
  }

  // Otherwise show the main app
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