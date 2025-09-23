import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, Clock, User, FileText, Check, ChevronLeft, Calculator, Loader } from 'lucide-react';
import { sendBookingEmail, sendEstimateRequestEmail } from '../services/emailService';
import googleCalendarService from '../services/googleCalendarService';
import { generateAIEstimate } from '../services/aiEstimateService';
import { compressMultipleImages } from '../utils/imageCompression';
import { generateEstimateRef, generateBookingRef } from '../utils/uniqueIdGenerator';
import CalendarStep from './bookingSystem/CalendarStep';
import ServiceSelection from './bookingSystem/ServiceSelection';
import TimeSlotSelection from './bookingSystem/TimeSlotSelection';
import CustomerInfo from './bookingSystem/CustomerInfo';
import BookingConfirmation from './bookingSystem/BookingConfirmation';
import BookingSuccess from './bookingSystem/BookingSuccess';
import EstimateConfirmation from '../components/bookingSystem/EstimateConfirmation';
import EstimateSuccess from '../components/bookingSystem/EstimateSuccess';
import StripePaymentModal from '../components/StripePaymentModal';
import TypewriterDisplay from '../components/TypewriterDisplay';
import ConfirmModal from '../components/ConfirmModal';

// Content Management - All text content in one place
const CONTENT = {
  header: {
    title: '⚡ Book Your Service',
    estimateTitle: '📋 Pick a Package or Generate an Estimate',
    subtitle: 'Schedule your Quantum Handyman appointment',
    estimateSubtitle: '',
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
    customerInfo: null,
    useAIEstimate: false,
    isUrgent: false
  });
  const [isEstimateFlow, setIsEstimateFlow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiProcessingMessage, setAIProcessingMessage] = useState('');
  const [showAIResult, setShowAIResult] = useState(false);
  const [aiResultText, setAIResultText] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const steps = CONTENT.steps;

  const handleClose = () => {
    // If on success page (step 6) or first page, close directly
    if (currentStep === 1) {
      onClose();
    } else {
      // Otherwise show confirmation
      setShowConfirmClose(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    onClose();
  };

  const clearState = (step) => {
    setCurrentStep(step);
    setBookingData({
      service: null,
      date: null,
      timeSlot: null,
      customerInfo: null
    });
    setIsEstimateFlow(false);
    setIsSubmitting(false);
    setShowPaymentModal(false);
    setIsProcessingAI(false);
    setAIProcessingMessage('');
    setShowAIResult(false);
    setAIResultText('');
  }

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      clearState(1);
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
    
    // Check if estimate service is selected
    if (service.id === 'estimate') {
      setIsEstimateFlow(true);
      // Skip directly to customer info for estimates
      setCurrentStep(4);
    } else {
      setIsEstimateFlow(false);
      setCurrentStep(2);
    }
  };

  const handleDateSelect = (date, isUrgent = false) => {
    setBookingData(prev => ({ ...prev, date, isUrgent }));
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

  const handleBookingConfirm = async (useAI = false, hasValidPromo = false, promoCode = '') => {
    // Update booking data with AI preference and promo code
    setBookingData(prev => ({ 
      ...prev, 
      useAIEstimate: useAI,
      promoCode: promoCode,
      hasValidPromo: hasValidPromo 
    }));
    
    // If AI estimate is selected and NO valid promo, show payment modal
    if (isEstimateFlow && useAI && !hasValidPromo) {
      setShowPaymentModal(true);
      return;
    }
    
    // If AI estimate with valid promo, process directly
    if (isEstimateFlow && useAI && hasValidPromo) {
      setIsProcessingAI(true);
      setAIProcessingMessage('Processing your FREE AI estimate...');
      await submitEstimateRequest(true, hasValidPromo, promoCode);
      return;
    }
    
    // Otherwise proceed with regular submission
    await submitEstimateRequest(false);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setShowPaymentModal(false);
    setIsProcessingAI(true);
    setAIProcessingMessage('Payment confirmed. Analyzing your project...');
    
    // Process AI estimate after successful payment
    await submitEstimateRequest(true, false, '');
  };

  const submitEstimateRequest = async (withAI = false, hasValidPromo = false, promoCode = '') => {
    setIsSubmitting(true);
    try {
      if (isEstimateFlow) {
        // Handle estimate request submission
        const estimateRef = generateEstimateRef();
        let aiEstimateResult = {
          success: false,
          error: null,
          jobDescription: null,
          price: null,
        };

        // Process AI estimate if requested
        if (withAI) {
          setAIProcessingMessage('🤖 AI is analyzing your project...');
          
          try {
            const aiResult = await generateAIEstimate({
              customerInfo: bookingData.customerInfo,
              service: bookingData.service
            });
            
              if (aiResult.success) {
                setAIProcessingMessage('✨ Generating detailed estimate...');
                aiEstimateResult = aiResult;
                
                // Prepare the text to display with typewriter effect
                const resultText = `📊 ESTIMATED COST: ${aiResult.price}\n\n` +
                  `⏰ LABOR HOURS: ${aiResult.laborHours || 'TBD'}\n\n` +
                  `📈 COMPLEXITY: ${aiResult.complexity || 'Standard'}\n\n` +
                  `📝 SCOPE OF WORK:\n${aiResult.jobDescription}\n\n` +
                  `${aiResult.notes ? `⚠️ NOTES:\n${aiResult.notes}` : ''}`;
                
                setAIResultText(resultText);
              } else {
                console.error('AI estimate failed:', aiResult.error);
                aiEstimateResult = aiResult;
              }
          } catch (aiError) {
            console.error('AI estimate request failed:', aiError);
            aiEstimateResult = {
              success: false,
              error: aiError.message || 'Failed to generate AI estimate',
              jobDescription: 'AI analysis failed - manual review required',
              price: 'Pending manual estimate',
            };
          }
          
          setAIProcessingMessage('💾 Saving estimate details...');
        }

        // Process images using the compression utility
        let imageDataBase64 = '';
        if (bookingData.customerInfo.images && bookingData.customerInfo.images.length > 0) {
          imageDataBase64 = await compressMultipleImages(bookingData.customerInfo.images, {
            scaleFactor: 0.6,  // 60% of original size
            quality: 0.5,      // 50% JPEG quality
            maxTotalSize: 45000 // Leave buffer for Google Sheets
          });
        }

        const estimateData = {
          ...bookingData,
          estimateRef: estimateRef,
          isAiEstimate: withAI,
          aiEstimateResult,
          imageDataBase64: imageDataBase64, // Add processed base64 image data
          // Add payment information for Google Sheets tracking
          paymentRequired: withAI && !hasValidPromo,
          paymentStatus: withAI ? (hasValidPromo ? 'Waived (Promo)' : 'Completed') : 'N/A',
          promoCode: promoCode || bookingData.promoCode || ''
        };
        
        // Save to Google Sheets BEFORE sending email
        try {
          const sheetResult = await googleCalendarService.saveEstimate(estimateData);
          console.log('Estimate saved to sheets:', sheetResult);
        } catch (sheetError) {
          console.warn('Failed to save estimate to sheets, continuing with email:', sheetError);
          // Don't fail the whole process if sheets fails
        }
        
        // Update message for email sending
        if (withAI) {
          setAIProcessingMessage('📧 Sending your estimate...');
        }
        
        await sendEstimateRequestEmail(estimateData);

        // Store the results in bookingData for the success screen
          setBookingData(prev => ({
            ...prev,
            estimateRef: estimateRef,
            aiEstimateResult: aiEstimateResult
          }));
          
          // If AI was used and successful, show the result with typewriter effect
          if (withAI && aiEstimateResult.success) {
            setIsProcessingAI(false);
            setShowAIResult(true);
          } else {
            setIsProcessingAI(false);
            setAIProcessingMessage('');
            setCurrentStep(6); // Success step
          }
      } else {
        // Handle regular booking submission
        const bookingRef = generateBookingRef();
        
        // Compress images for regular bookings too (if any)
        let imageDataBase64 = '';
        if (bookingData.customerInfo?.images && bookingData.customerInfo.images.length > 0) {
          console.log('Processing images for booking...');
          imageDataBase64 = await compressMultipleImages(bookingData.customerInfo.images, {
            scaleFactor: 0.6,  // 60% of original size
            quality: 0.5,      // 50% JPEG quality
            maxTotalSize: 45000 // Leave buffer for storage
          });
        }
        
        // Add compressed images to booking data
        const bookingDataWithImages = {
          ...bookingData,
          imageDataBase64: imageDataBase64
        };
        
        // Try to create booking in Google Calendar and Sheets
        let calendarResult = null;
        
        try {
          // Include urgent flag in booking data for Google Sheets
          const bookingWithUrgent = {
            ...bookingDataWithImages,
            isUrgent: bookingData.isUrgent || false
          };
          calendarResult = await googleCalendarService.createBooking(bookingWithUrgent);
          console.log('Calendar booking created:', calendarResult);
        } catch (calendarError) {
          console.warn('Google Calendar booking failed, will proceed with email only:', calendarError);
          // Don't fail the entire booking if calendar fails
        }
        
        // Always send confirmation email (include event ID if available AND booking ref)
        const emailData = {
          ...bookingDataWithImages,
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
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      if (isEstimateFlow) {
        // Fallback for estimate - make sure images are compressed
        try {
          let fallbackImageData = '';
          if (bookingData.customerInfo?.images && bookingData.customerInfo.images.length > 0) {
            fallbackImageData = await compressMultipleImages(bookingData.customerInfo.images);
          }
          
          await sendEstimateRequestEmail({
            ...bookingData,
            imageDataBase64: fallbackImageData
          });
          alert('Estimate request submitted. Our team will review and respond shortly.');
          setCurrentStep(6);
        } catch (emailError) {
          console.error('Email also failed:', emailError);
          alert('There was an error submitting your estimate request. Please try again.');
        }
      } else {
        // Fallback for booking - make sure images are compressed
        try {
          let fallbackImageData = '';
          if (bookingData.customerInfo?.images && bookingData.customerInfo.images.length > 0) {
            fallbackImageData = await compressMultipleImages(bookingData.customerInfo.images);
          }
          
          await sendBookingEmail({
            ...bookingData,
            imageDataBase64: fallbackImageData
          });
          alert('Booking submitted via email. Our team will confirm your appointment shortly.');
          setCurrentStep(6);
        } catch (emailError) {
          console.error('Email also failed:', emailError);
          alert(CONTENT.errors.bookingSubmission);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      // If in estimate flow and on customer info, go back to service selection
      if (isEstimateFlow && currentStep === 4) {
        setCurrentStep(1);
        setIsEstimateFlow(false);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleAIResultComplete = () => {
    // After typewriter completes, wait a moment then proceed to success
    setTimeout(() => {
      setShowAIResult(false);
      // setAIResultText('');
      // setAIProcessingMessage('');
      setCurrentStep(6); // Success step
    }, 2000);
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
        if (isEstimateFlow) {
          return <EstimateConfirmation estimateData={bookingData} onConfirm={handleBookingConfirm} isSubmitting={isSubmitting} />;
        } else {
          return <BookingConfirmation bookingData={bookingData} onConfirm={handleBookingConfirm} isSubmitting={isSubmitting} />;
        }
      case 6:
        if (isEstimateFlow) {
          return <EstimateSuccess 
            estimateData={bookingData} 
            onClose={onClose} 
            aiResultText={aiResultText}
            onNewEstimate={() => clearState(1)}
          />;
        } else {
          return <BookingSuccess bookingData={bookingData} onClose={onClose} />;
        }
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
        onClick={handleClose}
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
                <h2 className="text-xl font-bold mb-2">
                  {isEstimateFlow ? CONTENT.header.estimateTitle : CONTENT.header.title}
                </h2>
                <p className="text-blue-100">
                  {isEstimateFlow ? CONTENT.header.estimateSubtitle : CONTENT.header.subtitle}
                </p>
              </div>
              <button
                onClick={handleClose}
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
                  // Skip date and time steps for estimate flow
                  if (isEstimateFlow && (step.number === 2 || step.number === 3)) {
                    return null;
                  }
                  
                  // Adjust step numbers for estimate flow
                  let adjustedStepNumber = step.number;
                  if (isEstimateFlow && step.number > 3) {
                    adjustedStepNumber = step.number - 2;
                  }
                  
                  const Icon = step.icon;
                  const isActive = isEstimateFlow 
                    ? (currentStep === 1 && step.number === 1) || 
                      (currentStep === 4 && step.number === 4) ||
                      (currentStep === 5 && step.number === 5)
                    : currentStep === step.number;
                  const isCompleted = isEstimateFlow
                    ? (currentStep > 1 && step.number === 1) ||
                      (currentStep > 4 && step.number === 4) ||
                      (currentStep > 5 && step.number === 5)
                    : currentStep > step.number;
                  
                  if (isEstimateFlow && (step.number === 2 || step.number === 3)) {
                    return null;
                  }
                  
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
            {isProcessingAI ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                  <Loader className="w-10 h-10 text-purple-600 animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Processing AI Estimate</h3>
                <p className="text-lg text-gray-600 mb-6">{aiProcessingMessage}</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      Our AI is analyzing your project details and images to provide you with an accurate estimate...
                    </p>
                  </div>
                </div>
              </div>
            ) : showAIResult ? (
              <div className="py-6">
                <TypewriterDisplay 
                  text={aiResultText}
                  speed={15}
                  title="AI Estimate Analysis"
                  onComplete={handleAIResultComplete}
                />
              </div>
            ) : (
              renderStepContent()
            )}
          </div>

          {/* Footer with navigation (only for steps 2-5, not during AI processing or result display) */}
          {currentStep >= 2 && currentStep <= 5 && !isProcessingAI && !showAIResult && (
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
                  {isEstimateFlow 
                    ? CONTENT.navigation.stepCounter.replace('{current}', currentStep === 1 ? 1 : currentStep === 4 ? 2 : 3).replace('{total}', 3)
                    : CONTENT.navigation.stepCounter.replace('{current}', currentStep).replace('{total}', steps.length)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        customerInfo={bookingData.customerInfo}
      />
      
      {/* Confirm Close Modal */}
      <ConfirmModal
        isOpen={showConfirmClose}
        onConfirm={handleConfirmClose}
        onCancel={() => setShowConfirmClose(false)}
        title="Close?"
        message="Your progress will be lost if you close. Are you sure you want to exit?"

      />
    </div>,
    document.body
  );
};

export default BookingModal;
