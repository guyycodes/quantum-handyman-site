import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingCTA from '../components/BookingCTA'
import { 
  Wrench, Code, Home as HomeIcon, TreePine, Car, Wifi,
  Shield, Clock, Award, Users, ChevronRight,
  Star, Phone, Mail, MapPin, CheckCircle,
  Hammer, Paintbrush, Zap, Droplets, Lightbulb,
  Monitor, Smartphone, Globe, Database, Server,
  Leaf, Flower, Scissors, Sun, CloudRain,
  Sparkles, Settings, Gauge, ArrowRight
} from 'lucide-react'

const Home = () => {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('all')

  const services = [
    {
      id: 'home-repairs',
      title: 'Home Repairs & Maintenance',
      icon: HomeIcon,
      color: 'bg-blue-500',
      description: 'Professional home repair services from plumbing to electrical work',
      features: ['Plumbing repairs', 'Electrical fixes', 'Drywall & painting', 'Fixture installation', 'General maintenance'],
      category: 'traditional'
    },
    {
      id: 'landscaping',
      title: 'Landscaping & Outdoor',
      icon: TreePine,
      color: 'bg-green-500',
      description: 'Transform your outdoor spaces with professional landscaping',
      features: ['Garden design', 'Lawn care', 'Outdoor lighting', 'Irrigation systems', 'Seasonal cleanup'],
      category: 'traditional'
    },
    {
      id: 'web-dev',
      title: 'Web & App Development',
      icon: Code,
      color: 'bg-purple-500',
      description: 'Custom websites and applications built with modern technology',
      features: ['Custom websites', 'E-commerce solutions', 'Web applications', 'Mobile-responsive design', 'SEO optimization'],
      category: 'tech'
    },
    {
      id: 'smart-home',
      title: 'Smart Home Automation',
      icon: Wifi,
      color: 'bg-cyan-500',
      description: 'Upgrade your home with the latest smart technology',
      features: ['Smart thermostats', 'Security systems', 'Automated lighting', 'Voice control setup', 'IoT integration'],
      category: 'tech'
    },
    {
      id: 'auto-detailing',
      title: 'Automotive Detailing',
      icon: Car,
      color: 'bg-orange-500',
      description: 'Professional automotive care and detailing services',
      features: ['Paint correction', 'Scratch repair', 'Interior detailing', 'Ceramic coating', 'Headlight restoration'],
      category: 'traditional'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      service: 'Smart Home Installation',
      rating: 5,
      text: 'Quantum Handyman set up our entire smart home system AND fixed our leaky faucet in the same visit. Having someone who understands both tech and traditional repairs is amazing!',
      avatar: 'SM'
    },
    {
      name: 'David Chen',
      service: 'Web Development & Landscaping',
      rating: 5,
      text: 'Built our business website and transformed our office garden. The combination of technical and hands-on skills is unmatched. Highly recommend!',
      avatar: 'DC'
    },
    {
      name: 'Emily Rodriguez',
      service: 'Home Repairs',
      rating: 5,
      text: 'Finally, a handyman who can explain exactly what needs to be done and why. The Computer Science background really shows in the problem-solving approach.',
      avatar: 'ER'
    },
    {
      name: 'Michael Thompson',
      service: 'Automotive Detailing',
      rating: 5,
      text: 'Incredible attention to detail on my car. You can tell this is someone who takes pride in their work, whether its coding or detailing.',
      avatar: 'MT'
    }
  ]

  const portfolioItems = [
    {
      category: 'Web Development',
      title: 'E-Commerce Platform',
      description: 'Custom online store with inventory management',
      before: '/api/placeholder/400/300',
      after: '/api/placeholder/400/300'
    },
    {
      category: 'Smart Home',
      title: 'Full Home Automation',
      description: 'Integrated lighting, climate, and security',
      before: '/api/placeholder/400/300',
      after: '/api/placeholder/400/300'
    },
    {
      category: 'Landscaping',
      title: 'Garden Transformation',
      description: 'Complete backyard renovation with smart irrigation',
      before: '/api/placeholder/400/300',
      after: '/api/placeholder/400/300'
    },
    {
      category: 'Home Repair',
      title: 'Kitchen Renovation',
      description: 'Plumbing, electrical, and fixture updates',
      before: '/api/placeholder/400/300',
      after: '/api/placeholder/400/300'
    }
  ]

  const stats = [
    { label: 'Years Experience', value: '8+' },
    { label: 'Projects Completed', value: '500+' },
    { label: 'Happy Customers', value: '200+' },
    { label: 'Services Offered', value: '50+' }
  ]

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-500 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container-max mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>CS Degree + 8 Years Experience</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                The Handyman <br />
                <span className="gradient-text bg-gradient-to-r from-yellow-300 to-orange-400">Who Codes</span>
              </h1>
              
              <p className="text-xl text-white/90">
                Fixing problems on every level - from leaky pipes to custom websites. 
                Your one-stop solution for modern living.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <BookingCTA 
                  buttonText="Book a Service" 
                  buttonStyle="primary"
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                />
                <a 
                  href="#services" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all"
                >
                  See Our Work
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <div className="flex gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Quality Guaranteed</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {services.slice(0, 4).map((service, index) => (
                      <div 
                        key={service.id}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <service.icon className="w-8 h-8 text-white mb-2" />
                        <p className="text-white text-sm font-medium">{service.title.split('&')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              From traditional handyman work to cutting-edge tech solutions, 
              we bring expertise across multiple domains
            </p>
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
              All Services
            </button>
            <button
              onClick={() => setSelectedServiceCategory('traditional')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedServiceCategory === 'traditional' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              Traditional
            </button>
            <button
              onClick={() => setSelectedServiceCategory('tech')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedServiceCategory === 'tech' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              Tech & Digital
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter(service => selectedServiceCategory === 'all' || service.category === selectedServiceCategory)
              .map((service) => (
              <div 
                key={service.id}
                className="service-card group cursor-pointer"
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
                  buttonText="Book This Service"
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
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Meet Your <span className="gradient-text">Quantum Handyman</span>
              </h2>
              
              <p className="text-lg text-muted">
                The handyman who codes, has a Computer Science degree & 8+ years experience 
                across home repairs, landscaping, web & app development, smart home installs 
                & automotive buffing + scratch repair. Your one-stop solution for modern living. 🔧💻🚗
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <Award className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold text-near-black">CS Degree</h4>
                  <p className="text-sm text-muted">Computer Science Graduate</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <Clock className="w-8 h-8 text-secondary mb-2" />
                  <h4 className="font-semibold text-near-black">8+ Years</h4>
                  <p className="text-sm text-muted">Professional Experience</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <Shield className="w-8 h-8 text-accent mb-2" />
                  <h4 className="font-semibold text-near-black">Licensed</h4>
                  <p className="text-sm text-muted">Fully Insured & Bonded</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <Users className="w-8 h-8 text-purple-500 mb-2" />
                  <h4 className="font-semibold text-near-black">200+ Clients</h4>
                  <p className="text-sm text-muted">Satisfied Customers</p>
                </div>
              </div>

              <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4">
                <p className="text-primary font-semibold mb-2">Unique Value Proposition</p>
                <p className="text-near-black">
                  The only handyman in the area with a Computer Science degree - 
                  solving both physical and digital problems with equal expertise.
                </p>
              </div>

              <BookingCTA 
                buttonText="Get Free Quote"
                buttonStyle="primary"
                size="lg"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Us?</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-near-black">Unique Combination</h4>
                      <p className="text-sm text-muted">Only handyman with CS degree in area</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-near-black">One-Stop Solution</h4>
                      <p className="text-sm text-muted">Handle both physical and digital problems</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-near-black">Quality Guaranteed</h4>
                      <p className="text-sm text-muted">Professional results, insured work</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gauge className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-near-black">Local & Responsive</h4>
                      <p className="text-sm text-muted">Quick response times, community focused</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section-padding bg-white">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Portfolio</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              See the quality and range of our work across different service categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {portfolioItems.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="relative h-64 bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                        <p className="text-muted text-sm">Before/After Image</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-primary font-semibold mb-2">{item.category}</div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a 
              href="/portfolio" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View Full Portfolio
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-muted mb-6 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-near-black text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container-max mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Quantum Difference?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Whether you need a website built, a faucet fixed, or your car detailed - 
            we've got you covered with professional, reliable service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingCTA 
              buttonText="Book Now"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            />
            <a 
              href="tel:555-123-4567"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call (555) 123-4567
            </a>
          </div>

          <div className="flex justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free Quotes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
