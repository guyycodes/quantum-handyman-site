import React from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, FileText, DollarSign, CheckCircle } from 'lucide-react';

// Content Management - All text content in one place
const CONTENT = {
  title: 'Review and Confirm',
  intro: {
    text: 'Please review your booking details below. Once confirmed, you\'ll receive an email confirmation with all the details.'
  },
  sections: {
    service: {
      title: 'Service Details',
      labels: {
        serviceType: 'Service Type:',
        price: 'Price:',
        duration: 'Duration:'
      },
      hourSuffix: (hours) => hours > 1 ? 'hours' : 'hour'
    },
    schedule: {
      title: 'Schedule',
      labels: {
        date: 'Date:',
        time: 'Time:'
      }
    },
    customer: {
      title: 'Customer Information',
      labels: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address'
      }
    },
    project: {
      title: 'Project Description',
      photoCount: (count) => `📷 ${count} photo(s) attached`
    }
  },
  terms: {
    title: 'Terms & Conditions',
    items: [
      'Service is subject to availability and weather conditions',
      '24-hour cancellation policy applies',
      'Final price may vary based on actual work required',
      'All work is guaranteed and we are fully licensed & insured'
    ]
  },
  buttons: {
    confirm: 'Confirm Booking',
    processing: 'Processing...'
  },
  footer: {
    text: 'By confirming, you agree to our terms of service and privacy policy'
  }
};

const BookingConfirmation = ({ bookingData, onConfirm, isSubmitting }) => {
  const { service, date, timeSlot, customerInfo } = bookingData;
  
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-600" />
        {CONTENT.title}
      </h3>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <p className="text-gray-600 mb-4">
          {CONTENT.intro.text}
        </p>
      </div>

      {/* Service Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          {CONTENT.sections.service.title}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-gray-600">{CONTENT.sections.service.labels.serviceType}</span>
            <span className="font-medium text-gray-900 text-right">{service.name}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-600">{CONTENT.sections.service.labels.price}</span>
            <span className="font-bold text-blue-600 text-xl">{service.price}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-600">{CONTENT.sections.service.labels.duration}</span>
            <span className="font-medium text-gray-900">
              {service.duration} {CONTENT.sections.service.hourSuffix(service.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Schedule Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {CONTENT.sections.schedule.title}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-gray-600">{CONTENT.sections.schedule.labels.date}</span>
            <span className="font-medium text-gray-900 text-right">{formattedDate}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-600">{CONTENT.sections.schedule.labels.time}</span>
            <span className="font-medium text-gray-900">{timeSlot.display}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          {CONTENT.sections.customer.title}
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <span className="text-gray-600 text-sm">{CONTENT.sections.customer.labels.name}</span>
              <p className="font-medium text-gray-900">{customerInfo.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <span className="text-gray-600 text-sm">{CONTENT.sections.customer.labels.email}</span>
              <p className="font-medium text-gray-900">{customerInfo.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <span className="text-gray-600 text-sm">{CONTENT.sections.customer.labels.phone}</span>
              <p className="font-medium text-gray-900">{customerInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <span className="text-gray-600 text-sm">{CONTENT.sections.customer.labels.address}</span>
              <p className="font-medium text-gray-900 whitespace-pre-wrap">{customerInfo.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          {CONTENT.sections.project.title}
        </h4>
        <p className="text-gray-700 whitespace-pre-wrap">{customerInfo.description}</p>
        
        {customerInfo.images && customerInfo.images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">{CONTENT.sections.project.photoCount(customerInfo.images.length)}</p>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">{CONTENT.terms.title}</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          {CONTENT.terms.items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={isSubmitting}
        className={`
          w-full py-4 px-6 font-semibold rounded-lg shadow-lg transform transition-all
          ${isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl hover:scale-[1.02]'
          }
        `}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {CONTENT.buttons.processing}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {CONTENT.buttons.confirm}
          </span>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        {CONTENT.footer.text}
      </p>
    </div>
  );
};

export default BookingConfirmation;