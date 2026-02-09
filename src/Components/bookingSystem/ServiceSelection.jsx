import React, { useState, useEffect } from 'react';
import { Calculator, Clock, Wrench, Star, Zap, Tv, Wifi, Globe, Camera, Home, ChevronDown, Code, Sparkles } from 'lucide-react';
import { useWorld } from '../../contexts/WorldContext';

// Content Management - All text content in one place
const CONTENT = {
  title: 'Schedule a Service',
  subtitle: '💡 Pro Tip: Not sure what to choose? Start with a Free Estimate, we\'ll tailor for your needs!',
  popularBadge: 'POPULAR',
  hotBadge: 'HOT',
  categories: {
    all: 'All',
    estimates: 'Estimates/Consultations',
    property: 'Property',
    tech: 'Digital/Tech'
  },
  proTip: {
    label: 'Select the service that best fits your needs.',
    text: 'All packages include our satisfaction guarantee.'
  },
  services: [

    {
      id: 'estimate',
      name: 'Free Estimate',
      price: 'Free',
      materials: false,
      duration: 'ai',
      icon: Calculator,
      color: 'bg-green-500',
      category: 'estimates',
      hot: false,
      popular: true,
      description: 'Upload photos for instant quote OR get AI assessment',
      features: [
        'Professional written estimate',
        'Project breakdown + timeline', 
        'AI assessment free with promo code',
      ]
    },
    {
      id: 'consultation',
      name: 'Project Consultation',
      price: 'Free',
      materials: false,
      duration: 1,
      icon: Clock,
      color: 'bg-gray-600',
      category: 'estimates',
      hot: false,
      popular: false,
      description: '30min expert consultation + custom project roadmap',
      features: [
        'In-person or video consultation',
        'Custom project proposal + timeline',
        'Material recommendations + sourcing',
      ]
    },
    {
      id: 'basic-home',
      name: 'Quick Fix',
      price: '$125',
      materials: true,
      duration: 1,
      icon: Home,
      color: 'bg-teal-500',
      category: 'property',
      hot: false,
      popular: false,
      description: '1 hour service call - perfect for small repairs',
      features: [
        'Trip fee + first hour included',
        'Weather stripping, caulking, filters, small items assembly',
        'Same day completion',
        '📈 Extend: +30min blocks ($35 each)',
      ]
    },
    {
      id: 'punch-list',
      name: 'Punch List Pro',
      price: '$169',
      materials: true,
      duration: 2,
      icon: Wrench,
      color: 'bg-blue-500',
      category: 'property',
      hot: false,
      popular: true,
      description: '2 hour block - tackle your entire to-do list',
      features: [
        'Trip fee + 2 hours included',
        'Furniture assembly, locks, hinges, gutters, doors, roofs, windows, etc.',
        'Multi-task efficiency guarantee', 
        '📈 Extend: +30min blocks ($35 each)',
      ]
    },
    {
      id: 'home-tech',
      name: 'Home Tech Setup',
      price: '$199',
      materials: true,
      duration: 3,
      icon: Wifi,
      color: 'bg-teal-500',
      category: 'property',
      hot: false,
      popular: false,
      description: '2-3 device smart home setup + TV mounting (up to 65")',
      features: [
        'TV mounting + streaming optimization',
        'Smart locks, cameras, or speakers (2-3 devices)',
        'Network setup + device training',
        'Mac/PC/mobile integration',
        '📈 Extra devices (+$49 each) • Home network (+$149)',
      ]
    },
    {
      id: 'website-pro',
      name: 'Website PRO',
      price: '$100/pg',
      materials: false,
      duration: 1, // Fixed: probably meant 2 weeks, not -2
      icon: Globe,
      color: 'bg-blue-500',
      category: 'tech',
      hot: true,
      popular: false,
      description: 'Professional website with SEO (Custom/WordPress/Wix) - $100/page',
      features: [
        '1 page responsive website + SEO',
        'Mobile optimized + contact forms', 
        'Google Business Profile setup',
        '30 day support included',
        '📈 Additional pages: +$100/page (no custom integrations)',
        '🚀 Add-ons: Booking (+$400) • Payments (+$400) • APIs (+$500) • Analytics (+$800) • Zapier Automation (+$450)'
      ]
    },
    {
      id: 'creator-package',
      name: 'Creator Package',
      price: '$299',
      materials: false,
      duration: 1, // 3 days setup
      icon: Camera,
      color: 'bg-pink-500',
      category: 'tech',
      hot: false,
      popular: false,
      description: 'Professional link-in-bio site + social setup for content creators',
      features: [
        'Custom link-in-bio site + domain',
        'Social media integration + branding', 
        'Payment links + tip jar setup',
        '7 day launch support',
        '📈 Add-ons: Content scheduling (+$199) • Fan management portal (+$399)',
        '🚀 Premium: Analytics dashboard (+$299) • Custom subscriber portal (+$499) • Multi-platform automation (+$499)'
      ]
    },
    {
      id: 'maintenance-plan',
      name: 'Care Plan',
      price: '$20/hr',
      materials: false,
      duration: 1, // Ongoing hourly
      icon: Clock,
      color: 'bg-green-500',
      category: 'tech',
      hot: false,
      popular: true,
      description: 'Ongoing website maintenance and support',
      features: [
        '3 hours monthly updates + content',
        'Security monitoring + backups', 
        'Performance optimization + fixes',
        'Priority email/text support',
        '📈 Upgrade: 6 hours/mo (+$99) • 10 hours/mo (+$149)',
        '🚀 Add-ons: Emergency fixes (+$79/hr) • Content creation (+$69/hr) • SEO monitoring (+$49/mo)'
      ]
    },
    // {
    //   id: 'custom-software',
    //   name: 'Custom Software Add-on',
    //   price: '$899',
    //   materials: false,
    //   duration: 0, // 1 week development
    //   icon: Clock,
    //   color: 'bg-green-500',
    //   category: 'tech',
    //   hot: true,
    //   popular: false,
    //   description: 'Advanced custom features for existing business systems',
    //   features: [
    //     'Custom dashboard or admin panel',
    //     'Database integration + automation', 
    //     'API connections + data sync',
    //     '30 day implementation support',
    //     '📈 Add complexity: Multi-user systems (+$599) • Advanced reporting (+$499)',
    //     '🚀 Enterprise: Custom workflows (+$799) • Real-time analytics (+$699) • Multi-platform sync (+$899)'
    //   ]
    // },
    // {
    //   id: 'ai-automation',
    //   name: 'AI & Automation',
    //   price: '$999-$2,999',
    //   materials: false,
    //   duration: -2,
    //   icon: Sparkles,
    //   color: 'bg-orange-500',
    //   category: 'tech',
    //   hot: false,
    //   popular: false,
    //   description: 'AI integration and business automation',
    //   features: ['ChatGPT/Claude integration', 'Custom AI chatbots', 'Sales funnel automation', 'Data analytics dashboards', 'Product telemetry setup']
    // },
  ]
};

