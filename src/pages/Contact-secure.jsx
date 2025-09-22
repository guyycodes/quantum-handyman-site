// This is a more secure version of Contact.jsx that uses environment variables
// To use this version:
// 1. Create a .env.local file in your project root
// 2. Add your EmailJS credentials to .env.local
// 3. Replace Contact.jsx with this file

import React, { useState } from 'react'
import emailjs from 'emailjs-com'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingCTA from '../Components/BookingCTA'
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Phone, Mail, MapPin, Clock, 
  Send, CheckCircle, AlertCircle,
  Facebook, Instagram
} from 'lucide-react'
import TikTokIcon from '../Components/TikTokIcon'

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
        icon: Phone,
        label: 'Phone',
        value: '(555) 123-4567',
        link: 'tel:555-123-4567'
      },
      {
        icon: Mail,
        label: 'Email',
        value: 'info@quantumhandyman.com',
        link: 'mailto:info@quantumhandyman.com'
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
    message: 'We typically respond within 24 hours during business days. For urgent matters, please call directly.'
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')
    
    // Prepare template parameters to match EmailJS template variables
    const templateParams = {
      from_name: formData.name,           // {{from_name}} in template
      reply_to: formData.email,           // {{reply_to}} in template  
      phone: formData.phone || "Not provided", // {{phone}} in template
      service_type: formData.service || "Not specified",     // {{service_type}} in template
      message: formData.message            // {{message}} in template
    }

    try {
      // Send email using EmailJS with environment variables
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      if (response.status === 200) {
        setSubmitStatus('success')
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        })
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        setSubmitStatus('error')
        setErrorMessage('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
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
                        required
                        className="w-full px-4 py-3 rounded-lg border border-lines focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder={CONTENT.form.fields.name.placeholder}
                      />
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
                        required
                        className="w-full px-4 py-3 rounded-lg border border-lines focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder={CONTENT.form.fields.email.placeholder}
                      />
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
                        className="w-full px-4 py-3 rounded-lg border border-lines focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder={CONTENT.form.fields.phone.placeholder}
                      />
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
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-lines focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder={CONTENT.form.fields.message.placeholder}
                    />
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

            {/* Contact Info Sidebar - same as original */}
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
