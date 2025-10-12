import React, { useState, useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BookingCTA from '../Components/BookingCTA'
import { useWorld } from '../contexts/WorldContext'
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Wrench, Code, Home as HomeIcon, TreePine, Wifi,
  CheckCircle, ArrowRight, Hammer, Paintbrush,
  Zap, Droplets, Lightbulb, Monitor, Smartphone,
  Globe, Database, Server, Leaf, Flower, Scissors,
  Sun, CloudRain, Sparkles, Settings, Gauge,
  Shield, Clock, Award, DollarSign
} from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    title: 'Our Services',
    subtitle: 'Deliver traditional handyman services, equipped with deep modern tech expertise'
  },
  
  categories: [
    { id: 'all', name: 'All Services', count: 8 },
    { id: 'property', name: 'Property', count: 3 },
    { id: 'tech', name: 'Tech', count: 1 },
    { id: 'digital', name: 'Digital Web Services', count: 4 }
  ],
  
  serviceDetails: {
    priceLabel: 'Starting from:',
    timeLabel: 'Time:',
    bookButton: 'Book This Service',
    bookHelperText: '⚡ AI estimate in seconds',
    viewDetails: 'View Details',
    showLess: 'Show Less',
    whatWeOffer: 'What We Offer',
    whyChooseUs: 'Why Choose Us',
    trustBadges: {
      insured: 'Insured',
      licensed: 'Certified',
      // guaranteed: 'Guaranteed'
    }
  },
  
  additionalServices: {
    title: "Don't See What You Need?",
    description: 'We offer many additional services not listed here. From minor repairs to major projects, if it needs fixing or building, we can probably help!',
    cta: 'Contact us with your specific needs'
  },
  
  cta: {
    title: 'Ready to Get Started?',
    subtitle: 'Book your service today and experience the Quantum Handyman difference',
    buttons: {
      bookNow: 'Book Now',
      getQuote: 'Get Free Quote',
      helperText: '⚡ Instant AI estimates available'
    }
  }
}

