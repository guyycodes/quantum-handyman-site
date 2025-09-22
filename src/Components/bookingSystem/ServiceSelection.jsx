import React from 'react';
import { Calculator, Clock, Wrench, Star, Zap } from 'lucide-react';

// Content Management - All text content in one place
const CONTENT = {
  title: 'Choose Your Service Package',
  subtitle: '💡 Pro Tip: Not sure what to choose? Start with a Free Estimate, we\'ll tailor for your needs!',
  popularBadge: 'MOST POPULAR',
  proTip: {
    label: 'Select the service that best fits your needs.',
    text: 'All packages include our satisfaction guarantee.'
  },
  services: [
    {
      id: 'estimate',
      name: 'Free Estimate',
      price: 'Free',
      duration: 1,
      icon: Calculator,
      color: 'bg-green-500',
      description: 'Get a free consultation and estimate for your project',
      features: ['No obligation', 'Professional assessment', 'Written quote']
    },
    {
      id: 'package195',
      name: 'Essential Package',
      price: '$195',
      duration: 2,
      icon: Wrench,
      color: 'bg-blue-500',
      description: '3 small jobs completed in up to 2 hours total',
      features: ['Perfect for quick fixes', 'Multiple small tasks', 'Same day completion']
    },
    {
      id: 'package295',
      name: 'Standard Package',
      price: '$295',
      duration: 3,
      icon: Star,
      color: 'bg-purple-500',
      description: '3 medium jobs completed in up to 3 hours total',
      features: ['Most popular choice', 'Mix of tasks', 'Comprehensive service']
    },
    {
      id: 'package395',
      name: 'Premium Package',
      price: '$395',
      duration: 4,
      icon: Zap,
      color: 'bg-orange-500',
      description: '3 larger jobs completed in up to 4 hours total',
      features: ['Complex projects', 'Extended time', 'Priority scheduling']
    },
    {
      id: 'custom',
      name: 'Custom Project',
      price: 'Quote',
      duration: 2,
      icon: Clock,
      color: 'bg-gray-600',
      description: 'Custom project with detailed estimate',
      features: ['Tailored solution', 'Flexible timing', 'Detailed proposal']
    }
  ]
};

const ServiceSelection = ({ onServiceSelect, selectedService }) => {
  const services = CONTENT.services;

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{CONTENT.title}</h3>
      <p className="text-gray-600 mb-4">{CONTENT.subtitle}</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService?.id === service.id;
          
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
              {/* Popular badge for Standard Package */}
              {service.id === 'package295' && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-gradient-to-r from-blue-600 to-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {CONTENT.popularBadge}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4 mb-0">
                <div className={`${service.color} p-1 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                    <span className="text-sm text-gray-500">/ {service.duration}hr{service.duration > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-2 text-sm">{service.description}</p>

              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

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
