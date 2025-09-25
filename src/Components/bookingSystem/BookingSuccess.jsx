import React from 'react';
import { CheckCircle, Calendar, Clock, Mail, Phone, Home, Printer, Download } from 'lucide-react';
import { generateBookingRef } from '../../utils/uniqueIdGenerator';

// Content Management - All text content in one place
const CONTENT = {
  success: {
    title: 'Booking Confirmed!',
    subtitle: 'Your service has been successfully queued',
    referenceLabel: 'Booking Reference',
    referenceTip: 'Please save this reference for your records.',
    referenceTip2: 'CHECK YOUR EMAIL SPAM FOLDER FOR A CONFIRMATION.'
  },
  details: {
    title: 'Appointment Details',
    dateFormat: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  },
  nextSteps: {
    title: 'What Happens Next?',
    steps: [
      {
        title: 'Email Confirmation',
        description: 'You\'ll receive a detailed confirmation email shortly'
      },
      {
        title: 'Reminder Call',
        description: 'We\'ll call you 24 hours before your appointment'
      },
      {
        title: 'Service Day',
        description: 'Our technician will arrive within the scheduled time window'
      }
    ]
  },
  contact: {
    needHelp: 'Need to make changes or have questions?',
    phone: '(555) 123-4567',
    email: 'support@quantumhandyman.com',
    or: 'or'
  },
  buttons: {
    addToCalendar: 'Add to Calendar',
    printDetails: 'Print Details',
    done: 'Done'
  },
  footer: {
    thankYou: 'Thank you for choosing Quantum Handyman!'
  },
  calendar: {
    eventTitle: 'Quantum Handyman - ',
    eventDetails: (data) => `Service: ${data.service.name}
Address: ${data.customerInfo.address}
Phone: ${data.customerInfo.phone}

Project Description:
${data.customerInfo.description}

Booking Reference: ${data.bookingRef}`
  }
};

const BookingSuccess = ({ bookingData, onClose }) => {
  const { service, date, timeSlot, customerInfo, bookingRef } = bookingData;
  
  // Parse date properly to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  const formattedDate = localDate.toLocaleDateString('en-US', CONTENT.details.dateFormat);

  // Use the booking reference from bookingData (generated in BookingModal)
  const displayBookingRef = bookingRef || generateBookingRef();

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    // Create calendar event details with proper date parsing
    const [year, month, day] = date.split('-').map(Number);
    const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
    const [endHour, endMinute] = timeSlot.end.split(':').map(Number);
    
    const startDate = new Date(year, month - 1, day, startHour, startMinute);
    const endDate = new Date(year, month - 1, day, endHour, endMinute);
    
    // Format dates for Google Calendar
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    
    const details = encodeURIComponent(CONTENT.calendar.eventDetails({
      ...bookingData,
      bookingRef: displayBookingRef
    }).trim());
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONTENT.calendar.eventTitle + service.name)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${encodeURIComponent(customerInfo.address)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="text-center">
      {/* Success Animation */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{CONTENT.success.title}</h3>
        <p className="text-lg text-gray-600">{CONTENT.success.subtitle}</p>
      </div>

      {/* Booking Reference */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6 border border-blue-200">
        <p className="text-sm text-gray-600 mb-2">{CONTENT.success.referenceLabel}</p>
        <p className="text-2xl font-bold text-blue-600">{displayBookingRef}</p>
        <p className="text-xs text-gray-500 mt-2">{CONTENT.success.referenceTip}</p>
        <p className="text-sm text-green-500 mt-2">{CONTENT.success.referenceTip2}</p>
      </div>

      {/* Quick Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-left">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{CONTENT.details.title}</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">{timeSlot.display}</span>
          </div>
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">{customerInfo.address}</span>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">{CONTENT.nextSteps.title}</h4>
        <div className="space-y-3 text-left">
          {CONTENT.nextSteps.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* <button
          onClick={handleAddToCalendar}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calendar className="w-5 h-5" />
          {CONTENT.buttons.addToCalendar}
        </button> */}
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Printer className="w-5 h-5" />
          {CONTENT.buttons.printDetails}
        </button>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <p className="text-sm text-gray-600 mb-3">{CONTENT.contact.needHelp}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`tel:${CONTENT.contact.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Phone className="w-4 h-4" />
            {CONTENT.contact.phone}
          </a>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <a
            href={`mailto:${CONTENT.contact.email}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Mail className="w-4 h-4" />
            {CONTENT.contact.email}
          </a>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02]"
      >
        {CONTENT.buttons.done}
      </button>

      <p className="text-sm text-gray-500 mt-4">
        {CONTENT.footer.thankYou}
      </p>
    </div>
  );
};

export default BookingSuccess;