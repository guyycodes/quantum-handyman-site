import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Terms = () => {
  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="container-max mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-muted mb-6">
              <strong>Effective Date:</strong> January 1, 2024
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">1. Agreement to Terms</h2>
            <p className="text-muted mb-6">
              By accessing and using Quantum Handyman services, you agree to be bound by these 
              Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">2. Services</h2>
            <p className="text-muted mb-6">
              Quantum Handyman provides home repair, landscaping, web development, smart home 
              automation, and automotive detailing services. Specific service details will be 
              agreed upon before work commences.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">3. Booking and Scheduling</h2>
            <p className="text-muted mb-6">
              Services can be booked through our website or partner platform. We strive to 
              accommodate your preferred scheduling, but availability may vary. Cancellations 
              must be made at least 24 hours in advance.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">4. Pricing and Payment</h2>
            <p className="text-muted mb-6">
              Pricing will be provided via quote before work begins. Payment is due upon 
              completion of services unless otherwise agreed. We accept cash, check, and 
              major credit cards.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">5. Warranty and Guarantees</h2>
            <p className="text-muted mb-6">
              We stand behind our work with a satisfaction guarantee. Specific warranty terms 
              vary by service type and will be communicated at the time of service.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">6. Liability Limitations</h2>
            <p className="text-muted mb-6">
              Quantum Handyman is insured and will be responsible for damage caused by our 
              negligence. However, we are not liable for pre-existing conditions or normal 
              wear and tear.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">7. Intellectual Property</h2>
            <p className="text-muted mb-6">
              For web development services, you retain ownership of your content. We retain 
              rights to our code libraries and methodologies. Custom code developed specifically 
              for your project becomes your property upon full payment.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">8. Privacy</h2>
            <p className="text-muted mb-6">
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">9. Dispute Resolution</h2>
            <p className="text-muted mb-6">
              We aim to resolve any disputes amicably. If we cannot reach a resolution, disputes 
              will be settled through binding arbitration in accordance with local laws.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">10. Modifications</h2>
            <p className="text-muted mb-6">
              We reserve the right to modify these terms at any time. Changes will be posted 
              on our website and will become effective immediately upon posting.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-near-black">11. Contact Information</h2>
            <p className="text-muted">
              For questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted">
              <li>Email: legal@quantumhandyman.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: Greater Metro Area</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 border-l-4 border-primary rounded-r-lg">
              <p className="text-primary font-semibold mb-2">Note</p>
              <p className="text-muted">
                By using our services, you acknowledge that you have read, understood, and 
                agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Terms
