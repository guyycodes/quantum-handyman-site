import React, { useState } from 'react'
import { sendContactEmail } from '../services/emailService'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BookingCTA from '../Components/BookingCTA'
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Phone, Mail, MapPin, Clock, 
  Send, CheckCircle, AlertCircle,
  Facebook, Instagram
} from 'lucide-react'
import TikTokIcon from '../Components/TikTokIcon'
import { 
  sanitizeName,
  sanitizeEmail,
  sanitizePhone,
  sanitizeText
} from '../utils/dataSanitization'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    title: 'Get In Touch',
    subtitle: 'Ready to tackle your next project? We\'re here to help with everything from home repairs to web development.'
  },
  
  form: {
    title: 'Send Us a Message',
    successMessage: {
      title: 'Message sent successfully!',
      subtitle: 'We\'ll get back to you within 24 hours.'
    },
    fields: {
      name: {
        label: 'Name *',
        placeholder: 'John Doe'
      },
      email: {
        label: 'Email *',
        placeholder: 'john@example.com'
      },
      phone: {
        label: 'Phone',
        placeholder: '(555) 123-4567'
      },
      service: {
        label: 'Service Type',
        placeholder: 'Select a service'
      },
      message: {
        label: 'Message *',
        placeholder: 'Tell us about your project...'
      }
    },
    buttons: {
      submit: 'Send Message',
      submitting: 'Sending...',
      bookDirectly: 'Or Book Directly',
      helperText: 'via Dandymen.io'
    }
  },
  
  contactInfo: {
    title: 'Contact Information',
    items: [

      {
        icon: Mail,
        label: 'Email',
        value: 'hello@quantumhandyman.com',
        link: 'mailto:hello@quantumhandyman.com'
      },
      {
        icon: MapPin,
        label: 'Service Area',
        value: 'Greater Metro Area',
        link: null
      },
      {
        icon: Clock,
        label: 'Hours',
        value: 'Mon-Sat: 8AM-6PM',
        link: null
      }
    ]
  },
  
  social: {
    title: 'Follow Us',
    links: [
      { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/quantumhandyman' },
      { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/quantumhandyman' },
      { name: 'TikTok', icon: TikTokIcon, href: 'https://www.tiktok.com/@quantumhandyman' }
    ]
  },
  
  quickBook: {
    title: 'Need Immediate Help?',
    subtitle: 'Book a service directly through our partner platform for the fastest response.',
    buttonText: 'Book Now'
  },
  
  responseTime: {
    title: 'Response Time',
    message: 'For urgent matters we typically respond right away. Otherwise, we typically respond within 24 hours.'
  },
  
  serviceOptions: [
    'Home Repairs & Maintenance',
    'Landscaping & Outdoor',
    'Web & App Development', 
    'Smart Home Automation',
    'Automotive Scratch Repair & Paint Correction',
    'Other'
  ]
}

const Contact = () => {
  // Intersection observers
  const heroSection = useIntersectionObserver({ threshold: 0.3 })
  const formSection = useIntersectionObserver({ threshold: 0.2 })
  const contactInfoSection = useIntersectionObserver({ threshold: 0.2 })
  const socialSection = useIntersectionObserver({ threshold: 0.2 })
  const quickBookSection = useIntersectionObserver({ threshold: 0.2 })
  const businessNoteSection = useIntersectionObserver({ threshold: 0.2 })
  
  // Staggered animations
  const contactInfoStagger = useStaggeredIntersection(4, { threshold: 0.1 })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const validateField = (name, value, isBlur = false) => {
    let error = ''
    
    switch(name) {
      case 'name':
        // For typing, allow spaces without immediate sanitization
        if (!isBlur) {
          // Basic validation during typing - allow letters, spaces, hyphens, apostrophes
          const basicSanitized = value.replace(/[^a-zA-Z\s\-'.]/g, '')
          if (basicSanitized.length < 2 && value.length >= 2) {
            error = 'Name must contain valid characters'
          }
          return { sanitized: basicSanitized, error }
        }
        // Full sanitization on blur
        const nameResult = sanitizeName(value)
        if (!nameResult.isValid) {
          error = nameResult.error
        }
        return { sanitized: nameResult.sanitized, error }
        
      case 'email':
        const emailResult = sanitizeEmail(value)
        if (!emailResult.isValid) {
          error = emailResult.error
        }
        return { sanitized: emailResult.sanitized, error }
        
      case 'phone':
        if (value) { // Phone is optional
          const phoneResult = sanitizePhone(value)
          if (!phoneResult.isValid) {
            error = phoneResult.error
          }
          return { sanitized: phoneResult.formatted || phoneResult.sanitized, error }
        }
        return { sanitized: value, error }
        
      case 'message':
        const sanitized = sanitizeText(value, {
          allowNewlines: true,
          maxLength: 1000,
          trimWhitespace: false // Don't trim while typing
        })
        if (sanitized.length < 10 && value.length >= 10) {
          error = 'Message contains invalid characters'
        } else if (value.length > 0 && value.length < 10) {
          error = 'Message must be at least 10 characters'
        }
        return { sanitized, error }
        
      case 'service':
        // Service is a dropdown, no sanitization needed
        return { sanitized: value, error }
        
      default:
        return { sanitized: value, error }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const { sanitized, error } = validateField(name, value, false)
    
    // Update form data with sanitized value
    setFormData({
      ...formData,
      [name]: name === 'phone' && !value ? value : sanitized // Keep raw empty phone
    })
    
    // Update field error if field has been touched
    if (fieldTouched[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: error
      })
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    
    // Mark field as touched
    setFieldTouched({
      ...fieldTouched,
      [name]: true
    })
    
    // Validate and show error with full sanitization
    const { sanitized, error } = validateField(name, value, true)
    
    // Update with fully sanitized/formatted value on blur
    if (name === 'message') {
      const trimmedSanitized = sanitizeText(value, {
        allowNewlines: true,
        maxLength: 1000,
        trimWhitespace: true
      })
      setFormData({
        ...formData,
        [name]: trimmedSanitized
      })
    } else if (name === 'phone' && value) {
      // Format phone number on blur
      setFormData({
        ...formData,
        [name]: sanitized
      })
    } else if (name === 'name') {
      // Apply full name formatting on blur (capitalization, etc.)
      setFormData({
        ...formData,
        [name]: sanitized
      })
    }
    
    setFieldErrors({
      ...fieldErrors,
      [name]: error
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')
    
    // Validate all fields
    const errors = {}
    const sanitizedData = {}
    
    // Validate and sanitize each field with full sanitization (isBlur = true)
    Object.keys(formData).forEach(key => {
      if (key === 'service') {
        sanitizedData[key] = formData[key]
      } else {
        const { sanitized, error } = validateField(key, formData[key], true)
        sanitizedData[key] = sanitized
        if (error && (key !== 'phone' || formData[key])) { // Phone is optional
          errors[key] = error
        }
      }
    })
    
    // Check for required fields
    if (!sanitizedData.name) errors.name = 'Name is required'
    if (!sanitizedData.email) errors.email = 'Email is required'
    if (!sanitizedData.message) errors.message = 'Message is required'
    
    // If there are validation errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFieldTouched({
        name: true,
        email: true,
        phone: true,
        message: true
      })
      setIsSubmitting(false)
      setSubmitStatus('error')
      setErrorMessage('Please fix the errors in the form before submitting.')
      return
    }
    
    try {
      // Final sanitization with trimming for submission
      const finalData = {
        ...sanitizedData,
        message: sanitizeText(sanitizedData.message, {
          allowNewlines: true,
          maxLength: 1000,
          trimWhitespace: true
        })
      }
      
      // Send email using the email service with sanitized data
      const result = await sendContactEmail(finalData)
      
      if (result.success) {
        setSubmitStatus('success')
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        })
        // Reset field states
        setFieldErrors({
          name: '',
          email: '',
          phone: '',
          message: ''
        })
        setFieldTouched({
          name: false,
          email: false,
          phone: false,
          message: false
        })
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Contact Form Error:', error)
      setSubmitStatus('error')
      setErrorMessage('An error occurred while sending your message. Please try again or call us directly.')
      // Reset error after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

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

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-max mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div 
                ref={formSection.ref}
                className={`bg-white rounded-2xl shadow-xl p-8 animate-fade-right ${formSection.isVisible ? 'visible' : ''}`}>
                <h2 className="text-2xl font-bold mb-6">{CONTENT.form.title}</h2>
                
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">{CONTENT.form.successMessage.title}</p>
                      <p className="text-sm text-green-700">{CONTENT.form.successMessage.subtitle}</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Error sending message</p>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-muted mb-2">
                        {CONTENT.form.fields.name.label}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.name && fieldTouched.name ? 'border-red-500' : 'border-lines'} focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        placeholder={CONTENT.form.fields.name.placeholder}
                        maxLength={100}
                      />
                      {fieldErrors.name && fieldTouched.name && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">
                        {CONTENT.form.fields.email.label}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.email && fieldTouched.email ? 'border-red-500' : 'border-lines'} focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        placeholder={CONTENT.form.fields.email.placeholder}
                        maxLength={254}
                      />
                      {fieldErrors.email && fieldTouched.email && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-muted mb-2">
                        {CONTENT.form.fields.phone.label}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.phone && fieldTouched.phone ? 'border-red-500' : 'border-lines'} focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                        placeholder={CONTENT.form.fields.phone.placeholder}
                        maxLength={17}
                      />
                      {fieldErrors.phone && fieldTouched.phone && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-muted mb-2">
                        {CONTENT.form.fields.service.label}
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-lines focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="">{CONTENT.form.fields.service.placeholder}</option>
                        {CONTENT.serviceOptions.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted mb-2">
                      {CONTENT.form.fields.message.label}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.message && fieldTouched.message ? 'border-red-500' : 'border-lines'} focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none`}
                      placeholder={CONTENT.form.fields.message.placeholder}
                      maxLength={1000}
                    />
                    {fieldErrors.message && fieldTouched.message && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
                    )}
                    {formData.message.length > 0 && (
                      <p className="mt-1 text-sm text-muted text-right">
                        {formData.message.length}/1000 characters
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {CONTENT.form.buttons.submitting}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {CONTENT.form.buttons.submit}
                        </>
                      )}
                    </button>

                    <BookingCTA 
                      buttonText={CONTENT.form.buttons.bookDirectly}
                      buttonStyle="outline"
                      showHelperText={true}
                      helperText={CONTENT.form.buttons.helperText}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Contact Details */}
              <div 
                ref={contactInfoSection.ref}
                className={`bg-white rounded-2xl shadow-xl p-6 animate-fade-left ${contactInfoSection.isVisible ? 'visible' : ''}`}>
                <h3 className="text-xl font-bold mb-6">{CONTENT.contactInfo.title}</h3>
                <div className="space-y-4">
                  {CONTENT.contactInfo.items.map((info, index) => (
                    <div 
                      key={info.label}
                      ref={(el) => contactInfoStagger.setItemRef(index, el)}
                      data-item-id={index}
                      className={`flex items-start gap-4 animate-fade-up delay-${(index + 1) * 100} ${contactInfoStagger.visibleItems[index] ? 'visible' : ''}`}>
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted mb-1">{info.label}</p>
                        {info.link ? (
                          <a 
                            href={info.link}
                            className="font-semibold text-near-black hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-semibold text-near-black">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div 
                ref={socialSection.ref}
                className={`bg-white rounded-2xl shadow-xl p-6 animate-scale ${socialSection.isVisible ? 'visible' : ''}`}>
                <h3 className="text-xl font-bold mb-6">{CONTENT.social.title}</h3>
                <div className="flex gap-3">
                  {CONTENT.social.links.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      aria-label={social.name}
                      className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-all"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Book CTA */}
              <div 
                ref={quickBookSection.ref}
                className={`bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white animate-zoom ${quickBookSection.isVisible ? 'visible' : ''}`}>
                <h3 className="text-xl font-bold mb-4">{CONTENT.quickBook.title}</h3>
                <p className="mb-6 text-white/90">
                  {CONTENT.quickBook.subtitle}
                </p>
                <BookingCTA 
                  buttonText={CONTENT.quickBook.buttonText}
                  className="w-full bg-none text-primary hover:bg-gray-100"
                />
              </div>

              {/* Business Note */}
              <div 
                ref={businessNoteSection.ref}
                className={`bg-blue-50 border-l-4 border-primary rounded-r-lg p-4 animate-fade-up ${businessNoteSection.isVisible ? 'visible' : ''}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary mb-1">{CONTENT.responseTime.title}</p>
                    <p className="text-sm text-muted">
                      {CONTENT.responseTime.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact