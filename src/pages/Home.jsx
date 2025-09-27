import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BookingCTA from '../Components/BookingCTA'
import BookingModal from '../Components/BookingModal'
import QuantumSphere from '../Components/QuantumSphere'
import FloatingVideo from '../Components/FloatingVideo'
import FramedImage from '../Components/FramedImage'
import BeforeAfterSlider from '../Components/BeforeAfterSlider'
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Wrench, Code, Home as HomeIcon, TreePine, Car, Wifi,
  Shield, Clock, Award, Users, ChevronRight,
  Star, Phone, Mail, MapPin, CheckCircle,
  Hammer, Paintbrush, Zap, Droplets, Lightbulb,
  Monitor, Smartphone, Globe, Database, Server,
  Leaf, Flower, Scissors, Sun, CloudRain,
  Sparkles, Settings, Gauge, ArrowRight, Calendar,
  ExternalLink, MessageSquare
} from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    badge: '10+ Years Experience • Computer Science Degree • Master Craftsman',
    title: {
      line1: 'Quantum',
      line2: 'Handyman'
    },
    subtitle: 'A new kind of handyman for your property & technology needs. No collars. Just capability.',
    cta: {
      bookService: 'Book a Service',
      seeWork: 'See Our Work',
      helperText: '⚡ Instant AI estimates available'
    },
    badges: {
      fix: 'Property Maintenance & Repairs',
      tech: 'Tech & Digital',
      online: 'Show Up Online',
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
    subtitle: 'Deliver a traditional handyman, equipped with deep modern tech expertise.',
    categories: {
      all: 'All Services',
      property: 'Property',
      tech: 'Tech',
      digital: 'Digital Web Services',
    },
    cta: 'Book This Service'
  },
  
  about: {
    title: 'Mission: Quantum Handyman',
    description: 'To provide comprehensive solutions, uniquely deep multidisciplinary skills & a systematic problem-solving approach for modern homeowners & businesses. Quantum Handyman achieves this by combining craftsmanship with engineering discipline, delivered with community values & professionalism.',
    valueProposition: {
      title: 'Value Proposition',
      text: 'A new kind of handyman for your property & technology needs | Craftsman + CS-degree, with deep multi-disciplinary expertise.'
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
            Built & sold first company. 15,000+ jobs completed average{' '}
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
        description: 'React, Node.js, Python, SQL, No-SQL, Java, Hibernate, Spring, Swift, Xcode, AWS, Vercel, iOS, Android etc.'
      },
      {
        title: 'Property Finance Background',
        description: 'Former mortgage officer (NMLS #2318525) + Real Estate School. Deep property knowledge.'
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
    viewFull: 'View Portfolio'
  },
  
  reviews: {
    title: 'What Our Clients Say',
    subtitle: 'Check out our reviews and ratings from satisfied customers',
    googleTitle: 'Google Reviews',
    rating: '5.0 Rating • 100% Satisfaction',
    description: 'Read verified customer reviews and see why homeowners trust Quantum Handyman for both their tech and traditional service needs.',
    googleButton: 'View Reviews on Google',
    googleUrl: 'https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review', // Replace with your actual Google Business URL
    helperText: 'See verified customer reviews on Google Business'
  },
  
  cta: {
    title: 'Experience Quantum Advantage.',
    subtitle: 'Hire a handyman who can solve problems at every level.',
    buttons: {
      bookNow: 'Book Now',
      // call: 'Call (555) 123-4567',
      helperText: '⚡ Instant AI estimates available'
    },
    badges: {
      freeQuotes: 'AI-Powered Instant Quotes',
      licensed: 'Licensed & Insured',
      satisfaction: 'Satisfaction Guaranteed'
    },
    footer: 'We use a secure booking platform to manage appointments and ensure the best service experience.'
  },
  
  phone: '555-123-4567'
}

