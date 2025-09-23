import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Phone, Mail, MapPin, Clock, 
  Facebook, Instagram,
  Wrench, Code, Home as HomeIcon, TreePine, Car, Wifi
} from 'lucide-react'
import TikTokIcon from './TikTokIcon'

// Content Management - All text content in one place
const CONTENT = {
  logo: {
    text: 'Quantum',
    highlight: 'Handyman'
  },
  tagline: 'Fixing problems on every level - from leaky pipes to custom websites. Your one-stop solution for modern living.',
  
  sections: {
    services: 'Services',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Info'
  },
  
  services: [
    { name: 'Home Repairs', icon: HomeIcon },
    { name: 'Web Development', icon: Code },
    { name: 'Smart Home', icon: Wifi },
    { name: 'Landscaping', icon: TreePine },
    { name: 'Scratch Repair', icon: Car },
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
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/quantumhandyman', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/quantumhandyman', color: 'hover:text-pink-600' },
    { name: 'TikTok', icon: TikTokIcon, href: 'https://www.tiktok.com/@quantumhandyman', color: 'hover:text-pink-600' },
  ],
  
  contact: {
    portal: {
      label: 'Project Portal',
      value: 'Observability & Payments'
    },
    email: {
      label: 'Email',
      value: 'hello@quantumhandyman.com'
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
  
  footer: {
    copyright: '© {year} Quantum Handyman. All rights reserved.',
    // booking: {
    //   emoji: '📅',
    //   text: 'Online booking powered by',
    //   partner: 'Dandymen.io',
    //   description: '- our trusted scheduling partner'
    // },
    credit: {
      text: 'Built from scratch by',
      company: 'Quantum Handyman'
    }
  }
}

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-near-black text-white">
      <div className="container-max mx-auto px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Wrench className="w-8 h-8 text-primary" />
                <Code className="w-4 h-4 text-secondary absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl font-bold">
                {CONTENT.logo.text}<span className="text-primary">{CONTENT.logo.highlight}</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {CONTENT.tagline}
            </p>
            <div className="flex gap-3">
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

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{CONTENT.sections.services}</h3>
            <ul className="space-y-3">
              {CONTENT.services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to="/services" 
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
                    to={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {CONTENT.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
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
            
            {/* Pay Now Button - Prominent Placement */}
            <div className="mt-6">
              <Link 
                to="/portal"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] text-base"
              >
                <span className="text-lg">📊</span>
                <span>{CONTENT.contact.portal.label}</span>
              </Link>
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
                    href="https://dandymen.io" 
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