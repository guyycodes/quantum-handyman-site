import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingCTA from '../components/BookingCTA'
import { 
  Wrench, Code, Home as HomeIcon, TreePine, Car, Wifi,
  CheckCircle, ArrowRight, Hammer, Paintbrush,
  Zap, Droplets, Lightbulb, Monitor, Smartphone,
  Globe, Database, Server, Leaf, Flower, Scissors,
  Sun, CloudRain, Sparkles, Settings, Gauge,
  Shield, Clock, Award, DollarSign
} from 'lucide-react'

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedService, setExpandedService] = useState(null)

  const serviceCategories = [
    { id: 'all', name: 'All Services', count: 5 },
    { id: 'traditional', name: 'Traditional Services', count: 3 },
    { id: 'tech', name: 'Tech & Digital', count: 2 }
  ]

  const detailedServices = [
    {
      id: 'home-repairs',
      category: 'traditional',
      title: 'Home Repairs & Maintenance',
      icon: HomeIcon,
      color: 'bg-blue-500',
      description: 'Comprehensive home repair services with professional expertise',
      shortDesc: 'Professional home repair services from plumbing to electrical work',
      priceRange: '$75 - $500',
      timeEstimate: '1-4 hours typical',
      subServices: [
        { name: 'Plumbing Repairs', desc: 'Leaks, clogs, fixture installation' },
        { name: 'Electrical Work', desc: 'Outlets, switches, minor wiring' },
        { name: 'Drywall & Painting', desc: 'Patches, texture, interior painting' },
        { name: 'Door & Window Repair', desc: 'Adjustments, weatherstripping, locks' },
        { name: 'Appliance Installation', desc: 'Dishwashers, disposals, fixtures' },
        { name: 'General Maintenance', desc: 'Preventive care and minor fixes' }
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
      category: 'traditional',
      title: 'Landscaping & Outdoor',
      icon: TreePine,
      color: 'bg-green-500',
      description: 'Transform your outdoor spaces into beautiful, functional areas',
      shortDesc: 'Professional landscaping and outdoor improvement services',
      priceRange: '$100 - $2000',
      timeEstimate: '2-8 hours typical',
      subServices: [
        { name: 'Garden Design', desc: 'Layout planning and plant selection' },
        { name: 'Lawn Care', desc: 'Mowing, edging, fertilization' },
        { name: 'Irrigation Systems', desc: 'Installation and smart controller setup' },
        { name: 'Outdoor Lighting', desc: 'Landscape and security lighting' },
        { name: 'Hardscaping', desc: 'Pavers, retaining walls, pathways' },
        { name: 'Seasonal Services', desc: 'Spring/fall cleanup, mulching' }
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
      category: 'tech',
      title: 'Web & App Development',
      icon: Code,
      color: 'bg-purple-500',
      description: 'Custom digital solutions built with modern technology stack',
      shortDesc: 'Professional web development and digital solutions',
      priceRange: '$500 - $5000',
      timeEstimate: '1-4 weeks typical',
      subServices: [
        { name: 'Custom Websites', desc: 'Responsive, modern web design' },
        { name: 'E-Commerce Solutions', desc: 'Online stores with payment integration' },
        { name: 'Web Applications', desc: 'Custom business tools and portals' },
        { name: 'SEO Optimization', desc: 'Search engine visibility improvement' },
        { name: 'Website Maintenance', desc: 'Updates, backups, security' },
        { name: 'API Integration', desc: 'Third-party service connections' }
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
      title: 'Smart Home Automation',
      icon: Wifi,
      color: 'bg-cyan-500',
      description: 'Upgrade your home with intelligent automation systems',
      shortDesc: 'Professional smart home installation and configuration',
      priceRange: '$200 - $3000',
      timeEstimate: '2-6 hours typical',
      subServices: [
        { name: 'Smart Thermostats', desc: 'Nest, Ecobee installation & setup' },
        { name: 'Security Systems', desc: 'Cameras, doorbells, alarms' },
        { name: 'Smart Lighting', desc: 'Automated schedules and scenes' },
        { name: 'Voice Control', desc: 'Alexa, Google Home integration' },
        { name: 'Home Network Setup', desc: 'WiFi optimization and mesh systems' },
        { name: 'Entertainment Systems', desc: 'Smart TV and audio setup' }
      ],
      benefits: [
        'Energy savings optimization',
        'Professional configuration',
        'User training included',
        'Ongoing tech support'
      ]
    },
    {
      id: 'auto-detailing',
      category: 'traditional',
      title: 'Automotive Detailing',
      icon: Car,
      color: 'bg-orange-500',
      description: 'Professional automotive care and restoration services',
      shortDesc: 'Expert car detailing and paint correction services',
      priceRange: '$100 - $800',
      timeEstimate: '2-8 hours typical',
      subServices: [
        { name: 'Paint Correction', desc: 'Swirl removal and polishing' },
        { name: 'Scratch Repair', desc: 'Minor scratch and scuff removal' },
        { name: 'Interior Detailing', desc: 'Deep cleaning and conditioning' },
        { name: 'Ceramic Coating', desc: 'Long-lasting paint protection' },
        { name: 'Headlight Restoration', desc: 'Clarity restoration and sealing' },
        { name: 'Engine Bay Detailing', desc: 'Cleaning and dressing' }
      ],
      benefits: [
        'Professional-grade products',
        'Mobile service available',
        'Satisfaction guaranteed',
        'Regular maintenance packages'
      ]
    }
  ]

  const filteredServices = detailedServices.filter(
    service => selectedCategory === 'all' || service.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="container-max mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Comprehensive solutions for your home, business, and vehicle - 
            all from one trusted provider
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding">
        <div className="container-max mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {serviceCategories.map((category) => (
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
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl"
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
                            <span className="text-muted">Starting from: <strong>{service.priceRange}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-muted">Time: <strong>{service.timeEstimate}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col gap-3">
                      <BookingCTA 
                        service={service.title}
                        buttonText="Book This Service"
                        buttonStyle="primary"
                      />
                      <button
                        onClick={() => setExpandedService(
                          expandedService === service.id ? null : service.id
                        )}
                        className="text-primary font-medium text-sm hover:underline flex items-center justify-center gap-1"
                      >
                        {expandedService === service.id ? 'Show Less' : 'View Details'}
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
                    <div className="mt-8 pt-8 border-t border-lines animate-fade-in-up">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Sub-services */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">What We Offer</h3>
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
                          <h3 className="text-lg font-semibold mb-4">Why Choose Us</h3>
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
                                <span>Insured</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted">
                                <Award className="w-4 h-4 text-primary" />
                                <span>Licensed</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span>Guaranteed</span>
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
          <div className="mt-12 bg-blue-50 border-l-4 border-primary rounded-r-lg p-6">
            <h3 className="font-semibold text-primary mb-2">Don't See What You Need?</h3>
            <p className="text-muted mb-4">
              We offer many additional services not listed here. From minor repairs to 
              major projects, if it needs fixing or building, we can probably help!
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Contact us with your specific needs
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container-max mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Book your service today and experience the Quantum Handyman difference
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingCTA 
              buttonText="Book Now"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            />
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Services
