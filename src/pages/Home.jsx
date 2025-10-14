import React, { useState, lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BookingCTA from '../Components/BookingCTA'
import FramedImage from '../Components/FramedImage'
import { useWorld } from '../contexts/WorldContext'

// Lazy load non-critical components
const QuantumSphere = lazy(() => import('../Components/QuantumSphere'))
const FloatingVideo = lazy(() => import('../Components/FloatingVideo'))
const BeforeAfterSlider = lazy(() => import('../Components/BeforeAfterSlider'))
const SocialProof = lazy(() => import('../components/SocialProof'))
const BookingInfo = lazy(() => import('../Components/BookingInfo'))

// Lazy load BookingModal since it's only needed when user clicks to book
const BookingModal = lazy(() => import('../Components/BookingModal'))
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Wrench, Code, Home as HomeIcon, TreePine, Car, Wifi,
  Shield, Clock, Award, Users, ChevronRight,
  Phone, Mail, MapPin, CheckCircle,
  Hammer, Paintbrush, Zap, Droplets, Lightbulb,
  Monitor, Smartphone, Globe, Database, Server,
  Leaf, Flower, Scissors, Sun, CloudRain,
  Sparkles, Settings, Gauge, ArrowRight,
  ExternalLink
} from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    badge: 'Est. 2015',
    title: {
      line1: 'Quantum',
      line2: 'Technician'
    },
    subtitle: 'Solutions from a unified ethos - Physical & Digital',
    mainCta: 'Need help with a project?',
    selectPrompt: 'Select an option to get started:',
    cta: {
      // Technician world buttons
      technicianQuote: 'Get a Quote',
      furnitureBuild: 'Book Furniture Build',
      // Web world buttons  
      aiEstimate: 'Get AI Estimate',
      consultation: 'Book Consultation',
      // Main/combined world buttons
      getEstimate: 'Get an Estimate',
      bookService: 'Book a Service',
      helperText: '⚡ Instant AI estimates',
      portalText: '⚡ Track Your Jobs'
    },
    badges: {
      fix: 'Property Maintenance & Repairs',
      tech: 'Web Tech',
      online: 'Own Your Traffic',
      offering: 'No plumbing/electrical/permit work.'
    }
  },
  
  booking: {
    title: 'Easy Online Booking & Estimates',
    description: 'Book instantly or get estimates in seconds',
    bookingSteps: {
      title: 'Book Service',
      steps: [
        { icon: '📦', text: 'Choose Package' },
        { icon: '📅', text: 'Pick Time' },
        { icon: '✅', text: 'Instant Confirm' },
      ]
    },
    estimateSteps: {
      title: 'Get an Estimate',
      steps: [
        { icon: '📋', text: 'Select Estimate' },
        { icon: '📸', text: 'Upload Photos' },
        { icon: '⚡', text: 'Instant or 24hr Quote' }
      ]
    },
    cta: {
      primary: 'Get Started',
      secondary: 'Learn More',
      helperText: '⚡ Get instant AI estimates'
    },
    features: [
      { icon: '🔒', text: 'Secure' },
      { icon: '⚡', text: 'Instant' },
      { icon: '🎯', text: 'No Login' },
      { icon: '🤖', text: 'Optional AI Estimate' }
    ]
  },
  
  services: {
    title: 'Our Services',
    subtitle: 'Deliver a traditional technician, equipped with deep modern tech expertise.',
    categories: {
      all: 'All Services',
      property: 'Property',
      tech: 'Tech',
      digital: 'Digital Web Services',
    },
    cta: 'Book This Service'
  },
  
  about: {
    title: 'Mission: Quantum Technician',
    tagline: 'Solutions from a unified ethos — Physical & Digital',
    description: 'To provide solutions driven from a unified ethos, deep multidisciplinary skills with a systematic problem-solving approach for modern homeowners & businesses. Quantum Technician achieves this by combining craftsmanship & engineering discipline, delivered with community values professionalism & efficiency.',
    imageCaption: 'Morgan B. - Quantum Technician',
    imagePath: '/images/profile/Me-and-Pops.jpg',
    valueProposition: {
      title: 'Value Proposition',
      text: 'A new kind of technician bridging the gap between the physical & digital worlds | Craftsman + CS-degree, and deep multi-disciplinary expertise.'
    },
    whyChoose: {
      title: 'Why Choose Us?',
      items: [
        {
          title: 'Tech-Savvy Craftsman',
          description: 'CS degree + business & Full-Stack problem-solving for your needs.'
        },
        {
          title: 'Multi-Stack Solutions',
          description: 'Fix your property OR your tech - powered by our custom AI estimation tool.'
        },
        {
          title: 'Systematic Approach',
          description: 'Software engineering principles applied to every project. Quality gauranteed.'
        },
        {
          title: 'Modern-local Problem-Solver',
          description: 'Quick response times, community focused, Colorado Native.'
        }
      ]
    },
    credentials: [
      {
        title: '10+ Yrs as Craftsman',
        description: (
          <>
            500+ projects completed average{' '}
            <span className="inline-flex items-center">
              <span>⭐⭐⭐⭐</span>
              <span className="inline-block" style={{ clipPath: 'inset(0 50% 0 0)' }}>⭐</span>
            </span>{' '}
            rating.
          </>
        )
      },
      {
        title: 'CS Degree',
        description: '+ 3 years experience. B.A. Computer Science + Business Minor'
      },
      {
        title: 'Certified Full-Stack Developer',
        description: 'AWS, GCP, React, Node.js, Python, SQL, No-SQL, Java, Hibernate, Spring, Swift, Xcode, Vercel, iOS, Android etc.'
      },
      {
        title: 'Property Finance Background',
        description: 'Former mortgage officer (NMLS #2318525) + Real Estate School. Deep property & finance knowledge.'
      },
      {
        title: 'Certified ITIL 4',
        description: 'Optimized Service Value Chain.'
      },
      {
        title: 'Certified Project Management',
        description: 'Comptia Project+ & Project management experience.'
      },
    ],
    cta: 'Get Free Quote'
  },
  
  portfolio: {
    title: ' Portfolio',
    subtitle: 'Cross discipline quality work.',
    // World-specific titles and subtitles
    technician: {
      title: 'Technician',
      subtitle: 'Quality craftsmanship and property improvements.'
    },
    web: {
      title: 'Web Development',
      subtitle: 'Custom websites and digital solutions we\'ve built.'
    },
    samplesSuffix: 'Samples',  // The "Samples" word that comes after the title
    viewFull: 'View Portfolio',
    // CTA after portfolio
    ctaSection: {
      title: 'Like what you see?',
      subtitle: 'Let\'s discuss your project',
      bookButton: 'Book a Project',
      quoteButton: 'Get a Quote'
    }
  },
  
  // Service CTA in middle of services section  
  servicesCta: {
    title: 'Ready to get started?',
    subtitle: 'Pick a service above or book a consultation',
    button: 'Book Now'
  },
  
  guarantee: {
    title: 'Our Guarantee',
    tagline: 'Reliable. On time. Done right.',
    badges: [
      { icon: 'checkCircle', text: '100% Satisfaction' },
      { icon: 'clock', text: 'On-Time Promise' },
      { icon: 'award', text: 'Quality Work' }
    ]
  },
  
  reviews: {
    title: 'What Clients Say',
    subtitle: 'Check out our reviews and ratings from satisfied customers',
    googleTitle: 'Google Reviews',
    rating: '5.0 Rating • 100% Satisfaction',
    description: 'Reviews for Quantum Technician.',
    googleButton: 'View Reviews on Google',
    googleUrl: 'https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review', // Replace with your actual Google Business URL
    helperText: 'See verified customer reviews on Google Business'
  },
  
  cta: {
    title: 'Experience Quantum Advantage.',
    subtitle: 'Hire a technician who can solve problems at every level.',
    // World-specific CTAs
    technician: {
      title: 'Ready to Fix Your Home?',
      subtitle: 'Professional technician services with transparent pricing and quality guarantee.'
    },
    web: {
      title: 'Ready to Build Your Digital Presence?',
      subtitle: 'Transform your ideas into powerful web applications with expert development.'
    },
    buttons: {
      bookNow: 'Book Now',
      // call: 'Call (555) 123-4567',
      helperText: '⚡ Instant AI estimates'
    },
    badges: {
      freeQuotes: 'AI-Powered Instant Quotes',
      licensed: 'Licensed & Insured',
      satisfaction: 'Satisfaction Guaranteed'
    },
    footer: 'We use a secure booking platform to manage appointments and ensure the best service experience.'
  },
  
  // Floating button
  floatingButton: {
    text: '📅 Book Now',
    helperText: '⚡ Quick booking'
  },
  
}

