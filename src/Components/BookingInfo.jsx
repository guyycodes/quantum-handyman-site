import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const BookingInfo = ({ 
  bookingRef, 
  isVisible, 
  onBookingClick,
  content 
}) => {
  return (
    <section className="py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container-max mx-auto px-6">
        <div 
          ref={bookingRef}
          className={`bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto animate-scale ${isVisible ? 'visible' : ''}`}>
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{content.title}</h3>
            <p className="text-gray-600 text-lg">{content.description}</p>
          </div>
          
          {/* Features Bar */}
          <div className="flex justify-center gap-6 mb-6 py-3 bg-gray-50 rounded-lg">
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="text-sm">{feature.icon}</span>
                <span className="text-xs font-medium text-gray-600">{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* Streamlined Two-column layout */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Booking Steps */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-lg">🎯</span> {content.bookingSteps.title}
              </h4>
              <div className="space-y-2">
                {content.bookingSteps.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-gray-700">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Estimate Steps */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <span className="text-lg">💰</span> {content.estimateSteps.title}
              </h4>
              <div className="space-y-2">
                {content.estimateSteps.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-gray-700">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={onBookingClick}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Calendar className="w-5 h-5" />
              {content.cta.primary}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 mt-3">
              💡 Not sure? Start with a <span className="font-medium">Free Estimate</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingInfo;