const ServiceSelection = ({ onServiceSelect, selectedService, initialCategory = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const { isTechnician } = useWorld();

  // Update category when initialCategory prop changes
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);
  
  // Filter services based on selected category
  const filteredServices = CONTENT.services.filter(service => 
    selectedCategory === 'all' || service.category === selectedCategory
  );

  // Toggle card expansion
  const toggleCardExpansion = (e, serviceId) => {
    e.stopPropagation(); // Prevent card selection when toggling
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  // Determine if we should show category filters
  // Never show filters when coming from intent selection (property, tech, or estimates)
  // Only show if initialCategory is 'all' (direct access without intent selection)
  const showCategoryFilters = initialCategory === 'all';
  
  // Custom titles based on selected category
  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'property':
        return 'Select Your Technician Service';
      case 'tech':
        return 'Select Your Digital Service';
      case 'estimates':
        return 'Choose Your Estimate Option';
      default:
        return CONTENT.title;
    }
  };
  
  // Custom subtitle based on selected category
  const getCategorySubtitle = () => {
    switch (selectedCategory) {
      case 'property':
        return 'Choose from our technician packages or hourly services';
      case 'tech':
        return 'Select a web development or digital service package';
      case 'estimates':
        return CONTENT.subtitle;
      default:
        return CONTENT.subtitle;
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{getCategoryTitle()}</h3>
      <p className="text-gray-600 mb-4">{getCategorySubtitle()}</p>
      
      {/* Category Filter Buttons - Only show if user didn't come from intent selection */}
      {showCategoryFilters && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {CONTENT.categories.all}
          </button>
          <button
            onClick={() => setSelectedCategory('estimates')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'estimates' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {CONTENT.categories.estimates}
          </button>
          <button
            onClick={() => setSelectedCategory('property')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'property' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {CONTENT.categories.property}
          </button>
          <button
            onClick={() => setSelectedCategory('tech')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'tech' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {CONTENT.categories.tech}
          </button>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService?.id === service.id;
          const isExpanded = expandedCards.has(service.id);
          
          return (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                hover:shadow-lg hover:scale-[1.02] hover:border-blue-400
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 bg-white'
                }
              `}
            >
              {/* Dynamic badges based on service properties */}
              {(service.hot || service.popular) && (
                <div className="absolute -top-3 right-4 flex gap-2">
                  {service.hot && (
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {CONTENT.hotBadge}
                    </span>
                  )}
                  {service.popular && (
                    <span className="bg-gradient-to-r from-blue-600 to-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {CONTENT.popularBadge}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-start gap-4 mb-0">
                <div className={`${service.color} p-1 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-md mt-1 font-bold text-gray-900">{service.name === 'Make-Ready Package' ? 'Make-Ready Pkg' : service.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                    <span className="text-xs text-gray-500">{service.materials ? '+mat\'ls' : (service.duration !== -1 && service.duration !== 'ai') ? '' : (service.duration === 'ai') ? 'or 🤖 AI - (Beta)' : '' }</span>
                    <span className="text-xs text-gray-500">{service.materials ? '/' : ''}{(service.duration >= 1) ? `${service.duration}hrs` : (service.duration === 0) ? '∞' : service.duration === -2 ? '' : ''}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-2 text-sm">{service.description}</p>

              {/* Accordion Toggle Button */}
              <div 
                onClick={(e) => toggleCardExpansion(e, service.id)}
                className="flex items-center justify-center py-1 mb-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Collapsible Features List */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="space-y-2 pb-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>{CONTENT.proTip.label}</strong> {CONTENT.proTip.text}
        </p>
      </div>

      {/* Informational Notes */}
          <div className="mt-4 space-y-2">
            {isTechnician && (
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <span className="text-gray-400">ℹ️</span>
                <span>No licensed electrical/plumbing/HVAC. Referrals available.</span>
              </div>
            )}
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-gray-400">💳</span>
              <span>${isTechnician ? '25' : '25'} deposit required to secure appointments.</span>
            </div>
          </div>

    </div>
  );
};

export default ServiceSelection;