// Data objects with their text content
const SERVICES_DATA = [
  // Technician Services
  {
    id: 'home-repairs',
    title: 'Home Repairs & Maintenance',
    icon: HomeIcon,
    color: 'bg-blue-500',
    description: 'Professional home repair services for all your property needs',
    features: ['Drywall, Roofs, Paint & Caulking', 'Doors, locks, hinges & trim work', 'General repairs & maintenance', 'Property preservation'],
    category: 'property'
  },
  {
    id: 'home-setup',
    title: 'Home Setup & Installation',
    icon: Settings,
    color: 'bg-purple-500',
    description: 'Complete home setup including furniture assembly and smart device installation',
    features: ['Furniture Assembly (IKEA, etc.)', 'Security Camera Installation', 'TV Mounting & Cable Management', 'Smart Home Device Setup'],
    category: 'property'
  },
  {
    id: 'landscaping',
    title: 'Landscaping & Outdoor',
    icon: TreePine,
    color: 'bg-green-500',
    description: 'Upgrade your outdoor spaces with landscape services',
    features: ['Decks, Patios, Masonry & Outdoor lighting', 'Custom Landscaping', 'Landscape Maintenance', 'Irrigation systems', 'Tree pruning'],
    category: 'property'
  },
  
  // Web Development Services
  {
    id: 'custom-dev',
    title: 'Custom Web Development',
    icon: Code,
    color: 'bg-purple-500',
    description: 'Full-stack custom web applications and digital solutions tailored to your needs',
    features: ['React, Node.js, Python Applications', 'E-commerce & Online Booking Systems', 'AI Integration & Custom Features', 'API Development & Integration'],
    category: 'digital'
  },
  {
    id: 'website-builders',
    title: 'WordPress, Wix & Squarespace',
    icon: Globe,
    color: 'bg-indigo-500',
    description: 'Professional website creation and management on popular platforms CMS, Google Business Profile, Analytics, etc.',
    features: ['WordPress Custom Themes & Plugins', 'Wix & Squarespace Design', 'Site Migration & Optimization', 'Ongoing Maintenance & Updates'],
    category: 'digital'
  },
  {
    id: 'content-creator',
    title: 'Content Creator Setup',
    icon: Smartphone,
    color: 'bg-pink-500',
    description: 'Complete digital presence setup for influencers and content creators',
    features: ['Link-in-bio Pages & Media Kits + Photography & Video', 'Instagram Shopping Integration', 'YouTube Channel Optimization', 'Brand Partnerships Portal'],
    category: 'digital'
  },
  {
    id: 'maintenance-plan',
    title: 'Website Care Plan',
    icon: Sparkles,
    color: 'bg-orange-500',
    description: 'Ongoing website maintenance with monthly support hours, security monitoring, and performance optimization',
    features: ['3 Hours Monthly Updates & Content', 'Security Monitoring & Backups', 'Performance Optimization & Fixes', 'Priority Email/Text Support'],
    category: 'digital'
  },

]