// Services Data - Aligned with Home.jsx offerings
const SERVICES_DATA = [
  // Property Services (Handyman)
  {
    id: 'home-repairs',
    category: 'property',
    title: 'Home Repairs & Maintenance',
    icon: HomeIcon,
    color: 'bg-blue-500',
    description: 'Professional home repair services - Quick Fix ($125/hr) or Punch List Pro ($169/2hr)',
    shortDesc: 'Professional home repair and maintenance services',
    priceRange: '$125 - $169 + materials',
    timeEstimate: '1-2 hours typical',
    subServices: [
      { name: 'Quick Fix Package', desc: '1 hour service - weather stripping, caulking, filters, small assembly' },
      { name: 'Punch List Pro', desc: '2 hour block - furniture assembly, locks, hinges, gutters, doors, windows' },
      { name: 'Drywall & Painting', desc: 'Repairs, patches, caulking and interior painting' },
      { name: 'Property Preservation', desc: 'Maintenance and preservation services' },
      { name: 'General Maintenance', desc: 'No permit-required work' },
      { name: 'Extensions Available', desc: '+30min blocks ($35 each)' }
    ],
    benefits: [
      'Trip fee included in price',
      'Same-day service available',
      'Multi-task efficiency guarantee',
      'Transparent pricing'
    ]
  },
  {
    id: 'home-setup',
    category: 'property',
    title: 'Home Tech Setup',
    icon: Settings,
    color: 'bg-purple-500',
    description: '2-3 device smart home setup + TV mounting (up to 65") - Complete package for $199',
    shortDesc: 'Professional smart home and TV installation',
    priceRange: '$199 + materials',
    timeEstimate: '3 hours typical',
    subServices: [
      { name: 'TV Mounting', desc: 'Up to 65" TV mounting + streaming optimization' },
      { name: 'Smart Devices (2-3)', desc: 'Smart locks, cameras, or speakers installation' },
      { name: 'Network Setup', desc: 'WiFi optimization + device training' },
      { name: 'Mac/PC Integration', desc: 'Computer and mobile device integration' },
      { name: 'Extra Devices', desc: '+$49 per additional device' },
      { name: 'Whole-Home Network', desc: '+$149 for complete network setup' }
    ],
    benefits: [
      'All mounting hardware included',
      'Network setup + device training',
      'Clean installation guaranteed',
      'Mac/PC/mobile integration included'
    ]
  },
  {
    id: 'landscaping',
    category: 'property',
    title: 'Landscaping & Outdoor',
    icon: TreePine,
    color: 'bg-green-500',
    description: 'Upgrade your outdoor spaces with professional landscape services',
    shortDesc: 'Comprehensive landscaping and outdoor services',
    priceRange: 'Custom quote + materials',
    timeEstimate: 'Varies by project',
    subServices: [
      { name: 'Decks & Patios', desc: 'Construction, repair and maintenance' },
      { name: 'Masonry Work', desc: 'Stone work, retaining walls, pathways' },
      { name: 'Outdoor Lighting', desc: 'Landscape and security lighting installation' },
      { name: 'Custom Landscaping', desc: 'Design and installation of custom landscapes' },
      { name: 'Landscape Maintenance', desc: 'Regular maintenance and seasonal services' },
      { name: 'Sprinkler Systems', desc: 'Maintenance, repair, setup and programming' },
      { name: 'Tree Pruning', desc: 'Professional tree trimming and maintenance' }
    ],
    benefits: [
      'Eco-friendly practices',
      'Smart irrigation integration',
      'Seasonal maintenance plans',
      'Design consultation included'
    ]
  },

  // Tech Services (Estimates & Consultations)
  {
    id: 'estimates-consultation',
    category: 'tech',
    title: 'Free Estimates & Consultations',
    icon: Wifi,
    color: 'bg-cyan-500',
    description: 'Get professional estimates with AI-powered instant quotes or expert consultations',
    shortDesc: 'Free estimates and project consultations',
    priceRange: 'Free',
    timeEstimate: '30min - 1hr typical',
    subServices: [
      { name: 'Free Estimate', desc: 'Upload photos for instant quote OR get AI assessment' },
      { name: 'Written Estimate', desc: 'Professional written estimate with project breakdown' },
      { name: 'Timeline Planning', desc: 'Detailed project timeline and milestone planning' },
      { name: 'Project Consultation', desc: '30min expert consultation + custom project roadmap' },
      { name: 'Material Recommendations', desc: 'Expert advice on materials and sourcing' },
      { name: 'AI Assessment', desc: 'Free with promo code - instant property analysis' }
    ],
    benefits: [
      'No obligation quotes',
      'AI-powered instant estimates',
      'In-person or video consultation',
      'Custom project proposals included'
    ]
  },

  // Digital Services (Web Development)
  {
    id: 'website-pro',
    category: 'digital',
    title: 'Website PRO',
    icon: Code,
    color: 'bg-purple-500',
    description: '1-page professional website with SEO - Custom Code or WordPress, Wix etc. $399',
    shortDesc: 'Professional website development',
    priceRange: '$399 (1 page)',
    timeEstimate: '2 weeks typical',
    subServices: [
      { name: '1 Page Responsive Website', desc: 'Mobile optimized + SEO included' },
      { name: 'Contact Forms', desc: 'Professional contact forms with validation' },
      { name: 'Google Business Profile', desc: 'Complete setup and optimization' },
      { name: '30 Day Support', desc: 'Post-launch support included' },
      { name: 'Additional Pages', desc: '+$250 per additional page' },
      { name: 'Popular Add-ons', desc: 'Booking (+$400), Payments (+$400), APIs (+$500)' }
    ],
    benefits: [
      'CS degree + certified developer',
      'Mobile responsive design',
      'SEO optimization included',
      '30 day support included'
    ]
  },
  {
    id: 'website-builders',
    category: 'digital',
    title: 'WordPress, Wix & Squarespace',
    icon: Globe,
    color: 'bg-indigo-500',
    description: 'Professional websites on popular platforms - Part of Website PRO package ($399)',
    shortDesc: 'CMS and website builder solutions',
    priceRange: '$399 (1 page)',
    timeEstimate: '2 weeks typical',
    subServices: [
      { name: 'WordPress Development', desc: 'Custom themes and plugin configuration' },
      { name: 'Wix Design', desc: 'Professional Wix website design and setup' },
      { name: 'Squarespace Setup', desc: 'Complete Squarespace configuration' },
      { name: 'Platform Migration', desc: 'Moving sites between platforms' },
      { name: 'SEO & Google Business', desc: 'On-page SEO and GMB setup included' },
      { name: 'Additional Pages', desc: '+$250 per additional page' }
    ],
    benefits: [
      'Mobile-responsive design',
      'SEO optimization included',
      '30 day support included',
      'Training documentation provided'
    ]
  },
  {
    id: 'creator-package',
    category: 'digital',
    title: 'Creator Package',
    icon: Smartphone,
    color: 'bg-pink-500',
    description: 'Professional link-in-bio site + social setup for content creators - Starting at $299',
    shortDesc: 'Creator economy solutions',
    priceRange: '$299',
    timeEstimate: '3 days typical',
    subServices: [
      { name: 'Custom Link-in-bio Site', desc: 'Professional site with custom domain' },
      { name: 'Social Media Integration', desc: 'All platforms + branding consistency' },
      { name: 'Payment Links', desc: 'Tip jar and payment setup included' },
      { name: '7 Day Launch Support', desc: 'Support during initial launch period' },
      { name: 'Content Scheduling', desc: '+$199 for scheduling tools setup' },
      { name: 'Analytics Dashboard', desc: '+$299 for custom analytics' }
    ],
    benefits: [
      'Custom domain included',
      'Social media optimization',
      'Payment integration included',
      '7 day launch support'
    ]
  },
  {
    id: 'website-care-plan',
    category: 'digital',
    title: 'Website Care Plan',
    icon: Sparkles,
    color: 'bg-orange-500',
    description: 'Ongoing website maintenance + 3 hours monthly support - $149/month',
    shortDesc: 'Monthly maintenance and support',
    priceRange: '$149/month',
    timeEstimate: '3 hours/month',
    subServices: [
      { name: '3 Hours Monthly Support', desc: 'Updates, content changes, and fixes' },
      { name: 'Security Monitoring', desc: 'Regular security scans and updates' },
      { name: 'Backups', desc: 'Automated daily/weekly backups' },
      { name: 'Performance Optimization', desc: 'Speed optimization and monitoring' },
      { name: 'Priority Support', desc: 'Email/text support with priority response' },
      { name: 'Upgrade Options', desc: '6 hours/mo (+$99) or 10 hours/mo (+$149)' }
    ],
    benefits: [
      '3 hours monthly support included',
      'Security monitoring & backups',
      'Performance optimization',
      'Priority email/text support'
    ]
  }
]

