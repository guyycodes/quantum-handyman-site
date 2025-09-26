import React, { useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BookingCTA from '../Components/BookingCTA'
import BeforeAfterSlider from '../Components/BeforeAfterSlider'
import { useIntersectionObserver, useStaggeredIntersection } from '../hooks/useIntersectionObserver'
import { 
  Filter, X, ExternalLink, Calendar,
  MapPin, Star, ChevronLeft, ChevronRight, PlayCircle
} from 'lucide-react'

// Content Management - All text content in one place
const CONTENT = {
  hero: {
    title: 'Our Portfolio',
    subtitle: 'See the quality and range of our work across different service categories'
  },
  
  categories: [
    { id: 'all', name: 'All' },
    { id: 'home-repair', name: 'Property & Maintenance' },
    { id: 'landscaping', name: 'Landscape & Outdoor' },
    { id: 'web-dev', name: 'Web & Digital' },
    { id: 'smart-home', name: 'Smart Homes & Automation' }
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
    imagePlaceholder: 'Before/After Gallery',
    watchOnYoutube: 'Watch on YouTube'
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
  },
  
  // Helper text for different project types
  projectHelperText: {
    furniture: 'Sample furniture assembly projects - We handle all types of furniture from major providers',
    smartAssistant: 'Professional smart assistant setup - Google Home, Alexa, and other voice control systems',
    securityCameras: 'Complete security camera installations - Ring, Eufy, Arlo, and other major brands',
    smartLighting: 'Smart lighting solutions - Automated controls, energy savings, and custom scenes'
  },
  
  // Image alt text labels
  imageLabels: {
    furniture: ['Living Room Setup', 'Modern Sofa Assembly', 'Cabinet Installation', 'Wardrobe Assembly'],
    smartAssistant: ['Google Home Setup', 'Smart Speaker Installation', 'Alexa Device'],
    securityCameras: ['Security Camera', 'Eufy Camera System', 'Solar Panel Installation', 'Ring Doorbell'],
    smartLighting: ['Smart Bulbs', 'Smart Switch Installation', 'LED Strip Lighting', 'Automated Room Lighting'],
    default: 'Project Image'
  },
  
  // Projects content
  projects: {
    customAssemblies: {
      title: 'Custom Assemblies - Furniture, Cabinets, Wardrobes, Tables, Couches, Closets, etc.',
      description: 'Professional assembly of wardrobes, couches, closets, and custom furniture solutions',
      testimonial: 'Expert assembly service - everything fits perfectly and looks amazing!',
      client: 'Various Clients & Locations'
    },
    bathroomTile: {
      title: 'Custom Bathroom Remodel/Tile Installation',
      description: 'Custom tile installation for kitchen, bathroom, and flooring',
      testimonial: 'Loved the brand new look!',
      client: 'Sunnyside Denver Metro'
    },
    smartAssistant: {
      title: 'Smart Home Assistant Installation',
      description: 'Professional installation and setup of Google Home and Amazon Alexa smart assistants',
      testimonial: 'Now I can control most things with voice commands.',
      client: 'Multiple Residential Clients'
    },
    backyardTransform: {
      title: 'Backyard Transformation',
      description: 'Complete landscaping overhaul with smart irrigation system',
      testimonial: 'Completley transformed our backyard into a beautiful outdoor living space.',
      client: 'Highland, Sunnyside, Bailey, Conifer & More'
    },
    aiIntegration: {
      title: 'AI Integration Tool for Business',
      description: 'Professional NPM package for Compliant AI integration - @guyycodes/plugin-sdk. Enterprise-ready AI integration tool for businesses.',
      testimonial: 'Powerful SDK that simplifies plugin development and AI integration for businesses.',
      client: 'NPM Community'
    },
    whealthApp: {
      title: 'Custom CMS integration',
      description: 'Custom CMS integration with Whealth App - Mobile health and fitness application',
      testimonial: 'Seamless integration of content management with health app.',
      client: 'Whealth App'
    },
    dandymen: {
      title: 'Dandymen.io Platform',
      description: 'Service dispatch platform for professional services',
      testimonial: 'Platform for managing professional services efficiently!',
      client: 'Levelup Apps & Software'
    },
    storageSheds: {
      title: 'Storage Sheds',
      description: 'Storage Shed Installation • No permit-required work • Seal & Paint',
      testimonial: 'Perfect shed installation - looks great and nice paint work.',
      client: 'Denver Residence'
    },
    backyardRenovation: {
      title: 'Backyard Renovation',
      description: 'Stamped concrete patio • Irrigation system • Ceiling drywall • Decking • Sod installation • Masonry • Roofing',
      testimonial: 'Transformed our entire backyard into a beautiful outdoor living space!',
      client: 'Residential Property'
    },
    securityCameras: {
      title: 'Security Camera Installation',
      description: 'Professional installation of Ring, Eufy, and other smart security camera systems',
      testimonial: 'Feel so much safer now!',
      client: 'Residential & Commercial'
    },
    smartLighting: {
      title: 'Smart Lighting Systems',
      description: 'Installation of smart bulbs, switches, and automated lighting control systems, can integrate with custom networking or existing routers etc.',
      testimonial: 'Amazing mood lighting and energy savings. Love controlling lights from my phone!',
      client: 'Residential Properties'
    },
    sprinklerMaintenance: {
      title: 'Sprinkler Maintenance',
      description: 'Sprinkler systems, seasonal & general maintenance',
      testimonial: 'Made seasonal prep easy and efficient.',
      client: 'Residential Properties'
    }
  }
}

// Projects Data
const PROJECTS_DATA = [
  {
    id: 1,
    category: 'home-repair',
    title: CONTENT.projects.customAssemblies.title,
    description: CONTENT.projects.customAssemblies.description,
    date: 'March 2024',
    location: 'Denver Metro Area',
    duration: 'Various',
    images: [
      '/images/home-repair/living_room.png',
      '/images/home-repair/sofa.png',
      '/images/home-repair/repair.png',
      '/images/home-repair/_lighting.png'
    ],
    projectImg: '/images/home-repair/custom_furniture.png',
    testimonial: CONTENT.projects.customAssemblies.testimonial,
    client: CONTENT.projects.customAssemblies.client,
    rating: 5
  },
  {
    id: 2,
    category: 'home-repair',
    title: CONTENT.projects.bathroomTile.title,
    description: CONTENT.projects.bathroomTile.description,
    date: '2020',
    location: 'Denver Metro',
    duration: '1-2 weeks',
    images: ['/images/home-repair/bathroom_tile.jpeg'],
    testimonial: CONTENT.projects.bathroomTile.testimonial,
    client: CONTENT.projects.bathroomTile.client,
    rating: 5,
    projectImg: '/images/home-repair/bathroom.png'
  },
  {
    id: 3,
    category: 'smart-home',
    title: CONTENT.projects.smartAssistant.title,
    description: CONTENT.projects.smartAssistant.description,
    date: '2024',
    location: 'Denver Metro',
    duration: '1-2 days',
    images: [
      // 'https://images.unsplash.com/photo-1558089687-7b5831caf48e?w=800&h=600&fit=crop',  // Google Home
      '/images/smart-home/google_home.png',  // Smart speaker setup
      // 'https://images.unsplash.com/photo-1519558260268-eb878c7418a4?w=800&h=600&fit=crop'   // Alexa device
    ],
    testimonial: CONTENT.projects.smartAssistant.testimonial,
    client: CONTENT.projects.smartAssistant.client,
    rating: 5,
    projectImg: '/images/smart-home/smart_speaker.png'
  },
  {
    id: 4,
    category: 'landscaping',
    title: CONTENT.projects.backyardTransform.title,
    description: CONTENT.projects.backyardTransform.description,
    date: '2025',
    location: 'North Side',
    duration: '1 week',
    images: ['/images/landscaping/Backyard_b4.jpg', '/images/landscaping/Backyard_after.png'],  // Use actual backyard images for before/after
    testimonial: CONTENT.projects.backyardTransform.testimonial,
    client: CONTENT.projects.backyardTransform.client,
    rating: 5
  },
  {
    id: 5,
    category: 'web-dev',
    title: CONTENT.projects.aiIntegration.title,
    description: CONTENT.projects.aiIntegration.description,
    date: '2024',
    location: 'Open Source',
    duration: 'Ongoing',
    images: ['/images/web-dev/Ai_description.png'],  // Show AI logo and feature description
    projectImg: '/images/web-dev/Ai.png',  // Use AI image as thumbnail
    testimonial: CONTENT.projects.aiIntegration.testimonial,
    client: CONTENT.projects.aiIntegration.client,
    rating: 5,
    link: 'https://www.npmjs.com/package/@guyycodes/plugin-sdk'
  },
  {
    id: 6,
    category: 'web-dev',
    title: CONTENT.projects.whealthApp.title,
    description: CONTENT.projects.whealthApp.description,
    date: '2024',
    location: 'Remote',
    duration: 'in-progress',
    images: [],  // Video will be shown in modal
    projectImg: '/images/web-dev/whealth_app.png',  // Thumbnail image for grid
    testimonial: CONTENT.projects.whealthApp.testimonial,
    client: CONTENT.projects.whealthApp.client,
    rating: 5,
    link: 'https://www.youtube.com/watch?v=FUmcR7h17VM&t=474s',
    videoUrl: 'https://www.youtube.com/embed/FUmcR7h17VM?start=474&autoplay=1'  // Embed URL with autoplay
  },
  {
    id: 7,
    category: 'web-dev',
    title: CONTENT.projects.dandymen.title,
    description: CONTENT.projects.dandymen.description,
    date: '2024 - Present',
    location: 'Denver',
    duration: 'In Progress',
    images: ['/images/web-dev/Dandymen_io.png'],  // Use actual Dandymen image
    testimonial: CONTENT.projects.dandymen.testimonial,
    client: CONTENT.projects.dandymen.client,
    rating: 5,
    link: 'https://www.dandymen.io/',
    projectImg: '/images/web-dev/Dandymen_io.png'
  },
  {
    id: 8,
    category: 'home-repair',
    title: CONTENT.projects.storageSheds.title,
    description: CONTENT.projects.storageSheds.description,
    date: '2022',
    location: 'Denver Metro',
    duration: '2 days',
    images: ['/images/home-repair/shed.png'],  // Use actual shed image
    testimonial: CONTENT.projects.storageSheds.testimonial,
    client: CONTENT.projects.storageSheds.client,
    rating: 5,
    projectImg: '/images/home-repair/some_shed.png'
  },
  {
    id: 9,
    category: 'landscaping',
    title: CONTENT.projects.backyardRenovation.title,
    description: CONTENT.projects.backyardRenovation.description,
    date: '2023',
    location: 'Denver Metro',
    duration: '2 weeks',
    images: ['/images/landscaping/landscape_before.png', '/images/landscaping/landscape_after.png'],  // Before/after from Home component
    testimonial: CONTENT.projects.backyardRenovation.testimonial,
    client: CONTENT.projects.backyardRenovation.client,
    rating: 5
  },
  {
    id: 10,
    category: 'smart-home',
    title: CONTENT.projects.securityCameras.title,
    description: CONTENT.projects.securityCameras.description,
    date: '2025',
    location: 'Denver Metro',
    duration: '2-4 hours',
    images: [
      '/images/smart-home/security_cam.png',
      '/images/smart-home/eufy.png',
      '/images/smart-home/solar_panel.png',
    ],
    testimonial: CONTENT.projects.securityCameras.testimonial,
    client: CONTENT.projects.securityCameras.client,
    rating: 5,
    projectImg: '/images/smart-home/many_cameras.png'
  },
  {
    id: 11,
    category: 'smart-home',
    title: CONTENT.projects.smartLighting.title,
    description: CONTENT.projects.smartLighting.description,
    date: '2023',
    location: 'Denver Metro',
    duration: '3-5 hours',
    images: [
      // 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',  // Smart bulbs
      '/images/smart-home/smart_lights.jpeg',  // Smart switch
      '/images/smart-home/lighting.png',  // 
      '/images/home-repair/_lighting.png'   // Room with smart lights
    ],
    testimonial: CONTENT.projects.smartLighting.testimonial,
    client: CONTENT.projects.smartLighting.client,
    rating: 5,
    projectImg: '/images/smart-home/smart_home_app.png'  // Using smart home image for smart lighting
  },
  {
    id: 12,
    category: 'landscaping',
    title: CONTENT.projects.sprinklerMaintenance.title,
    description: CONTENT.projects.sprinklerMaintenance.description,
    date: '2021-2024',
    location: 'Denver Metro',
    duration: '3-5 hours',
    images: [
      '/images/landscaping/sprinkler_b4.png', 
      '/images/landscaping/sprinkler_after.png', 
    ],
    testimonial: CONTENT.projects.sprinklerMaintenance.testimonial,
    client: CONTENT.projects.sprinklerMaintenance.client,
    rating: 5,
    projectImg: '/images/landscaping/sprkinkler_head.png'  // Using smart home image for smart lighting
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
  const projectsStagger = useStaggeredIntersection(PROJECTS_DATA.length, { threshold: 0.1 })

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
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  {project.projectImg || (project.images && project.images[0]) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <img 
                        src={project.projectImg || project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ display: (project.projectImg || (project.images && project.images[0])) ? 'none' : 'flex' }}>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-400 rounded-lg mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">{CONTENT.projectCard.imagePlaceholder}</p>
                    </div>
                  </div>
                  
                  {/* Video Indicator */}
                  {project.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                        <PlayCircle className="w-12 h-12 text-white fill-white/20" />
                      </div>
                    </div>
                  )}
                  
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
              {/* Image Gallery or Video */}
              <div className="mb-6">
                {selectedProject.videoUrl ? (
                  // YouTube Video Embed with 16:9 aspect ratio
                  <div className="rounded-xl overflow-hidden bg-black relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src={selectedProject.videoUrl}
                      title={selectedProject.title}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors z-10"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {CONTENT.projectModal.watchOnYoutube}
                    </a>
                  </div>
                ) : selectedProject.images && selectedProject.images.length === 2 ? (
                  // Before/After slider for exactly 2 images
                  <div className="rounded-xl overflow-hidden">
                    <BeforeAfterSlider
                      beforeImage={selectedProject.images[0]}
                      afterImage={selectedProject.images[1]}
                      beforeAlt={`${selectedProject.title} - Before`}
                      afterAlt={`${selectedProject.title} - After`}
                      height="h-96"
                      showLabels={true}
                      showInstruction={true}
                      containerClassName="rounded-xl"
                    />
                  </div>
                ) : selectedProject.images && selectedProject.images.length === 1 ? (
                  // Single image display - using object-contain to show full image
                  <div className="rounded-xl overflow-hidden h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <img 
                      src={selectedProject.images[0]}
                      alt={selectedProject.title}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = `
                          <div class="text-center">
                            <div class="w-32 h-32 bg-gray-400 rounded-lg mx-auto mb-4"></div>
                            <p class="text-gray-600">${CONTENT.projectModal.imagePlaceholder}</p>
                          </div>
                        `;
                      }}
                    />
                  </div>
                ) : selectedProject.images && selectedProject.images.length > 2 ? (
                  // Multiple images grid
                  <div className="space-y-4">
                    <div className={`grid ${selectedProject.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                      {selectedProject.images.map((img, index) => {
                        // Projects with portrait images that need object-contain
                        // ID 10: Security Cameras, ID 11: Smart Lighting
                        const useObjectContain = [10, 11].includes(selectedProject.id);
                        
                        return (
                          <div key={index} className={`rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${
                            useObjectContain ? 'h-64 flex items-center justify-center p-2' : ''
                          }`}>
                            <img 
                              src={img}
                              alt={`${selectedProject.title} - ${
                                selectedProject.id === 1 ? 
                                CONTENT.imageLabels.furniture[index] || `${CONTENT.imageLabels.default} ${index + 1}` 
                                : selectedProject.id === 3 ? 
                                CONTENT.imageLabels.smartAssistant[index] || `${CONTENT.imageLabels.default} ${index + 1}`
                                : selectedProject.id === 10 ? 
                                CONTENT.imageLabels.securityCameras[index] || `${CONTENT.imageLabels.default} ${index + 1}`
                                : selectedProject.id === 11 ? 
                                CONTENT.imageLabels.smartLighting[index] || `${CONTENT.imageLabels.default} ${index + 1}`
                                : `${CONTENT.imageLabels.default} ${index + 1}`
                              }`}
                              className={`${
                                useObjectContain 
                                  ? 'max-w-full max-h-full object-contain' 
                                  : 'w-full h-48 object-cover'
                              } hover:scale-105 transition-transform duration-300`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(selectedProject.title)}`;
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    {selectedProject.id === 1 && (
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {CONTENT.projectHelperText.furniture}
                      </p>
                    )}
                    {selectedProject.id === 3 && (
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {CONTENT.projectHelperText.smartAssistant}
                      </p>
                    )}
                    {selectedProject.id === 10 && (
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {CONTENT.projectHelperText.securityCameras}
                      </p>
                    )}
                    {selectedProject.id === 11 && (
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {CONTENT.projectHelperText.smartLighting}
                      </p>
                    )}
                  </div>
                ) : (
                  // No images placeholder
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-400 rounded-lg mx-auto mb-4"></div>
                      <p className="text-gray-600">{CONTENT.projectModal.imagePlaceholder}</p>
                    </div>
                  </div>
                )}
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