const PORTFOLIO_DATA = [
  {
    category: 'Web Development',
    title: 'Realtime SaaS Platform',
    description: 'Realtime jobs dispatch platform with realtime job tracking, Dispatching, messaging, Disputes, AI integrations, and payment processing.',
    image: '/images/web-dev/Dandymen_io-optimized.webp',
    link: 'https://dandymen.io' // Link to live platform
  },
  {
    category: 'Web Development',
    title: 'Luxury Realtor Portfolio',
    description: 'Premium real estate agent website featuring virtual property tours, 3D visualizations, MLS integration, and client testimonials.',
    image: '/images/web-dev/sarah-thompson-realtor.png', 
    link: 'https://realtor-template-theta.vercel.app/' 
  },
  {
    category: 'Web Development',
    title: 'Multiplayer Physics Sandbox v1',
    description: 'Single Player & Multiplayer Real-time 3D collaborative environment w/server-authoritative physics server, WebGL graphics, and sub-50ms latency multiplayer synchronization (sandbox-v1).',
    image: '/images/web-dev/game.png', // Gaming/physics placeholder
    link: 'https://tug-o-war.vercel.app' 
  },
  {
    category: 'Property Maintenance',
    title: 'Home Setup & Installation',
    description: 'Complete home setup including furniture assembly, security cameras, and smart device installation.',
    image: '/images/smart-home/smart_home_app.png',
    link: null
  },
  {
    category: 'Landscape',
    title: 'Backyard Transformation',
    description: 'Stamped concrete Patio • Irrigation • Ceiling drywall • Decking • Sod • Masonry • Roofing',
    before: '/images/landscaping/landscape_before-optimized.webp',
    after: '/images/landscaping/landscape_after-optimized.webp',
    link: null
  },
  {
    category: 'Property Maintenance',
    title: 'Storage Shed Installation',
    description: 'Storage Shed Installation • No permit-required work • Build • Seal & Paint',
    image: '/images/home-repair/distant_shed-optimized.webp',
    link: null
  }
]