// Data objects with their text content
const SERVICES_DATA = [
  {
    id: 'home-repairs',
    title: 'Home Repairs & Maintenance',
    icon: HomeIcon,
    color: 'bg-blue-500',
    description: 'Professional home repair services from Furniture assembly to General maintenance',
    features: ['Drywall, Roofs, Paint & Caulking', 'Doors, locks, hinges & trim work', 'No permit-required work'],
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
  {
    id: 'web-dev',
    title: 'Web & Digital',
    icon: Code,
    color: 'bg-purple-500',
    description: 'Digital presence solutions for small businesses, Content Creators or Social Media Influencers.',
    features: ['Custom web development or Wordpress, Wix, etc., support & upgrades', 'Shopify, Instagram, Personal Branding, etc.', 'SEO, Google, Online booking or AI integration 🤖'],
    category: 'digital'
  },
  {
    id: 'smart-home',
    title: 'Smart Homes & Automation',
    icon: Wifi,
    color: 'bg-cyan-500',
    description: 'Software engineer expertise applied to home automation. IoT setup & integration.',
    features: ['Home Assistants & Smart Cameras ','Smart thermostats & Custom Lighting','PC & Device Troubleshooting', 'Custom automation scripts', 'Computer Troubleshooting'],
    category: 'tech'
  },

]


const PORTFOLIO_DATA = [
  {
    category: 'Web Development',
    title: 'Job Management Platform',
    description: 'Realtime SaaS jobs dispatch platform with realtime job tracking, Dispatching, messaging, Disputes, AI integrations, and payment processing.',
    image: '/images/web-dev/Dandymen_io.png',
    link: null // Optional link to project
  },
  {
    category: 'Smart Home',
    title: 'Smart Home Automation',
    description: 'Integrated lighting, Security Cameras, home assistants etc.',
    image: '/images/smart-home/smart_home_app.png',
    link: null
  },
  {
    category: 'Landscape',
    title: 'Backyard Transformation',
    description: 'Stamped concrete Patio • Irrigation • Ceiling drywall • Decking • Sod • Masonry • Roofing',
    before: '/images/landscaping/landscape_before.png',
    after: '/images/landscaping/landscape_after.png',
    link: null
  },
  {
    category: 'Property Maintenance',
    title: 'Storage Shed Installation',
    description: 'Storage Shed Installation • No permit-required work • Build • Seal & Paint',
    image: '/images/home-repair/distant_shed.png',
    link: null
  }
]

const STATS_DATA = [
  { label: 'Years Experience', value: '10+' },
  { label: 'Jobs Completed', value: '15,000+' },
  { label: 'Happy Customers', value: '100+' },
  { label: 'Services Offered', value: '10+' }
]

const Home = () => {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('all')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Intersection observers for different sections
  const heroSection = useIntersectionObserver({ threshold: 0.2 })
  const bookingSection = useIntersectionObserver({ threshold: 0.3 })
  const servicesTitle = useIntersectionObserver({ threshold: 0.3 })
  const aboutSection = useIntersectionObserver({ threshold: 0.2 })
  const portfolioTitle = useIntersectionObserver({ threshold: 0.3 })
  const reviewsTitle = useIntersectionObserver({ threshold: 0.3 })
  const ctaSection = useIntersectionObserver({ threshold: 0.3 })
  
  // Staggered animations for cards
  const statsStagger = useStaggeredIntersection(4, { threshold: 0.2 })
  const servicesStagger = useStaggeredIntersection(6, { threshold: 0.1 })
  const portfolioStagger = useStaggeredIntersection(4, { threshold: 0.1 })

  return (
    <div className="min-h-screen bg-off-white">
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm animate-pulse">
                  <span>⚡</span>
                  <span>Instant AI Estimates</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {CONTENT.hero.title.line1} <br />
                <span className="gradient-text bg-gradient-to-r from-yellow-300 to-orange-400">{CONTENT.hero.title.line2}</span>
              </h1>
              
              <p className="text-xl text-white/90">
                {CONTENT.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <BookingCTA 
                  buttonText={CONTENT.hero.cta.bookService}
                  buttonStyle="primary"
                  size="lg"
                  className="bg-none text-primary hover:bg-primary/10"
                  showHelperText={true}
                  helperText={CONTENT.hero.cta.helperText}
                />
                <a 
                  href="#portfolio" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all"
                >
                  {CONTENT.hero.cta.seeWork}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Show badges on desktop only */}
              <div className="flex gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">{CONTENT.hero.badges.fix}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">{CONTENT.hero.badges.tech}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">{CONTENT.hero.badges.online}</span>
                </div>
              </div>

              {/* Show QuantumSphere on mobile below buttons */}
              <div className="lg:hidden mt-8" style={{ height: '400px' }}>
                <QuantumSphere>
                  <div className="animate-float">
                    <FloatingVideo />
                  </div>
                </QuantumSphere>
              </div>
            </div>

            {/* Show QuantumSphere on desktop on the right */}
            <div className="relative hidden lg:block">
              <QuantumSphere>
                <div className="animate-float">
                  <FloatingVideo />
                </div>
              </QuantumSphere>
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

      {/* Booking Info Section */}
      <section className="py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container-max mx-auto px-6">
          <div 
            ref={bookingSection.ref}
            className={`bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto animate-scale ${bookingSection.isVisible ? 'visible' : ''}`}>
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{CONTENT.booking.title}</h3>
              <p className="text-gray-600 text-lg">{CONTENT.booking.description}</p>
            </div>
            
            {/* Features Bar */}
            <div className="flex justify-center gap-6 mb-6 py-3 bg-gray-50 rounded-lg">
              {CONTENT.booking.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="text-sm">{feature.icon}</span>
                  <span className="text-xs font-medium text-gray-600">{feature.text}</span>
                </div>
              ))}
            </div>
            {/* Streamlined Two-column layout */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Booking Steps */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">🎯</span> {CONTENT.booking.bookingSteps.title}
                </h4>
                <div className="space-y-2">
                  {CONTENT.booking.bookingSteps.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{step.icon}</span>
                      <span className="text-gray-700">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Estimate Steps */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">💰</span> {CONTENT.booking.estimateSteps.title}
                </h4>
                <div className="space-y-2">
                  {CONTENT.booking.estimateSteps.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{step.icon}</span>
                      <span className="text-gray-700">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            
            {/* CTA Button */}
            <div className="text-center">
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Calendar className="w-5 h-5" />
                {CONTENT.booking.cta.primary}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500 mt-3">
                💡 Not sure? Start with a <span className="font-medium">Free Estimate</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container-max mx-auto">
          <div 
            ref={servicesTitle.ref}
            className={`text-center mb-12 animate-fade-up ${servicesTitle.isVisible ? 'visible' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {CONTENT.services.title.split(' ')[0]} <span className="gradient-text">{CONTENT.services.title.split(' ')[1]}</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-3">
              {CONTENT.services.subtitle}
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-full px-4 py-1.5 text-sm text-yellow-800">
              <span>⚡</span>
              <span className="font-medium">Instant AI estimate coverage for all services</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedServiceCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedServiceCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              {CONTENT.services.categories.all}
            </button>
            <button
              onClick={() => setSelectedServiceCategory('property')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedServiceCategory === 'property' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              {CONTENT.services.categories.property}
            </button>
            <button
              onClick={() => setSelectedServiceCategory('tech')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedServiceCategory === 'tech' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              {CONTENT.services.categories.tech}
            </button>
            <button
              onClick={() => setSelectedServiceCategory('digital')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedServiceCategory === 'digital' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              {CONTENT.services.categories.digital}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA
              .filter(service => selectedServiceCategory === 'all' || service.category === selectedServiceCategory)
              .map((service, index) => (
              <div 
                key={service.id}
                ref={(el) => servicesStagger.setItemRef(service.id, el)}
                data-item-id={service.id}
                className={`service-card group cursor-pointer animate-fade-up delay-${(index % 3 + 1) * 100} ${servicesStagger.visibleItems[service.id] ? 'visible' : ''}`}
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
                
                <ul className="space-y-2 mb-6">
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
                  className="w-full"
                />
              </div>
            ))}
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
              <h2 className="text-3xl md:text-4xl font-bold">
                {CONTENT.about.title.split('Quantum Handyman')[0]}
                <span className="gradient-text">Quantum Handyman</span>
              </h2>
              
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
                    <h4 className="font-semibold text-near-black">{cred.title}</h4>
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
                  src="/images/profile/Me&Pops.png"
                  alt="Morgan B. - Quantum Handyman"
                  frameStyle="modern"
                  aspectRatio="portrait"
                  objectFit="cover"
                  rounded="2xl"
                  shadow={true}
                  hover={true}
                  maxWidth="max-w-sm"
                  maxHeight="max-h-md"
                  width="w-full"
                  caption="Morgan B. - Quantum Handyman"
                  captionPosition="bottom"
                  className="mx-auto"
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
              {CONTENT.portfolio.title.split(' ')[0]} <span className="gradient-text">{CONTENT.portfolio.title.split(' ')[1]}</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {CONTENT.portfolio.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PORTFOLIO_DATA.map((item, index) => {
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
                        <BeforeAfterSlider
                          beforeImage={item.before}
                          afterImage={item.after}
                          beforeAlt={`${item.title} - Before`}
                          afterAlt={`${item.title} - After`}
                          height="h-72"
                          showLabels={true}
                          showInstruction={true}
                        />
                      ) : (
                        // Single Image Layout (Original)
                        <>
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
              to="/portfolio" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              {CONTENT.portfolio.viewFull}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max mx-auto text-center">
          <div 
            ref={reviewsTitle.ref}
            className={`mb-12 animate-fade-up ${reviewsTitle.isVisible ? 'visible' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {CONTENT.reviews.title.split('Clients Say')[0]}
              <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
              {CONTENT.reviews.subtitle}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex justify-center mb-6">
                {/* Google Logo/Icon */}
                <div className="flex items-center gap-2">
                  <svg className="w-10 h-10" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  <span className="text-2xl font-bold text-gray-700">{CONTENT.reviews.googleTitle}</span>
                </div>
              </div>
              
              {/* Star Rating Display */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-6">
                {/* {CONTENT.reviews.rating} */}
              </p>
              
              <p className="text-muted mb-8">
                {/* {CONTENT.reviews.description} */}
              </p>
              
              <a
                href={CONTENT.reviews.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-6 h-6" />
                {CONTENT.reviews.googleButton}
                <ExternalLink className="w-5 h-5" />
              </a>
              
              <p className="text-xs text-gray-500 mt-4">
                {CONTENT.reviews.helperText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div 
          ref={ctaSection.ref}
          className={`container-max mx-auto px-6 text-center text-white animate-zoom ${ctaSection.isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {CONTENT.cta.title}
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {CONTENT.cta.subtitle}
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
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  )
}

export default Home