const Services = () => {
  const { currentWorld, isHandyman, isWeb } = useWorld()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedService, setExpandedService] = useState(null)
  const [worldKey, setWorldKey] = useState(currentWorld || 'default')
  
  // Reset category and force re-render when world changes
  useEffect(() => {
    setSelectedCategory('all')
    setExpandedService(null) // Also close any expanded services
    setWorldKey(currentWorld || 'default') // Force component re-render
  }, [currentWorld])
  
  // Intersection observers
  const heroSection = useIntersectionObserver({ threshold: 0.3 })
  const categoryFilter = useIntersectionObserver({ threshold: 0.3 })
  const additionalNote = useIntersectionObserver({ threshold: 0.3 })
  const ctaSection = useIntersectionObserver({ threshold: 0.3 })
  
  // Staggered animations for services
  const servicesStagger = useStaggeredIntersection(8, { threshold: 0.1 })

  // Filter services based on current world
  const worldFilteredServices = SERVICES_DATA.filter(service => {
    if (isHandyman) return service.category === 'property' || service.category === 'tech'
    if (isWeb) return service.category === 'digital'
    return true
  })

  // Apply category filter on top of world filter
  const filteredServices = worldFilteredServices.filter(
    service => selectedCategory === 'all' || service.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div 
          ref={heroSection.ref}
          className={`container-max mx-auto px-6 text-center text-white animate-fade-down ${heroSection.isVisible ? 'visible' : ''}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isHandyman ? 'Handyman Services' : isWeb ? 'Web Development Services' : CONTENT.hero.title}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {isHandyman 
              ? 'Professional home repair and maintenance services with a tech-savvy approach'
              : isWeb 
              ? 'Full-stack development and digital solutions for your business needs'
              : CONTENT.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding">
        <div className="container-max mx-auto">
          {/* Category Filter */}
          {/* Only show category filter when not in a specific world, or when in handyman world (since it has multiple categories) */}
          {(!isWeb) && (
            <div 
              ref={categoryFilter.ref}
              className={`flex flex-wrap justify-center gap-4 mb-12 animate-fade-up ${categoryFilter.isVisible ? 'visible' : ''}`}>
              {/* Dynamic categories based on world */}
              {isHandyman ? (
                <>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-md'
                    }`}
                  >
                    All Services
                    <span className="ml-2 text-sm opacity-80">({worldFilteredServices.length})</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('property')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedCategory === 'property'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-md'
                    }`}
                  >
                    Property
                    <span className="ml-2 text-sm opacity-80">({worldFilteredServices.filter(s => s.category === 'property').length})</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('tech')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedCategory === 'tech'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-md'
                    }`}
                  >
                    Tech
                    <span className="ml-2 text-sm opacity-80">({worldFilteredServices.filter(s => s.category === 'tech').length})</span>
                  </button>
                </>
              ) : !isWeb ? (
                // Show all categories when no world is selected
                CONTENT.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-md'
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 text-sm opacity-80">
                      ({category.id === 'all' 
                        ? worldFilteredServices.length 
                        : worldFilteredServices.filter(s => s.category === category.id).length})
                    </span>
                  </button>
                ))
              ) : null}
            </div>
          )}

          {/* Services Grid - key forces re-render on world change */}
          <div key={worldKey} className={`${isWeb ? 'grid md:grid-cols-2 gap-8 items-start' : 'space-y-8'}`}>
            {filteredServices.map((service, index) => (
              <div 
                key={`${worldKey}-${service.id}`}
                ref={(el) => servicesStagger.setItemRef(service.id, el)}
                data-item-id={service.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl animate-fade-up delay-${(index + 1) * 100} self-start ${servicesStagger.visibleItems[service.id] !== false ? 'visible' : ''}`}
              >
                {/* Service Header */}
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                        <p className="text-muted mb-4">{service.description}</p>
                        
                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-muted">{CONTENT.serviceDetails.priceLabel} <strong>{service.priceRange}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-muted">{CONTENT.serviceDetails.timeLabel} <strong>{service.timeEstimate}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col gap-3">
                      <BookingCTA 
                        service={service.title}
                        buttonText={CONTENT.serviceDetails.bookButton}
                        buttonStyle="primary"
                        showHelperText={true}
                        helperText={CONTENT.serviceDetails.bookHelperText}
                      />
                      <button
                        onClick={() => setExpandedService(
                          expandedService === service.id ? null : service.id
                        )}
                        className="text-primary font-medium text-sm hover:underline flex items-center justify-center gap-1"
                      >
                        {expandedService === service.id ? CONTENT.serviceDetails.showLess : CONTENT.serviceDetails.viewDetails}
                        <ArrowRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedService === service.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedService === service.id && (
                    <div className="mt-8 pt-8 border-t border-lines animate-fade-up visible">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Sub-services */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">{CONTENT.serviceDetails.whatWeOffer}</h3>
                          <div className="space-y-3">
                            {service.subServices.map((subService, index) => (
                              <div key={index} className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-near-black">{subService.name}</p>
                                  <p className="text-sm text-muted">{subService.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">{CONTENT.serviceDetails.whyChooseUs}</h3>
                          <div className="bg-gray-50 rounded-xl p-6">
                            <div className="space-y-3">
                              {service.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  <p className="text-muted">{benefit}</p>
                                </div>
                              ))}
                            </div>
                            
                            {/* Trust Badges */}
                            <div className="flex gap-4 mt-6 pt-6 border-t border-lines">
                              <div className="flex items-center gap-2 text-sm text-muted">
                                <Shield className="w-4 h-4 text-primary" />
                                <span>{CONTENT.serviceDetails.trustBadges.insured}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted">
                                <Award className="w-4 h-4 text-primary" />
                                <span>{CONTENT.serviceDetails.trustBadges.licensed}</span>
                              </div>
                              {/* <div className="flex items-center gap-2 text-sm text-muted">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span>{CONTENT.serviceDetails.trustBadges.guaranteed}</span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Services Note */}
          <div 
            ref={additionalNote.ref}
            className={`mt-12 bg-blue-50 border-l-4 border-primary rounded-r-lg p-6 animate-scale ${additionalNote.isVisible ? 'visible' : ''}`}>
            <h3 className="font-semibold text-primary mb-2">
              {isHandyman 
                ? "Need Something Else Fixed?" 
                : isWeb 
                ? "Need Custom Development?"
                : CONTENT.additionalServices.title}
            </h3>
            <p className="text-muted mb-4">
              {isHandyman 
                ? 'We offer many additional repair and maintenance services not listed here. From minor fixes to major home improvements, we can help!'
                : isWeb 
                ? 'We specialize in custom web solutions tailored to your specific needs. From complex applications to unique integrations, let\'s discuss your project!'
                : CONTENT.additionalServices.description}
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              {CONTENT.additionalServices.cta}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div 
          ref={ctaSection.ref}
          className={`container-max mx-auto px-6 text-center text-white animate-zoom ${ctaSection.isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isHandyman 
              ? 'Ready to Fix Your Property?' 
              : isWeb 
              ? 'Ready to Build Your Digital Presence?'
              : CONTENT.cta.title}
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {isHandyman 
              ? 'Professional handyman services with transparent pricing and satisfaction guaranteed'
              : isWeb 
              ? 'Transform your ideas into powerful web applications with expert development'
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
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
            >
              {CONTENT.cta.buttons.getQuote}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Services