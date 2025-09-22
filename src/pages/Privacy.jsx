import React from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    title: 'Privacy Policy'
  },
  
  effectiveDate: 'Effective Date: January 1, 2024',
  
  sections: [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as when you contact us, request a quote, or book a service. This may include your name, email address, phone number, address, and service requirements.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, communicate with you about services and appointments, and send you technical notices and support messages.'
    },
    {
      title: '3. Information Sharing',
      content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to provide our services or comply with the law.'
    },
    {
      title: '4. Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
    },
    {
      title: '5. Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You may also opt-out of certain communications from us.'
    },
    {
      title: '6. Cookies',
      content: 'Our website may use cookies to enhance user experience. You can choose to disable cookies through your browser settings.'
    },
    {
      title: '7. Third-Party Services',
      content: 'We use Dandymen.io for booking management. Please review their privacy policy for information on how they handle your data.'
    },
    {
      title: '8. Updates to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.'
    },
    {
      title: '9. Contact Us',
      content: 'If you have any questions about this Privacy Policy, please contact us at info@quantumhandyman.com or (555) 123-4567.'
    }
  ]
}

const Privacy = () => {
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

export default Privacy