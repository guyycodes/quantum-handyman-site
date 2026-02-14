import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Phone, Mail, MapPin, Clock, 
  Facebook, Youtube, Linkedin,
  Wrench, Code, Home as HomeIcon, TreePine, Wifi
} from 'lucide-react'
import TikTokIcon from './TikTokIcon'
import NextDoorIcon from './NextDoorIcon'
import { useWorld } from '../contexts/WorldContext'
import { JobPortalWidget } from '../hooks/useWidgetfied'

// Content Management - All text content in one place
const CONTENT = {
  logo: {
    text: 'Quantum',
    highlight: 'Technician'
  },
  tagline: 'Building digital solutions with code and creativity — Your partner for modern web development.',
  
  sections: {
    services: 'Services',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Info'
  },
  
  services: [
    { name: 'Web Development', icon: Code },
    { name: 'E-commerce', icon: HomeIcon },
    { name: 'SEO & Performance', icon: TreePine },
    { name: 'AI Integration', icon: Wifi },
  ],
  
  navigation: [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ],
  
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  
  social: [
    { name: 'TikTok', icon: TikTokIcon, href: 'https://www.tiktok.com/@quantumtechnician', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/morgbeals', color: 'hover:text-blue-500' },
  ],
  
  contact: {
    portal: {
      label: 'Project Portal',
      value: 'Observability & Payments'
    },
    email: {
      label: 'Email',
      value: 'hello@quantumtechnician.com'
    },
    hours: {
      label: 'Hours',
      value: 'Mon-Sat: 8AM-6PM'
    },
    area: {
      label: 'Service Area',
      value: 'Greater Metro Area'
    }
  },
  
  map: {
    title: 'Find Us',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.4847851087514!2d-105.00691508462174!3d39.83178047943751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7f2b0c2c0e6b%3A0xa36d92e4e0e87eb2!2s3512%20Vallejo%20St%2C%20Denver%2C%20CO%2080211!5e0!3m2!1sen!2sus!4v1702830000000!5m2!1sen!2sus',
    directionsUrl: 'https://www.google.com/maps/@39.8317804,-105.004315,18.15z?entry=ttu',
    address: '3512 Vallejo St, Denver',
    serviceCoverage: {
      title: 'Service Coverage',
      cities: [
        'Denver',
        'Aurora',
        'Lakewood',
        'Westminster',
        'Arvada',
        'Centennial'
      ]
    }
  },
  
  footer: {
    copyright: '© {year} Quantum Technician. All rights reserved.',
    // booking: {
    //   emoji: '📅',
    //   text: 'Online booking powered by',
    //   partner: 'Dandymen.io',
    //   description: '- our trusted scheduling partner'
    // },
    credit: {
      text: 'Built from scratch by',
      company: 'Quantum Technician'
    }
  }
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { currentWorld, isTechnician } = useWorld()
  const location = useLocation()

  const visibleServices = isTechnician
  ? CONTENT.services.filter(s => s.name !== 'Web & Digital')
  : CONTENT.services.filter(s => s.name === 'Web & Digital');

  // Get world-aware path for quick links
  const getWorldPath = (path) => {
    // Check if we're in a world-specific route
    if (location.pathname.includes('/technician')) {
      return `/technician${path}`
    } else if (location.pathname.includes('/web')) {
      return `/web${path}`
    } else if (currentWorld && currentWorld !== 'default') {
      return `/${currentWorld}${path}`
    }
    // Default - no world prefix
    return path
  }
  
  // Scroll to top function for navigation
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-near-black text-white">
      <div className="container-max mx-auto px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Wrench className="w-8 h-8 text-primary" />
                  <Code className="w-4 h-4 text-secondary absolute -bottom-1 -right-1" />
                </div>
                <span className="text-xl font-bold">
                  {CONTENT.logo.text}<span className="text-primary">{CONTENT.logo.highlight}</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {CONTENT.tagline}
              </p>
              <div className="flex gap-3 mt-3">
                {CONTENT.social.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className={`p-2 rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Map and Service Area */}
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-2">{CONTENT.map.title}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_.75fr] gap-3">
                {/* Map */}
                <div>
                  <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 border border-gray-700">
                    <iframe 
                      src={CONTENT.map.embedUrl}
                      width="100%"
                      height="120"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Quantum Technician Service Area"
                      className="w-full"
                    ></iframe>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    <a 
                      href={CONTENT.map.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {CONTENT.map.address}
                    </a>
                  </p>
                </div>
                
                {/* Service Coverage */}
                <div className="text-xs">
                  <p className="font-semibold text-gray-300 mb-1">{CONTENT.map.serviceCoverage.title}</p>
                  <div className="space-y-0.5">
                    {CONTENT.map.serviceCoverage.cities.map((city) => (
                      <div key={city} className="flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-400">{city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{CONTENT.sections.services}</h3>
            <ul className="space-y-3">
              {visibleServices.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.name === 'Web & Digital' ? '/web/services' : '/services'} 
                    onClick={scrollToTop}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    <service.icon className="w-4 h-4" />
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{CONTENT.sections.quickLinks}</h3>
            <ul className="space-y-3">
              {CONTENT.navigation.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={getWorldPath(link.href)}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {CONTENT.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={getWorldPath(link.href)}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{CONTENT.sections.contactInfo}</h3>
            <ul className="space-y-3">
              {/* <li className="flex items-start gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">{CONTENT.contact.phone.label}</p>
                  <p className="text-white">{CONTENT.contact.phone.value}</p>
                </div>
              </li> */}
              <li className="flex items-start gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">{CONTENT.contact.email.label}</p>
                  <p className="text-white">{CONTENT.contact.email.value}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">{CONTENT.contact.hours.label}</p>
                  <p className="text-white">{CONTENT.contact.hours.value}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">{CONTENT.contact.area.label}</p>
                  <p className="text-white">{CONTENT.contact.area.value}</p>
                </div>
              </li>
            </ul>
            
            {/* Portal Widget - Prominent Placement */}
            <div className="mt-6">
              <JobPortalWidget 
                id="footer-portal-widget"
                displayMode="button"
              />
              <p className="text-xs text-gray-400 mt-2">{CONTENT.contact.portal.value}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {CONTENT.footer.copyright.replace('{year}', currentYear)}
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <p className="text-gray-400 text-center">
                {/* <span className="inline-flex items-center gap-1">
                  {CONTENT.footer.booking.emoji} {CONTENT.footer.booking.text} 
                  <a 
                    href="/contact" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-blue-400 transition-colors underline"
                  >
                    {CONTENT.footer.booking.partner}
                  </a>
                  {CONTENT.footer.booking.description}
                </span> */}
              </p>
              <span className="hidden md:inline text-gray-600">|</span>
              <p className="text-gray-400">
                {CONTENT.footer.credit.text} <span className="text-primary">{CONTENT.footer.credit.company}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer