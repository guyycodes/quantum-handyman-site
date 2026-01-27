import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Wrench, Code, Monitor, ArrowLeftRight } from 'lucide-react'
import BookingCTA from './BookingCTA'
import { useWorld } from '../contexts/WorldContext'

// Content Management - All text content in one place
const CONTENT = {
  logo: {
    text: 'Quantum',
    highlight: 'Technician',
    ariaLabel: 'Quantum Technician Home'
  },
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    // { name: 'Portfolio', href: '/portfolio' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Contact', href: '/contact' },
  ],
  mobileMenu: {
    ariaLabel: 'Toggle mobile menu'
  }
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentWorld, isTechnician, isWeb } = useWorld()

  // Get the world-aware path
  const getWorldPath = (path) => {
    // If we have a current world, prepend it to the path
    if (currentWorld && currentWorld !== 'default') {
      // For home path, just return the world path
      if (path === '/') {
        return `/${currentWorld}`
      }
      // For other paths, append them to the world path
      return `/${currentWorld}${path}`
    }
    // If no world is selected, return the original path
    return path
  }

  const isActive = (href) => {
    // Check if the current path matches, accounting for world prefix
    const currentPath = location.pathname.replace(/^\/(technician|web)/, '')
    const checkPath = href === '/' ? currentPath === '/' || currentPath === '' : currentPath === href
    return checkPath
  }

  // Scroll to top function for navigation
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Switch between worlds
  const handleWorldSwitch = () => {
    const otherWorld = isTechnician ? 'web' : 'technician'
    // Get the current path without the world prefix
    const currentPath = location.pathname.replace(/^\/(technician|web)/, '') || '/'
    // Navigate to the same page in the other world
    navigate(`/${otherWorld}${currentPath}`)
  }

  return (
    <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-lines">
      <nav className="container-max mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to={getWorldPath('/')} 
            onClick={scrollToTop}
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
                to={getWorldPath(item.href)}
                onClick={scrollToTop}
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

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* World Switcher */}npm run dev
            <button
              onClick={handleWorldSwitch}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-all group"
              aria-label={`Switch to ${isTechnician ? 'Web Development' : 'Technician Services'}`}
            >
              <div className={`flex items-center gap-1.5 ${isTechnician ? 'text-blue-600' : 'text-green-600'}`}>
                {isTechnician ? (
                  <>
                    <Wrench className="w-4 h-4" />
                    <span className="text-sm font-medium">Technician</span>
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4" />
                    <span className="text-sm font-medium">Web</span>
                  </>
                )}
              </div>
              <ArrowLeftRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <div className="text-gray-400 text-sm">
                {isTechnician ? 'Web' : 'Technician'}
              </div>
            </button>
            
            <Link
              to={getWorldPath('/portal')}
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg font-medium transition-all"
            >
              <Monitor className="w-4 h-4" />
              Portal
            </Link>
            <BookingCTA 
              buttonStyle="primary" 
              showHelperText={true}
            />
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
                to={getWorldPath(item.href)}
                onClick={() => {
                  setIsMenuOpen(false)
                  scrollToTop()
                }}
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
            <div className="pt-4 pb-2 space-y-2">
              {/* Book Now Button - Placed First */}
              <BookingCTA 
                buttonStyle="primary" 
                className="w-full" 
                onClick={() => setIsMenuOpen(false)}
                showHelperText={true}
              />
              
              {/* Mobile World Switcher - Now Below Book Now */}
              <button
                onClick={() => {
                  handleWorldSwitch()
                  setIsMenuOpen(false)
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group border border-gray-200 shadow-sm"
                aria-label={`Switch to ${isTechnician ? 'Web Development' : 'Technician Services'}`}
              >
                <div className={`flex items-center gap-2 ${isTechnician ? 'text-blue-600' : 'text-green-600'}`}>
                  {isTechnician ? (
                    <>
                      <Wrench className="w-4 h-4" />
                      <span className="text-sm font-medium">Viewing: Technician</span>
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4" />
                      <span className="text-sm font-medium">Viewing: Web Dev</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <span>Switch to {isTechnician ? 'Web' : 'Technician'}</span>
                  <ArrowLeftRight className="w-3 h-3" />
                </div>
              </button>
              
              {/* Portal Button - Last */}
              <Link
                to={getWorldPath('/portal')}
                onClick={() => {
                  setIsMenuOpen(false)
                  scrollToTop()
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg font-medium transition-all border border-gray-300 shadow-sm"
              >
                <Monitor className="w-4 h-4" />
                Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
