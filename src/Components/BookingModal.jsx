import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, Clock, User, FileText, Check, ChevronLeft } from 'lucide-react';
import { sendBookingEmail } from '../services/emailService';
import googleCalendarService from '../services/googleCalendarService';
import CalendarStep from './bookingSystem/CalendarStep';
import ServiceSelection from './bookingSystem/ServiceSelection';
import TimeSlotSelection from './bookingSystem/TimeSlotSelection';
import CustomerInfo from './bookingSystem/CustomerInfo';
import BookingConfirmation from './bookingSystem/BookingConfirmation';
import BookingSuccess from './bookingSystem/BookingSuccess';

// Content Management - All text content in one place
const CONTENT = {
  header: {
    title: '⚡ Book Your Service',
    subtitle: 'Schedule your Quantum Handyman appointment',
    closeButtonAriaLabel: 'Close modal'
  },
  steps: [
    { number: 1, title: 'Service', icon: FileText },
    { number: 2, title: 'Date', icon: Calendar },
    { number: 3, title: 'Time', icon: Clock },
    { number: 4, title: 'Details', icon: User },
    { number: 5, title: 'Confirm', icon: Check }
  ],
  navigation: {
    previous: 'Previous',
    stepCounter: 'Step {current} of {total}'
  },
  errors: {
    bookingSubmission: 'There was an error submitting your booking. Please try again.'
  }
};

const BookingModal = ({ isOpen, onClose, initialService = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: initialService,
    date: null,
    timeSlot: null,
    customerInfo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = CONTENT.steps;

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setBookingData({
        service: null,
        date: null,
        timeSlot: null,
        customerInfo: null
      });
      // Prevent body scrolling when modal is open
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleServiceSelect = (service) => {
    setBookingData(prev => ({ ...prev, service }));
    setCurrentStep(2);
  };

  const handleDateSelect = (date) => {
    setBookingData(prev => ({ ...prev, date }));
    setCurrentStep(3);
  };

  const handleTimeSelect = (timeSlot) => {
    setBookingData(prev => ({ ...prev, timeSlot }));
    setCurrentStep(4);
  };

  const handleCustomerInfoSubmit = (customerInfo) => {
    setBookingData(prev => ({ ...prev, customerInfo }));
    setCurrentStep(5);
  };

  const handleBookingConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Generate booking reference ONCE here
      const bookingRef = `QH-${Date.now().toString().slice(-6)}`;
      
      // Try to create booking in Google Calendar and Sheets
      let calendarResult = null;
      
      try {
        calendarResult = await googleCalendarService.createBooking(bookingData);
        console.log('Calendar booking created:', calendarResult);
      } catch (calendarError) {
        console.warn('Google Calendar booking failed, will proceed with email only:', calendarError);
        // Don't fail the entire booking if calendar fails
      }
      
      // Always send confirmation email (include event ID if available AND booking ref)
      const emailData = {
        ...bookingData,
        eventId: calendarResult?.eventId || null,
        bookingRef: bookingRef  // Pass the pre-generated reference
      };
      
      await sendBookingEmail(emailData);
      
      // Store the booking reference in bookingData for the success screen
      setBookingData(prev => ({
        ...prev,
        bookingRef: bookingRef
      }));
      
      // If calendar failed, notify user but still proceed
      if (!calendarResult?.success) {
        console.warn('Booking submitted via email only. Calendar sync failed - will be added manually.');
      }
      
      setCurrentStep(6); // Success step
    } catch (error) {
      console.error('Booking submission error:', error);
      
      // Fallback: Try email-only if everything fails
      try {
        await sendBookingEmail(bookingData);
        alert('Booking submitted via email. Our team will confirm your appointment shortly.');
        setCurrentStep(6);
      } catch (emailError) {
        console.error('Email also failed:', emailError);
        alert(CONTENT.errors.bookingSubmission);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection onServiceSelect={handleServiceSelect} selectedService={bookingData.service} />;
      case 2:
        return <CalendarStep onDateSelect={handleDateSelect} selectedDate={bookingData.date} service={bookingData.service} />;
      case 3:
        return <TimeSlotSelection onTimeSelect={handleTimeSelect} selectedDate={bookingData.date} selectedTime={bookingData.timeSlot} service={bookingData.service} />;
      case 4:
        return <CustomerInfo onSubmit={handleCustomerInfoSubmit} initialData={bookingData.customerInfo} service={bookingData.service} />;
      case 5:
        return <BookingConfirmation bookingData={bookingData} onConfirm={handleBookingConfirm} isSubmitting={isSubmitting} />;
      case 6:
        return <BookingSuccess bookingData={bookingData} onClose={onClose} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  // Create portal to render modal at document body level
  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="flex min-h-screen items-center justify-center p-4"
        onWheel={(e) => e.stopPropagation()}
      >
        <div 
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-3 rounded-t-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold mb-2">{CONTENT.header.title}</h2>
                <p className="text-blue-100">{CONTENT.header.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={CONTENT.header.closeButtonAriaLabel}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Steps - Only show for steps 1-5 */}
            {currentStep <= 5 && (
              <div className="flex justify-between items-center">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  
                  return (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all
                          ${isActive ? 'bg-white text-blue-600 scale-110' : 
                            isCompleted ? 'bg-green-400 text-white' : 
                            'bg-white/30 text-white/70'}
                        `}>
                          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                          {step.title}
                        </span>
                      </div>
                      {step.number < steps.length && (
                        <div className={`h-1 flex-1 mx-2 rounded ${
                          currentStep > step.number ? 'bg-green-400' : 'bg-white/30'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Footer with navigation (only for steps 2-5) */}
          {currentStep >= 2 && currentStep <= 5 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={goToPreviousStep}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {CONTENT.navigation.previous}
                </button>
                
                <div className="text-sm text-gray-500">
                  {CONTENT.navigation.stepCounter.replace('{current}', currentStep).replace('{total}', steps.length)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingModal;