const STATS_DATA = [
  { label: 'Years Experience', value: '10+' },
  { label: 'Projects Completed', value: '500+' },
  { label: 'Happy Customers', value: '100+' },
  { label: 'Services Offered', value: '10+' }
]

const Home = () => {
  const { currentWorld, isTechnician, isWeb } = useWorld()
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('all')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [tabJustChanged, setTabJustChanged] = useState(false)
  
  // Get the world-aware path helper function
  const getWorldPath = (path) => {
    if (currentWorld && currentWorld !== 'default') {
      return `/${currentWorld}${path}`
    }
    return path
  }

  // Intersection observers for different sections
  const heroSection = useIntersectionObserver({ threshold: 0.2 })
  const bookingSection = useIntersectionObserver({ threshold: 0.3 })
  const servicesTitle = useIntersectionObserver({ threshold: 0.3 })
  const aboutSection = useIntersectionObserver({ threshold: 0.2 })
  const portfolioTitle = useIntersectionObserver({ threshold: 0.3 })
  const reviewsTitle = useIntersectionObserver({ threshold: 0.3 })
  const ctaSection = useIntersectionObserver({ threshold: 0.3 })
  
  // Filter portfolio based on current world first to get accurate count
  const filteredPortfolio = PORTFOLIO_DATA.filter(item => {
    if (isTechnician) return item.category === 'Property Maintenance' || item.category === 'Landscape'
    if (isWeb) return item.category === 'Web Development'
    return true
  })
  
  // Filter services based on current world
  const filteredServices = SERVICES_DATA.filter(service => {
    if (isTechnician) return service.category === 'property'
    if (isWeb) return service.category === 'digital'
    return true
  })
  
  // Staggered animations for cards (use actual filtered count for portfolio)
  const statsStagger = useStaggeredIntersection(4, { threshold: 0.2 })
  const servicesStagger = useStaggeredIntersection(filteredServices.length, { threshold: 0.1 })
  const portfolioStagger = useStaggeredIntersection(filteredPortfolio.length, { threshold: 0.1 })
  
  // Floating CTA button state
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling past hero section
      const scrolled = window.scrollY > 600
      setShowFloatingCTA(scrolled)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-off-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-500 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container-max mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              ref={heroSection.ref}
              className={`text-white space-y-6 animate-fade-right ${heroSection.isVisible ? 'visible' : ''}`}>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{CONTENT.hero.badge}</span>
                </div>
                <Link 
                  to="/portal"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400/30 to-blue-400/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm animate-pulse hover:from-green-400/40 hover:to-blue-400/40 transition-all cursor-pointer"
                >
                  <span>{CONTENT.hero.cta.portalText}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {CONTENT.hero.title.line1} <br />
                <span className="gradient-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  {isTechnician ? 'Technician' : isWeb ? 'Technician' : CONTENT.hero.title.line2}
                </span>
              </h1>
              
              <p className="text-xl text-white/90">
                {isTechnician 
                  ? 'Property Repairs • Installations • Tech-Savvy Edge'
                  : isWeb 
                  ? 'Web development • Creator Packages • Custom Solutions'
                  : CONTENT.hero.subtitle}
              </p>

              {/* Main CTA Question */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">✅ {CONTENT.hero.mainCta}</h3>
                <p className="text-lg mb-4">{CONTENT.hero.selectPrompt}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isTechnician ? (
                    <>
                      <BookingCTA 
                        buttonText={CONTENT.hero.cta.technicianQuote}
                        buttonStyle="secondary"
                        size="lg"
                        showHelperText={true}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg w-full"
                      />
                      <BookingCTA 
                        buttonText={CONTENT.hero.cta.furnitureBuild}
                        buttonStyle="secondary"
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg w-full"
                      />
                    </>
                  ) : isWeb ? (
                    <>
                      <BookingCTA 
                        buttonText={CONTENT.hero.cta.aiEstimate}
                        buttonStyle="secondary"
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg w-full"
                        showHelperText={true}
                        helperText="⚡ Instant AI"
                      />
                      <BookingCTA 
                        buttonText={CONTENT.hero.cta.consultation}
                        buttonStyle="secondary"
                        size="lg"
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg w-full"
                      />
                    </>
                  ) : (
                    <>
                      <BookingCTA 
                        buttonText={CONTENT.hero.cta.getEstimate}
                        buttonStyle="secondary"
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-lg w-full"
                      />
                      <BookingCTA 
                        buttonText={CONTENT.hero.cta.bookService}
                        buttonStyle="secondary"
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg w-full"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Show badges on desktop only - filtered by world */}
              <div className="flex gap-8 pt-4">
                {isTechnician ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm">{CONTENT.hero.badges.fix}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm">Licensed & Insured</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm">{CONTENT.hero.badges.tech}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm">{CONTENT.hero.badges.online}</span>
                    </div>
                  </>
                )}
              </div>

            {/* Show QuantumSphere on mobile below buttons */}
            <div className="lg:hidden mt-8" style={{ height: '400px' }}>
              <Suspense fallback={
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl animate-pulse flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-xl font-bold">Loading...</div>
                  </div>
                </div>
              }>
                <QuantumSphere>
                  <div className="animate-float">
                    <FloatingVideo />
                  </div>
                </QuantumSphere>
              </Suspense>
            </div>
            </div>

          {/* Show QuantumSphere on desktop on the right */}
          <div className="relative hidden lg:block">
            <Suspense fallback={
              <div className="w-full h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-xl font-bold">Loading...</div>
                </div>
              </div>
            }>
              <QuantumSphere>
                <div className="animate-float">
                  <FloatingVideo />
                </div>
              </QuantumSphere>
            </Suspense>
          </div>
          </div>

          {/* Trust Indicators - Hidden on mobile since QuantumSphere takes this space */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {STATS_DATA.map((stat, index) => (
              <div 
                key={index}
                ref={(el) => statsStagger.setItemRef(index, el)}
                data-item-id={index}
                className={`text-center text-white animate-fade-up delay-${(index + 1) * 100} ${statsStagger.visibleItems[index] ? 'visible' : ''}`}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <Suspense fallback={
        <section className="py-12 bg-white">
          <div className="container-max mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-lg h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      }>
        <SocialProof 
          content={CONTENT.reviews}
          reviewsRef={reviewsTitle.ref}
          isVisible={reviewsTitle.isVisible}
        />
      </Suspense>

      {/* Booking Info Section */}
      {/* <Suspense fallback={
        <section className="py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container-max mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-100 h-32 rounded-lg"></div>
                  <div className="bg-gray-100 h-32 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      }>
        <BookingInfo 
          bookingRef={bookingSection.ref}
          isVisible={bookingSection.isVisible}
          onBookingClick={() => setIsBookingModalOpen(true)}
          content={CONTENT.booking}
        />
      </Suspense> */}

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container-max mx-auto">
          <div 
            ref={servicesTitle.ref}
            className={`text-center mb-12 animate-fade-up ${servicesTitle.isVisible ? 'visible' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isTechnician ? 'Technician' : isWeb ? 'Web Development' : 'Our'} <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-3">
              {isTechnician 
                ? 'Professional home repair and property maintenance services.' 
                : isWeb 
                ? 'Full-stack web development and digital solutions for your business.'
                : CONTENT.services.subtitle}
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-full px-4 py-1.5 text-sm text-yellow-800">
              <span>⚡</span>
              <span className="font-medium">Instant AI estimate coverage for all services</span>
            </div>
          </div>

          {/* Service category tabs - Hidden when filtering by world */}
          {!isTechnician && !isWeb && (
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => {
                  setSelectedServiceCategory('all')
                  setTabJustChanged(true)
                  setTimeout(() => setTabJustChanged(false), 100)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedServiceCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {CONTENT.services.categories.all}
              </button>
              <button
                onClick={() => {
                  setSelectedServiceCategory('property')
                  setTabJustChanged(true)
                  setTimeout(() => setTabJustChanged(false), 100)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedServiceCategory === 'property' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {CONTENT.services.categories.property}
              </button>
              <button
                onClick={() => {
                  setSelectedServiceCategory('tech')
                  setTabJustChanged(true)
                  setTimeout(() => setTabJustChanged(false), 100)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedServiceCategory === 'tech' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {CONTENT.services.categories.tech}
              </button>
              <button
                onClick={() => {
                  setSelectedServiceCategory('digital')
                  setTabJustChanged(true)
                  setTimeout(() => setTabJustChanged(false), 100)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedServiceCategory === 'digital' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {CONTENT.services.categories.digital}
              </button>
            </div>
          )}

          <div key={selectedServiceCategory} className={`grid md:grid-cols-2 ${isWeb ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
            {filteredServices
              .filter(service => !isTechnician && !isWeb ? (selectedServiceCategory === 'all' || service.category === selectedServiceCategory) : true)
              .map((service, index) => (
              <div 
                key={service.id}
                ref={(el) => servicesStagger.setItemRef(service.id, el)}
                data-item-id={service.id}
                className={`service-card group cursor-pointer animate-fade-up delay-${(index % 3 + 1) * 100} ${tabJustChanged || servicesStagger.visibleItems[service.id] !== false ? 'visible' : ''} flex flex-col h-full`}
              >
                <div className={`${service.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-near-black">
                  {service.title}
                </h3>
                
                <p className="text-muted mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6 flex-grow">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <BookingCTA 
                  service={service.title}
                  buttonText={CONTENT.services.cta}
                  buttonStyle="outline"
                  size="sm"
                  className="w-full mt-auto"
                />
              </div>
            ))}
          </div>
          
          {/* CTA after services */}
          <div className="text-center mt-12">
            <div className="bg-primary/5 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">{CONTENT.servicesCta.title}</h3>
              <p className="text-muted mb-6">{CONTENT.servicesCta.subtitle}</p>
              <BookingCTA 
                buttonText={CONTENT.servicesCta.button}
                buttonStyle="primary"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              ref={aboutSection.ref}
              className={`space-y-6 animate-fade-right ${aboutSection.isVisible ? 'visible' : ''}`}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {CONTENT.about.title.split('Quantum Technician')[0]}
                  <span className="gradient-text">Quantum Technician</span>
                </h2>
                <p className="text-lg text-primary/80 italic mt-2">
                  {CONTENT.about.tagline}
                </p>
              </div>
              
              <p className="text-lg text-muted">
                {CONTENT.about.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {CONTENT.about.credentials.map((cred, index) => (
                  <div key={index} className={`bg-white p-4 rounded-lg shadow-md ${index === 0 ? 'border-2 border-green-500' : index === 3 ? 'border-2 border-blue-500' : ''}`}>
                    {index === 0 && <Award className="w-8 h-8 text-primary mb-2" />}
                    {index === 1 && <Clock className="w-8 h-8 text-secondary mb-2" />}
                    {index === 2 && <Shield className="w-8 h-8 text-accent mb-2" />}
                    {index === 3 && <Users className="w-8 h-8 text-purple-500 mb-2" />}
                    <h3 className="font-semibold text-near-black">{cred.title}</h3>
                    <p className="text-sm text-muted">{cred.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4">
                <p className="text-primary font-semibold mb-2">{CONTENT.about.valueProposition.title}</p>
                <p className="text-near-black">
                  {CONTENT.about.valueProposition.text}
                </p>
              </div>

              <BookingCTA 
                buttonText={CONTENT.about.cta}
                buttonStyle="primary"
                size="lg"
                showHelperText={true}
              />
            </div>

            <div className="space-y-8">
              {/* Why Choose Us Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-2xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">{CONTENT.about.whyChoose.title}</h3>
                  
                  <div className="space-y-4">
                    {CONTENT.about.whyChoose.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {index === 0 && <Settings className="w-6 h-6 text-primary" />}
                          {index === 1 && <Lightbulb className="w-6 h-6 text-secondary" />}
                          {index === 2 && <Award className="w-6 h-6 text-accent" />}
                          {index === 3 && <Gauge className="w-6 h-6 text-purple-600" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-near-black">{item.title}</h4>
                          <p className="text-sm text-muted">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Personal Photo */}
              <div className="relative">
                <FramedImage
                  src={CONTENT.about.imagePath}
                  alt={CONTENT.about.imageCaption}
                  frameStyle="modern"
                  aspectRatio="portrait"
                  objectFit="cover"
                  rounded="2xl"
                  shadow={true}
                  hover={true}
                  maxWidth="max-w-sm"
                  maxHeight="max-h-md"
                  width="w-full"
                  caption={CONTENT.about.imageCaption}
                  captionPosition="bottom"
                  className="mx-auto"
                  preferThumb={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section-padding bg-white" id="portfolio">
        <div className="container-max mx-auto">
          <div 
            ref={portfolioTitle.ref}
            className={`text-center mb-12 animate-fade-up ${portfolioTitle.isVisible ? 'visible' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isTechnician ? CONTENT.portfolio.technician.title : isWeb ? CONTENT.portfolio.web.title : ''} <span className="gradient-text">{CONTENT.portfolio.samplesSuffix}</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {isTechnician 
                ? CONTENT.portfolio.technician.subtitle
                : isWeb 
                ? CONTENT.portfolio.web.subtitle
                : CONTENT.portfolio.subtitle}
            </p>
          </div>

          <div className={`grid md:grid-cols-2 ${filteredPortfolio.length > 2 ? 'lg:grid-cols-3' : ''} gap-8`}>
            {filteredPortfolio.map((item, index) => {
              const hasBeforeAfter = item.before && item.after;
              
              return (
                <div 
                  key={index}
                  ref={(el) => portfolioStagger.setItemRef(index, el)}
                  data-item-id={index}
                  className={`group cursor-pointer animate-scale delay-${(index + 1) * 100} ${portfolioStagger.visibleItems[index] ? 'visible' : ''}`}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative h-72 bg-gray-100 overflow-hidden">
                      {hasBeforeAfter ? (
                        // Before/After Layout with BeforeAfterSlider component
                        <Suspense fallback={
                          <div className="w-full h-72 bg-gray-200 animate-pulse"></div>
                        }>
                          <BeforeAfterSlider
                            beforeImage={item.before}
                            afterImage={item.after}
                            beforeAlt={`${item.title} - Before`}
                            afterAlt={`${item.title} - After`}
                            height="h-72"
                            showLabels={true}
                            showInstruction={true}
                          />
                        </Suspense>
                      ) : (
                        // Single Image Layout (Original)
                        <>
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="eager"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" style={{ display: item.image ? 'none' : 'flex' }}>
                            <div className="text-center">
                              <div className="w-20 h-20 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <Hammer className="w-10 h-10 text-primary/50" />
                              </div>
                              <p className="text-muted text-sm">Image Coming Soon</p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Link overlay */}
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-5 h-5 text-primary" />
                        </a>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="text-sm text-primary font-semibold mb-2 uppercase tracking-wider">{item.category}</div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-muted">{item.description}</p>
                      {hasBeforeAfter && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-primary/70">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-medium">Transformation Project</span>
                        </div>
                      )}
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:gap-3 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Site
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link 
              to={getWorldPath('/portfolio')} 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all hover:text-blue-700"
              aria-label="View full portfolio of completed projects"
            >
              {CONTENT.portfolio.viewFull}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* CTA after portfolio */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">{CONTENT.portfolio.ctaSection.title}</h3>
              <p className="text-white/90 mb-6">{CONTENT.portfolio.ctaSection.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <BookingCTA 
                  buttonText={CONTENT.portfolio.ctaSection.bookButton}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
                />
                <BookingCTA 
                  buttonText={CONTENT.portfolio.ctaSection.quoteButton}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section - NEW */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-green-600">
        <div className="container-max mx-auto px-6 text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{CONTENT.guarantee.title}</h2>
          <p className="text-2xl mb-2">{CONTENT.guarantee.tagline}</p>
          <div className="flex justify-center gap-8 mt-8">
            {CONTENT.guarantee.badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                {badge.icon === 'checkCircle' && <CheckCircle className="w-6 h-6" />}
                {badge.icon === 'clock' && <Clock className="w-6 h-6" />}
                {badge.icon === 'award' && <Award className="w-6 h-6" />}
                <span className="text-lg">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div 
          ref={ctaSection.ref}
          className={`container-max mx-auto px-6 text-center text-white animate-zoom ${ctaSection.isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isTechnician 
              ? CONTENT.cta.technician.title
              : isWeb 
              ? CONTENT.cta.web.title
              : CONTENT.cta.title}
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {isTechnician 
              ? CONTENT.cta.technician.subtitle
              : isWeb 
              ? CONTENT.cta.web.subtitle
              : CONTENT.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingCTA 
              buttonText={CONTENT.cta.buttons.bookNow}
              size="lg"
              className="bg-none text-primary hover:bg-primary/10"
              showHelperText={true}
              helperText={CONTENT.cta.buttons.helperText}
            />
            {/* <a 
              href={`tel:${CONTENT.phone}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
            >
              <Phone className="w-5 h-5" />
              {CONTENT.cta.buttons.call}
            </a> */}
          </div>

          <div className="flex justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{CONTENT.cta.badges.freeQuotes}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{CONTENT.cta.badges.licensed}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{CONTENT.cta.badges.satisfaction}</span>
            </div>
          </div>
          
          <p className="text-xs text-white/70 mt-4">
            {CONTENT.cta.footer}
          </p>
        </div>
      </section>

      <Footer />
      
      {/* Booking Modal */}
      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      </Suspense>
      
      {/* Floating Booking Button - positioned to not overlap with chatbot */}
      <div 
        className={`fixed bottom-20 right-2 sm:bottom-24 sm:right-8 z-40 transition-all duration-300 transform ${
          showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <BookingCTA 
          buttonText={CONTENT.floatingButton.text}
          buttonStyle="primary"
          size="lg"
          className="shadow-2xl hover:scale-105 transition-transform text-sm sm:text-base"
          showHelperText={true}
          helperText={CONTENT.floatingButton.helperText}
        />
      </div>
    </div>
  )
}

export default Home