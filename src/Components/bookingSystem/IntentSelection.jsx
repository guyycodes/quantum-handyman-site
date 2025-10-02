import React from 'react';
import { Wrench, Calculator, Globe, ArrowRight } from 'lucide-react';

const IntentSelection = ({ onIntentSelect }) => {
  const intents = [
    {
      id: 'handyman',
      title: 'Book Handyman Service',
      subtitle: 'Home repairs, smart home setup, or property maintenance',
      icon: Wrench,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      category: 'property'
    },
    {
      id: 'estimate',
      title: 'Get a Free Estimate',
      subtitle: 'Upload photos for a quote or instant AI assessment',
      icon: Calculator,
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      category: 'estimates'
    },
    {
      id: 'tech',
      title: 'Book Web Dev/Digital Service',
      subtitle: 'Website development, online presence, or content creation',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      category: 'tech'
    }
  ];

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          What would you like to do today?
        </h3>
        <p className="text-gray-600">
          Choose the option that best fits your needs
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {intents.map((intent) => {
          const Icon = intent.icon;
          return (
            <button
              key={intent.id}
              onClick={() => onIntentSelect(intent)}
              className="w-full group relative overflow-hidden rounded-xl border-2 border-gray-200 
                         hover:border-gray-300 transition-all duration-300 hover:shadow-lg 
                         hover:scale-[1.02] bg-white"
            >
              <div className="flex items-center p-6 gap-5">
                {/* Icon */}
                <div className={`${intent.iconBg} p-4 rounded-xl group-hover:scale-110 
                                transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${intent.iconColor}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    {intent.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {intent.subtitle}
                  </p>
                </div>
                
                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 
                                      group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              {/* Hover gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${intent.color} opacity-0 
                              group-hover:opacity-5 transition-opacity duration-300`} />
            </button>
          );
        })}
      </div>

      {/* Help text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Not sure? Start with{' '}
          <button
            onClick={() => onIntentSelect({ id: 'estimate', category: 'estimates' })}
            className="text-green-600 font-medium hover:underline"
          >
            Get a Free Estimate
          </button>
          {' '}to discuss your project
        </p>
      </div>
    </div>
  );
};

export default IntentSelection;
