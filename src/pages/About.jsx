import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingCTA from '../Components/BookingCTA'
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Award, Clock, Shield, Users, 
  CheckCircle, Code, Wrench, GraduationCap,
  Target, Heart, Zap, TrendingUp
} from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    title: 'About Quantum Handyman',
    subtitle: 'Where traditional craftsmanship meets cutting-edge technology'
  },
  
  story: {
    title: 'The Story Behind',
    brandName: 'Quantum Handyman',
    paragraphs: [
      'What happens when you combine a Computer Science degree with a passion for hands-on problem solving? You get a Quantum Handyman - a unique service that bridges the gap between traditional trades and modern technology.',
      'What started as a side hustle quickly revealed a passion for solving real-world problems. After graduating with my CS degree & Minor in Business, I realized I didn\'t want to choose between coding and craftsmanship - so I didn\'t.',
      'Quantum Handyman represents 10+ years of experience & a rare combination of a deep multi-disciplinary skillset. From fixing leaky faucets & drywall to building applications, landscaping, smart home systems & automotive paint correction I deliver the same attention to detail and engineering excellence for every project.'
    ],
    mission: {
      title: 'Mission',
      text: 'To provide comprehensive solutions, uniquely deep multi-disciplinary skills & a systematic problem solving approach for modern homeowners & businesses, Quantum Handyman acheives this by combining craftsmanship with engineering discipline, delivered with community values & professionalism.'
    }
  },
  
  stats: {
    title: 'By The Numbers',
    items: [
      { value: '10+', label: 'Years Experience' },
      { value: '15,000+', label: 'Jobs Complete' },
      { value: '100+', label: 'Happy Customers' },
      { value: '10+', label: 'Services Offered' }
    ]
  },
  
  credentials: {
    title: 'Credentials & Certifications',
    items: [
      'Experienced Craftsman',
      'B.A. Computer Science Degree + Business Minor',
      'Certified Full-Stack Devloper',
      'Smart Home Professional',
      'Automotive Paint Correction Specialist',
      'Landscaping Expert',
      'Insured & Bonded',
      'Background Checked',
      'Systematic Problem-Solver'
    ]
  },
  
  values: {
    title: 'Our Core Values',
    subtitle: 'The principles that guide everything we do',
    items: [
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
  },
  
  timeline: {
    title: 'Our Journey',
    subtitle: 'From college side hustle to comprehensive service provider',
    milestones: [
      { year: '2015', event: 'Started entrapanuer journey with auto repair services as a side hustle' },
      { year: '2018', event: 'Returned to college for Computer Science & Minor in Business' },
      { year: '2019', event: 'Began offering home serive to offset education expenses.' },
      { year: '2020', event: 'Took on lanscaping & sprinkler projects expanding services' },
      { year: '2021', event: 'Took 16 months off of college during Covid-19, took on smart home automation projects & expanded services.' },
      { year: '2022', event: 'Built outdoor patio with full landscaping, masonry, stamped concrete, drywalling & decking expanded services.' },
      { year: '2023', event: 'Maintained a 3.95 GPA while taking on full time college coursework' },
      { year: '2023', event: 'Graduated from University of Denver Certified in Full Stack Development, added web development services' },
      { year: '2024', event: 'Began building a custom website for Quantum Handyman, built custom Natural Language Processing pipline, patched open source LLM (2000+ downloads).' },
      { year: '2024', event: 'Built a custom Web SaaS platform, integrated LLM agents to handle booking & estimates.' },
      { year: '2025', event: 'Graduate CS Degree + Business Minor 3.95 GPA, Deeloper custom open source Ai package and Recieved over 2000+ downloads.' },
      { year: '2025', event: 'Integrated Quantum Handyman into Dandymen.io, to enhance the booking, estimation, and job management process.' },
    ]
  },
  
  cta: {
    title: 'Ready to Work with Quantum Handyman?',
    subtitle: 'Experience the difference of working with a true problem-solver who brings both technical expertise and traditional craftsmanship to every project.',
    buttons: {
      bookService: 'Book a Service',
      getQuote: 'Get Free Quote'
    }
  }
}

