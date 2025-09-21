import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingCTA from '../components/BookingCTA'
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Filter, X, ExternalLink, Calendar,
  MapPin, Star, ChevronLeft, ChevronRight
} from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    title: 'Our Portfolio',
    subtitle: 'See the quality and range of our work across different service categories'
  },
  
  categories: [
    { id: 'all', name: 'All Projects' },
    { id: 'home-repair', name: 'Home Repairs' },
    { id: 'landscaping', name: 'Landscaping' },
    { id: 'web-dev', name: 'Web Development' },
    { id: 'smart-home', name: 'Smart Home' },
    { id: 'automotive', name: 'Automotive' }
  ],
  
  emptyState: 'No projects found in this category.',
  
  projectModal: {
    projectDetails: 'Project Details',
    clientTestimonial: 'Client Testimonial',
    date: 'Date:',
    location: 'Location:',
    duration: 'Duration:',
    bookSimilar: 'Book Similar Service',
    visitSite: 'Visit Site',
    imagePlaceholder: 'Before/After Gallery'
  },
  
  projectCard: {
    imagePlaceholder: 'Project Image'
  },
  
  cta: {
    title: 'Ready to Start Your Project?',
    subtitle: 'Let\'s bring your vision to life with professional expertise and attention to detail',
    buttons: {
      startProject: 'Start Your Project',
      getQuote: 'Get Free Quote'
    }
  }
}

// Projects Data
const PROJECTS_DATA = [
  {
    id: 1,
    category: 'home-repair',
    title: 'Complete Kitchen Renovation',
    description: 'Full kitchen remodel including plumbing, electrical, and cabinet installation',
    date: 'March 2024',
    location: 'Downtown Area',
    duration: '2 weeks',
    images: ['kitchen-before.jpg', 'kitchen-after.jpg'],
    testimonial: 'Transformed our outdated kitchen into a modern masterpiece!',
    client: 'Sarah M.',
    rating: 5
  },
  {
    id: 2,
    category: 'web-dev',
    title: 'E-Commerce Platform',
    description: 'Custom online store with inventory management and payment processing',
    date: 'February 2024',
    location: 'Remote',
    duration: '3 weeks',
    images: ['ecommerce-home.jpg', 'ecommerce-dashboard.jpg'],
    testimonial: 'Our online sales increased 200% after launching the new site!',
    client: 'Tech Startup Co.',
    rating: 5,
    link: 'https://example.com'
  },
  {
    id: 3,
    category: 'smart-home',
    title: 'Full Home Automation',
    description: 'Complete smart home setup with lighting, climate, and security integration',
    date: 'January 2024',
    location: 'Suburbs',
    duration: '3 days',
    images: ['smart-home-panel.jpg', 'smart-home-app.jpg'],
    testimonial: 'Now I can control everything from my phone. Amazing!',
    client: 'Mike T.',
    rating: 5
  },
  {
    id: 4,
    category: 'landscaping',
    title: 'Backyard Transformation',
    description: 'Complete landscaping overhaul with smart irrigation system',
    date: 'December 2023',
    location: 'North Side',
    duration: '1 week',
    images: ['backyard-before.jpg', 'backyard-after.jpg'],
    testimonial: 'Our backyard is now the envy of the neighborhood!',
    client: 'Emily R.',
    rating: 5
  },
  {
    id: 5,
    category: 'automotive',
    title: 'Classic Car Restoration',
    description: 'Full paint correction and ceramic coating on vintage vehicle',
    date: 'November 2023',
    location: 'Mobile Service',
    duration: '2 days',
    images: ['car-before.jpg', 'car-after.jpg'],
    testimonial: 'My car looks better than when I bought it new!',
    client: 'David C.',
    rating: 5
  },
  {
    id: 6,
    category: 'web-dev',
    title: 'Business Portfolio Site',
    description: 'Professional website for local photography business',
    date: 'October 2023',
    location: 'Remote',
    duration: '1 week',
    images: ['portfolio-site.jpg'],
    testimonial: 'The website perfectly captures my brand. Clients love it!',
    client: 'Photography Plus',
    rating: 5,
    link: 'https://example.com'
  },
  {
    id: 7,
    category: 'home-repair',
    title: 'Bathroom Remodel',
    description: 'Complete bathroom renovation with modern fixtures',
    date: 'September 2023',
    location: 'East Side',
    duration: '1 week',
    images: ['bathroom-before.jpg', 'bathroom-after.jpg'],
    testimonial: 'Turned our dated bathroom into a spa-like retreat!',
    client: 'Jennifer K.',
    rating: 5
  },
  {
    id: 8,
    category: 'smart-home',
    title: 'Security System Install',
    description: 'Comprehensive security system with cameras and smart locks',
    date: 'August 2023',
    location: 'Commercial District',
    duration: '1 day',
    images: ['security-system.jpg'],
    testimonial: 'Feel so much safer with the new security setup!',
    client: 'Local Business',
    rating: 5
  }
]

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  
  // Intersection observers
  const heroSection = useIntersectionObserver({ threshold: 0.3 })
  const filterSection = useIntersectionObserver({ threshold: 0.3 })
  const ctaSection = useIntersectionObserver({ threshold: 0.3 })
  
  // Staggered animations for projects
  const projectsStagger = useStaggeredIntersection(8, { threshold: 0.1 })

  const filteredProjects = PROJECTS_DATA.filter(
    project => selectedCategory === 'all' || project.category === selectedCategory
  )

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

      {/* Portfolio Section */}
      <section className="section-padding">
        <div className="container-max mx-auto">
          {/* Category Filter */}
          <div 
            ref={filterSection.ref}
            className={`flex flex-wrap justify-center gap-3 mb-12 animate-fade-up ${filterSection.isVisible ? 'visible' : ''}`}>
            {CONTENT.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted hover:bg-gray-100 shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => projectsStagger.setItemRef(project.id, el)}
                data-item-id={project.id}
                onClick={() => setSelectedProject(project)}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-scale delay-${(index % 3 + 1) * 100} ${projectsStagger.visibleItems[project.id] ? 'visible' : ''}`}
              >
                {/* Project Image */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-400 rounded-lg mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">{CONTENT.projectCard.imagePlaceholder}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                    {CONTENT.categories.find(cat => cat.id === project.category)?.name.replace('All Projects', '')}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted text-sm mb-4">{project.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(project.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-muted">{project.client}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted">{CONTENT.emptyState}</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-lines p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image Gallery Placeholder */}
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-96 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-400 rounded-lg mx-auto mb-4"></div>
                  <p className="text-gray-600">{CONTENT.projectModal.imagePlaceholder}</p>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">{CONTENT.projectModal.projectDetails}</h3>
                  <p className="text-muted mb-4">{selectedProject.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">{CONTENT.projectModal.date}</span>
                      <span className="font-medium">{selectedProject.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{CONTENT.projectModal.location}</span>
                      <span className="font-medium">{selectedProject.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{CONTENT.projectModal.duration}</span>
                      <span className="font-medium">{selectedProject.duration}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">{CONTENT.projectModal.clientTestimonial}</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-muted italic mb-3">"{selectedProject.testimonial}"</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">- {selectedProject.client}</span>
                      <div className="flex gap-0.5">
                        {[...Array(selectedProject.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <BookingCTA 
                  service={CONTENT.categories.find(cat => cat.id === selectedProject.category)?.name}
                  buttonText={CONTENT.projectModal.bookSimilar}
                  buttonStyle="primary"
                />
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    {CONTENT.projectModal.visitSite}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
              buttonText={CONTENT.cta.buttons.startProject}
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

export default Portfolio