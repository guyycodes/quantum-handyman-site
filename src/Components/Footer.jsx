import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Phone, Mail, MapPin, Clock, 
  Facebook, Instagram, Twitter, Linkedin,
  Wrench, Code, Home as HomeIcon, TreePine, Car, Wifi
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const services = [
    { name: 'Home Repairs', icon: HomeIcon },
    { name: 'Web Development', icon: Code },
    { name: 'Smart Home', icon: Wifi },
    { name: 'Landscaping', icon: TreePine },
    { name: 'Auto Detailing', icon: Car },
  ]

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
  ]

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
                Quantum<span className="text-primary">Handyman</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Fixing problems on every level - from leaky pipes to custom websites. 
              Your one-stop solution for modern living.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
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
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
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
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {legalLinks.map((link) => (
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
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">Call us</p>
                  <p className="text-white">(555) 123-4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">info@quantumhandyman.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">Hours</p>
                  <p className="text-white">Mon-Sat: 8AM-6PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-gray-400">Service Area</p>
                  <p className="text-white">Greater Metro Area</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Quantum Handyman. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a 
                href="https://dandymen.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Powered by Dandymen.io
              </a>
              <span className="text-gray-600">|</span>
              <p className="text-gray-400">
                Built by <span className="text-primary">Quantum Handyman</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
