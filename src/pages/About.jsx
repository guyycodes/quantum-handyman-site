import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingCTA from '../components/BookingCTA'
import { 
  Award, Clock, Shield, Users, 
  CheckCircle, Code, Wrench, GraduationCap,
  Target, Heart, Zap, TrendingUp
} from 'lucide-react'

const About = () => {
  const milestones = [
    { year: '2016', event: 'Started handyman services while in college' },
    { year: '2018', event: 'Graduated with Computer Science degree' },
    { year: '2019', event: 'Launched web development services' },
    { year: '2020', event: 'Added smart home automation expertise' },
    { year: '2021', event: 'Expanded to automotive detailing' },
    { year: '2023', event: 'Achieved 500+ completed projects' },
    { year: '2024', event: 'Recognized as top-rated local service provider' }
  ]

  const values = [
    {
      icon: Target,
      title: 'Problem-Solving Excellence',
      description: 'We approach every challenge with analytical thinking and creative solutions.'
    },
    {
      icon: Heart,
      title: 'Customer-First Approach',
      description: 'Your satisfaction is our priority. We listen, understand, and deliver.'
    },
    {
      icon: Zap,
      title: 'Efficiency & Innovation',
      description: 'Combining traditional skills with modern technology for optimal results.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      description: 'Always learning, always growing, always improving our craft.'
    }
  ]

  const certifications = [
    'Licensed General Contractor',
    'Certified Web Developer',
    'Smart Home Professional',
    'Auto Detailing Specialist',
    'Insured & Bonded',
    'Background Checked'
  ]

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="container-max mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Quantum Handyman</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Where traditional craftsmanship meets cutting-edge technology
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-max mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                The Story Behind <span className="gradient-text">Quantum Handyman</span>
              </h2>
              
              <p className="text-lg text-muted leading-relaxed">
                What happens when you combine a Computer Science degree with a passion for 
                hands-on problem solving? You get Quantum Handyman - a unique service that 
                bridges the gap between traditional trades and modern technology.
              </p>

              <p className="text-muted leading-relaxed">
                Starting in 2016, I began offering handyman services to help pay for college. 
                What started as a side hustle quickly revealed a passion for solving real-world 
                problems. After graduating with my CS degree in 2018, I realized I didn't want 
                to choose between coding and craftsmanship - so I didn't.
              </p>

              <p className="text-muted leading-relaxed">
                Today, Quantum Handyman represents 8+ years of experience across multiple 
                disciplines. From fixing leaky faucets to building custom web applications, 
                from installing smart home systems to detailing cars - we bring the same 
                attention to detail and problem-solving excellence to every project.
              </p>

              <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4">
                <p className="font-semibold text-primary mb-2">Our Mission</p>
                <p className="text-near-black">
                  To provide comprehensive solutions for modern living by combining traditional 
                  craftsmanship with technological innovation, all delivered with unmatched 
                  professionalism and care.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">By The Numbers</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold">8+</div>
                    <div className="text-white/80">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-white/80">Projects Complete</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">200+</div>
                    <div className="text-white/80">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50+</div>
                    <div className="text-white/80">Services Offered</div>
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Credentials & Certifications
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-muted">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-sm text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              From college side hustle to comprehensive service provider
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-lines mt-2"></div>
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-sm text-primary font-semibold mb-1">{milestone.year}</div>
                  <div className="text-near-black">{milestone.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container-max mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work with Quantum Handyman?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experience the difference of working with a true problem-solver who brings 
            both technical expertise and traditional craftsmanship to every project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingCTA 
              buttonText="Book a Service"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            />
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