const About = () => {
  // Intersection observers
  const heroSection = useIntersectionObserver({ threshold: 0.3 })
  const storySection = useIntersectionObserver({ threshold: 0.2 })
  const statsCard = useIntersectionObserver({ threshold: 0.3 })
  const credentialsCard = useIntersectionObserver({ threshold: 0.3 })
  const valuesTitle = useIntersectionObserver({ threshold: 0.3 })
  const timelineTitle = useIntersectionObserver({ threshold: 0.3 })
  const ctaSection = useIntersectionObserver({ threshold: 0.3 })
  
  // Staggered animations
  const valuesStagger = useStaggeredIntersection(4, { threshold: 0.1 })
  const milestonesStagger = useStaggeredIntersection(7, { threshold: 0.1 })
  const certificationsStagger = useStaggeredIntersection(6, { threshold: 0.1 })

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

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-max mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              ref={storySection.ref}
              className={`space-y-6 animate-fade-right ${storySection.isVisible ? 'visible' : ''}`}>
              <h2 className="text-3xl md:text-4xl font-bold">
                {CONTENT.story.title} <span className="gradient-text">{CONTENT.story.brandName}</span>
              </h2>
              <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4">
                <p className="font-semibold text-primary mb-2">{CONTENT.story.mission.title}</p>
                <p className="text-near-black">
                  {CONTENT.story.mission.text}
                </p>
              </div>
              {CONTENT.story.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-lg text-muted leading-relaxed" : "text-muted leading-relaxed"}>
                  {paragraph}
                </p>
              ))}


            </div>

            <div className="space-y-6">
              {/* Stats Card */}
              <div 
                ref={statsCard.ref}
                className={`bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white animate-fade-left ${statsCard.isVisible ? 'visible' : ''}`}>
                <h3 className="text-2xl font-bold mb-6">{CONTENT.stats.title}</h3>
                <div className="grid grid-cols-2 gap-6">
                  {CONTENT.stats.items.map((stat, index) => (
                    <div key={index}>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-white/80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credentials */}
              <div 
                ref={credentialsCard.ref}
                className={`bg-white rounded-2xl shadow-xl p-6 animate-scale ${credentialsCard.isVisible ? 'visible' : ''}`}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  {CONTENT.credentials.title}
                </h3>
                <div className="space-y-2">
                  {CONTENT.credentials.items.map((cert, index) => (
                    <div 
                      key={index}
                      ref={(el) => certificationsStagger.setItemRef(index, el)}
                      data-item-id={index}
                      className={`flex items-center gap-2 animate-fade-left delay-${(index + 1) * 100} ${certificationsStagger.visibleItems[index] ? 'visible' : ''}`}>
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
          <div 
            ref={valuesTitle.ref}
            className={`text-center mb-12 animate-fade-up ${valuesTitle.isVisible ? 'visible' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {CONTENT.values.title.split('Values')[0]}<span className="gradient-text">Values</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {CONTENT.values.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTENT.values.items.map((value, index) => (
              <div 
                key={index}
                ref={(el) => valuesStagger.setItemRef(index, el)}
                data-item-id={index}
                className={`bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow animate-zoom delay-${(index + 1) * 100} ${valuesStagger.visibleItems[index] ? 'visible' : ''}`}>
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
          <div 
            ref={timelineTitle.ref}
            className={`text-center mb-12 animate-fade-up ${timelineTitle.isVisible ? 'visible' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {CONTENT.timeline.title.split('Journey')[0]}<span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {CONTENT.timeline.subtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {CONTENT.timeline.milestones.map((milestone, index) => (
              <div 
                key={index}
                ref={(el) => milestonesStagger.setItemRef(index, el)}
                data-item-id={index}
                className={`flex gap-4 mb-8 last:mb-0 animate-fade-left delay-${(index + 1) * 100} ${milestonesStagger.visibleItems[index] ? 'visible' : ''}`}>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  {index < CONTENT.timeline.milestones.length - 1 && (
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
        <div 
          ref={ctaSection.ref}
          className={`container-max mx-auto px-6 text-center text-white animate-zoom ${ctaSection.isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {CONTENT.cta.title}
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {CONTENT.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookingCTA 
              buttonText={CONTENT.cta.buttons.bookService}
              size="lg"
               className="bg-none text-primary hover:bg-primary/10"
            />
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
            >
              {CONTENT.cta.buttons.getQuote}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About