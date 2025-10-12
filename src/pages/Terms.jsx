import React from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    title: 'Terms of Service'
  },
  
  effectiveDate: 'Effective Date: January 1, 2024',
  
  sections: [
    {
      title: '1. Agreement to Terms',
      content: 'By accessing and using Quantum Technician services, you agree to be bound by these Terms of Service and all applicable laws and regulations.'
    },
    {
      title: '2. Services',
      content: 'Quantum Technician provides home repair, landscaping, web development, smart home automation, and automotive scratch repair/paint correction services. Specific service details will be agreed upon before work commences.'
    },
    {
      title: '3. Booking and Scheduling',
      content: 'Services can be booked through our website or partner platform. We strive to accommodate your preferred scheduling, but availability may vary. Cancellations must be made at least 24 hours in advance.'
    },
    {
      title: '4. Pricing and Payment',
      content: 'Pricing will be provided via quote before work begins. Payment is due upon completion of services unless otherwise agreed. We accept cash, check, and major credit cards.'
    },
    {
      title: '5. Warranty and Guarantees',
      content: 'We stand behind our work with a satisfaction guarantee. Specific warranty terms vary by service type and will be communicated before work begins.'
    },
    {
      title: '6. Limitation of Liability',
      content: 'Quantum Technician shall not be liable for any indirect, incidental, or consequential damages arising from our services. Our total liability shall not exceed the amount paid for the specific service.'
    },
    {
      title: '7. Property Access',
      content: 'By booking our services, you grant us permission to access your property as necessary to complete the agreed-upon work.'
    },
    {
      title: '8. Insurance',
      content: 'Quantum Technician maintains appropriate insurance coverage. Proof of insurance is available upon request.'
    },
    {
      title: '9. Intellectual Property',
      content: 'For web development services, unless otherwise agreed, you will own all rights to the final deliverables upon full payment.'
    },
    {
      title: '10. Third-Party Platforms',
      content: 'All bookings are subject to our standard terms of service and booking policies.'
    },
    {
      title: '11. Modifications to Terms',
      content: 'We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any changes.'
    },
    {
      title: '12. Governing Law',
      content: 'These Terms shall be governed by local state law without regard to conflict of law provisions.'
    },
    {
      title: '13. Contact Information',
      content: 'For questions about these Terms, please contact us at info@quantumtechnician.com or (555) 123-4567.'
    }
  ]
}

const Terms = () => {
  // Intersection observers
  const heroSection = useIntersectionObserver({ threshold: 0.3 })
  const contentSection = useIntersectionObserver({ threshold: 0.2 })
  
  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div 
          ref={heroSection.ref}
          className={`container-max mx-auto px-6 text-center text-white animate-fade-down ${heroSection.isVisible ? 'visible' : ''}`}>
          <h1 className="text-4xl md:text-5xl font-bold">{CONTENT.hero.title}</h1>
        </div>
      </section>

      <section className="section-padding">
        <div 
          ref={contentSection.ref}
          className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-up ${contentSection.isVisible ? 'visible' : ''}`}>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted mb-6">
              <strong>{CONTENT.effectiveDate}</strong>
            </p>

            {CONTENT.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-near-black">{section.title}</h2>
                <p className="text-muted">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Terms