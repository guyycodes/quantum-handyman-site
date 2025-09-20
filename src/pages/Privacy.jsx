import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="container-max mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-muted mb-6">
              <strong>Effective Date:</strong> January 1, 2024
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">1. Information We Collect</h2>
            <p className="text-muted mb-6">
              We collect information you provide directly to us, such as when you contact us, 
              request a quote, or book a service. This may include your name, email address, 
              phone number, address, and service requirements.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">2. How We Use Your Information</h2>
            <p className="text-muted mb-6">
              We use the information we collect to provide, maintain, and improve our services, 
              communicate with you about services and appointments, and send you technical notices 
              and support messages.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">3. Information Sharing</h2>
            <p className="text-muted mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as necessary to provide our services or comply with the law.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">4. Data Security</h2>
            <p className="text-muted mb-6">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">5. Your Rights</h2>
            <p className="text-muted mb-6">
              You have the right to access, update, or delete your personal information. You may also 
              opt out of certain communications from us by following the unsubscribe instructions in 
              those communications.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">6. Cookies</h2>
            <p className="text-muted mb-6">
              We use cookies and similar tracking technologies to track activity on our website and 
              hold certain information to improve your experience.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">7. Third-Party Services</h2>
            <p className="text-muted mb-6">
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices of these external sites.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">8. Children's Privacy</h2>
            <p className="text-muted mb-6">
              Our services are not directed to individuals under 18. We do not knowingly collect 
              personal information from children under 18.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">9. Changes to This Policy</h2>
            <p className="text-muted mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">10. Contact Us</h2>
            <p className="text-muted">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted">
              <li>Email: privacy@quantumhandyman.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: Greater Metro Area</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Privacy
