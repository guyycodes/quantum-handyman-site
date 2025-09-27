import React, { useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BookingCTA from '../Components/BookingCTA'
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
    { id: 'all', name: 'All Services', count: 4 },
    { id: 'property', name: 'Property', count: 2 },
    { id: 'tech', name: 'Tech', count: 1 },
    { id: 'digital', name: 'Digital Web Services', count: 1 }
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
      licensed: 'Licensed',
      guaranteed: 'Guaranteed'
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

// Services Data
const SERVICES_DATA = [
  {
    id: 'home-repairs',
    category: 'property',
    title: 'Home Repairs & Maintenance',
    icon: HomeIcon,
    color: 'bg-blue-500',
    description: 'Professional home repair services from furniture assembly to general maintenance',
    shortDesc: 'Professional home repair and maintenance services',
    priceRange: '$195 - $695 + materials',
    timeEstimate: '1-6 hours typical',
    subServices: [
      { name: 'Drywall & Painting', desc: 'Repairs, patches, caulking and interior painting' },
      { name: 'Roofing Repairs', desc: 'Minor roof repairs and maintenance' },
      { name: 'Doors & Locks', desc: 'Door adjustments, locks, hinges & trim work' },
      { name: 'Furniture Assembly', desc: 'Professional assembly of all furniture types' },
      { name: 'General Maintenance', desc: 'No permit-required work' },
      { name: 'Minor Repairs', desc: 'Non permit-required work' }
    ],
    benefits: [
      'Licensed and insured work',
      'Same-day service available',
      'Warranty on all repairs',
      'Transparent pricing'
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
    timeEstimate: 'Typical Hours can Vary by Project',
    subServices: [
      { name: 'Decks & Patios', desc: 'Construction, repair and maintenance' },
      { name: 'Masonry Work', desc: 'Stone work, retaining walls, pathways' },
      { name: 'Outdoor Lighting', desc: 'Landscape and security lighting installation' },
      { name: 'Custom Landscaping', desc: 'Design and installation of custom landscapes' },
      { name: 'Landscape Maintenance', desc: 'Regular maintenance and seasonal services' },
      { name: 'Sprinkler Systems', desc: 'Maintenance, repair, setup and programming' },
    ],
    benefits: [
      'Eco-friendly practices',
      'Smart irrigation integration',
      'Seasonal maintenance plans',
      'Design consultation included'
    ]
  },
  {
    id: 'web-dev',
    category: 'digital',
    title: 'Web & Digital',
    icon: Code,
    color: 'bg-purple-500',
    description: 'Digital presence solutions for small businesses, content creators, and social media influencers',
    shortDesc: 'Professional web development and digital solutions',
    priceRange: '$500 - $1300',
    timeEstimate: '1-2 weeks typical',
    subServices: [
      { name: 'Custom Web Development', desc: 'Modern, responsive websites from scratch' },
      { name: 'Influencer/Creator Studio Starter', desc: 'Instagram, TikTok, Patreon, etc., Ring light + backdrop install etc.' },
      { name: 'Platform Support', desc: 'WordPress, Wix, Squarespace upgrades & support' },
      { name: 'E-Commerce Solutions', desc: 'Shopify stores and online selling platforms' },
      { name: 'Social Media & Branding', desc: 'Instagram, personal branding, content strategy' },
      { name: 'SEO & Google Services', desc: 'Search optimization and Google My Business' },
      { name: 'AI Integration', desc: 'Custom AI tools and chatbot integration 🤖' },
      { name: 'Online Booking Systems', desc: 'Scheduling and appointment booking setup' }
    ],
    benefits: [
      'Mobile-responsive design',
      'SEO-optimized code',
      'Ongoing support available',
      'Source code ownership'
    ]
  },
  {
    id: 'smart-home',
    category: 'tech',
    title: 'Smart Homes & Automation',
    icon: Wifi,
    color: 'bg-cyan-500',
    description: 'Software engineer expertise applied to home automation. IoT setup & integration',
    shortDesc: 'Professional smart home installation and configuration',
    priceRange: '$200 - $1300',
    timeEstimate: '2-6 hours typical',
    subServices: [
      { name: 'Home Assistants', desc: 'Alexa, Google Home setup and configuration' },
      { name: 'Smart Cameras', desc: 'Security camera installation and setup' },
      { name: 'Smart Thermostats', desc: 'Installation and programming of smart climate control' },
      { name: 'Custom Lighting', desc: 'Smart lighting systems and automation' },
      { name: 'PC & Device Support', desc: 'Computer troubleshooting and optimization' },
      { name: 'Custom Automation', desc: 'Programming custom automation scripts and routines' },
      { name: 'IoT Integration', desc: 'Connect and integrate smart home devices' }
    ],
    benefits: [
      'Energy savings optimization',
      'Professional configuration',
      'User training included',
      'Ongoing tech support'
    ]
  }
  // Note: Automotive scratch repair service is not currently offered
]

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedService, setExpandedService] = useState(null)
  
  // Intersection observers
  const heroSection = useIntersectionObserver({ threshold: 0.3 })
  const categoryFilter = useIntersectionObserver({ threshold: 0.3 })
  const additionalNote = useIntersectionObserver({ threshold: 0.3 })
  const ctaSection = useIntersectionObserver({ threshold: 0.3 })
  
  // Staggered animations for services
  const servicesStagger = useStaggeredIntersection(5, { threshold: 0.1 })

  const filteredServices = SERVICES_DATA.filter(
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{CONTENT.hero.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {CONTENT.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding">
        <div className="container-max mx-auto">
          {/* Category Filter */}
          <div 
            ref={categoryFilter.ref}
            className={`flex flex-wrap justify-center gap-4 mb-12 animate-fade-up ${categoryFilter.isVisible ? 'visible' : ''}`}>
            {CONTENT.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-muted hover:bg-gray-100 shadow-md'
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-80">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="space-y-8">
            {filteredServices.map((service, index) => (
              <div 
                key={service.id}
                ref={(el) => servicesStagger.setItemRef(service.id, el)}
                data-item-id={service.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl animate-fade-up delay-${(index + 1) * 100} ${servicesStagger.visibleItems[service.id] ? 'visible' : ''}`}
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
                              <div className="flex items-center gap-2 text-sm text-muted">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span>{CONTENT.serviceDetails.trustBadges.guaranteed}</span>
                              </div>
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
            <h3 className="font-semibold text-primary mb-2">{CONTENT.additionalServices.title}</h3>
            <p className="text-muted mb-4">
              {CONTENT.additionalServices.description}
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