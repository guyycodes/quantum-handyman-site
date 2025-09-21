import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Wrench, Code } from 'lucide-react'
import BookingCTA from './BookingCTA'

// Content Management - All text content in one place
const CONTENT = {
  logo: {
    text: 'Quantum',
    highlight: 'Handyman',
    ariaLabel: 'Quantum Handyman Home'
  },
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ],
  mobileMenu: {
    ariaLabel: 'Toggle mobile menu'
  }
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (href) => location.pathname === href

  return (
    <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-lines">
      <nav className="container-max mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            aria-label={CONTENT.logo.ariaLabel}
          >
            <div className="relative">
              <Wrench className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" />
              <Code className="w-4 h-4 text-secondary absolute -bottom-1 -right-1" />
            </div>
            <span className="text-xl font-bold text-near-black">
              {CONTENT.logo.text}<span className="text-primary">{CONTENT.logo.highlight}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {CONTENT.navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  font-medium transition-colors duration-200 relative
                  ${isActive(item.href) 
                    ? 'text-primary' 
                    : 'text-muted hover:text-primary'
                  }
                `}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <BookingCTA buttonStyle="primary" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={CONTENT.mobileMenu.ariaLabel}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-near-black" />
            ) : (
              <Menu className="w-6 h-6 text-near-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`
            lg:hidden fixed left-0 right-0 top-[73px] bg-white border-b border-lines
            transition-all duration-300 transform origin-top
            ${isMenuOpen 
              ? 'scale-y-100 opacity-100' 
              : 'scale-y-0 opacity-0 pointer-events-none'
            }
          `}
        >
          <div className="px-6 py-4 space-y-1">
            {CONTENT.navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  block py-3 px-4 rounded-lg font-medium transition-colors
                  ${isActive(item.href)
                    ? 'text-primary bg-blue-50'
                    : 'text-muted hover:text-primary hover:bg-gray-50'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <BookingCTA 
                buttonStyle="primary" 
                className="w-full" 
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
