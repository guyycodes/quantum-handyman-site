import React, { useState } from 'react';
import { Calculator, Clock, Wrench, Star, Zap, Tv, Wifi, Globe, Camera, Home, ChevronDown } from 'lucide-react';

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
      duration: 'ai', // -2 for blank
      icon: Calculator,
      color: 'bg-green-500',
      category: 'estimates',
      hot: false,
      popular: true,
      description: 'Upload project photos & we\'ll provide a free estimate OR use AI for an instant assessment.',
      features: ['No obligation Free Professional Estimate', 'AI assessment - (Free w/promo code)', 'Written quote w/range & Project Breakdown & Roadmap']
    },
    {
      id: 'consultation',
      name: 'Consultation',
      price: 'Free',
      materials: false,
      duration: -2, // -1 for infinity
      icon: Clock,
      color: 'bg-gray-600',
      category: 'estimates',
      hot: false,
      popular: false,
      description: 'Project review & discovery',
      features: ['30 min consultation', 'Project proposal', 'High level roadmap']
    },
    {
      id: 'basic-home',
      name: 'Basic Home Tasks',
      price: '$95',
      materials: false,
      duration: 1,
      icon: Home,
      color: 'bg-teal-500',
      category: 'property',
      hot: true,
      popular: false,
      description: 'Basic home tasks - $95 (trip fee + first hour)',
      features: [
        'Basic tasks ONLY: curtains, furniture assembly, Filter Replacements, etc.',
        'First hour: $95 (includes trip fee + $35/hr)',
        'Additional hours: $35/hr'
      ]
    },
    {
      id: 'package195',
      name: 'Turnover Package',
      price: '$195',
      materials: true,
      duration: 2,
      icon: Wrench,
      color: 'bg-blue-500',
      category: 'property',
      hot: false,
      popular: false,
      description: '3 small small jobs completed in up to ~2.5 hours',
      features: ['Perfect for quick fixes', 'Doors, Locks, Hinges, etc.', 'Same day completion']
    },
    {
      id: 'package295',
      name: 'Make-Ready Package',
      price: '$295',
      materials: true,
      duration: 3,
      icon: Star,
      color: 'bg-purple-500',
      category: 'property',
      hot: false,
      popular: true,
      description: '3 moderate-complexity jobs completed in up to ~3.5 hours',
      features: ['Mix of moderate-complexity & Simple tasks', 'Drywall, Hinges, Furniture, etc.', 'Comprehensive service']
    },
    {
      id: 'package395',
      name: 'Premium Package',
      price: '$395',
      materials: true,
      duration: 4,
      icon: Zap,
      color: 'bg-orange-500',
      category: 'property',
      hot: false,
      popular: false,
      description: '3 larger jobs completed in up to ~4.5 hours',
      features: ['Complex projects', 'Painting, flooring, etc.', 'Priority scheduling']
    },

    // New Digital/Tech packages
    {
      id: 'stream-pro',
      name: 'Stream Pro + Mount',
      price: '$349-$549',
      materials: false,
      duration: 5,
      icon: Tv,
      color: 'bg-cyan-500',
      category: 'tech',
      hot: false,
      popular: false,
      description: '3-5.5 hours for smart devices (cameras, voice assistants, streaming).',
      features: [
        'TV mount ≤65″ + apps & soundbar',
        'OR up to 5hr 30min for smart devices',
        'Cameras • voice assistants • streaming gear'
      ]
    },
    {
      id: 'turnover-tech',
      name: 'Turnover Tech+',
      price: '$399-$799',
      materials: false,
      duration: 4,
      icon: Wifi,
      color: 'bg-indigo-500',
      category: 'tech',
      hot: false,
      popular: true,
      description: 'Perfect for Airbnb & property managers, up to ~4.5 hours',
      features: ['Keypad entry setup', 'Wi-Fi optimization', 'Guest QR codes & streaming ready', 'Touch-ups']
    },
    {
      id: 'business-bundle',
      name: 'Open-for-Business Bundle',
      price: '$599-$1299',
      materials: false,
      duration: 1,
      icon: Globe,
      color: 'bg-emerald-500',
      category: 'tech',
      hot: false,
      popular: false,
      description: 'Full online business presence: Full pay or 2×installments',
      features: ['Two-page website', 'Google Business Profile', '8 pro photos + booking link', 'Add-ons: AI, hosting, analytics, SEO, Care Plan ($99/mo)']
    },
    {
      id: 'creator-studio',
      name: 'Creator Studio Starter',
      price: '$599-$1,199',
      materials: false,
      duration: 1,
      icon: Camera,
      color: 'bg-pink-500',
      category: 'tech',
      hot: false,
      popular: false,
      description: 'Complete creator setup & optimization',
      features: ['Ring light & backdrop install', 'Social media optimization (Insta, Patreon, etc.)', 'Monetization setup + brand photos', 'Optional add-ons']
    }
  ]
};

const ServiceSelection = ({ onServiceSelect, selectedService }) => {
  const [selectedCategory, setSelectedCategory] = useState('estimates');
  const [expandedCards, setExpandedCards] = useState(new Set());
  
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

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{CONTENT.title}</h3>
      <p className="text-gray-600 mb-4">{CONTENT.subtitle}</p>
      
      {/* Category Filter Buttons */}
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
                    <span className="text-xs text-gray-500">{service.materials ? '/' : ''}{(service.duration >= 1) ? `${service.duration}hrs+` : (service.duration === 0) ? '∞' : service.duration === -2 ? '' : ''}</span>
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
    </div>
  );
};

export default ServiceSelection;