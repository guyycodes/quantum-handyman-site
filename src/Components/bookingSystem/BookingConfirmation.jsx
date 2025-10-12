import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, FileText, DollarSign, CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import useStripe from '../../hooks/useStripe';

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
        address: 'Address',
        estimateRef: 'Estimate Reference'
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
  deposit: {
    title: 'Booking Deposit Required',
    amount: '$25',
    description: 'A non-refundable deposit is required to secure your booking. This amount will be applied to your final bill.',
    benefits: [
      'Secures your time slot',
      'Applied to final bill',
      'Fast & secure payment'
    ],
    popupBlocked: {
      title: 'Payment Window Blocked',
      message: 'Please enable popups for this site to complete payment.',
      instructions: [
        'Click the popup blocker icon in your address bar',
        'Select "Always allow popups from this site"',
        'Click the button below to try again'
      ],
      button: 'Try Payment Again'
    }
  },
  buttons: {
    confirm: 'Pay $25 Deposit & Confirm',
    processing: 'Processing Payment...',
    processingBooking: 'Creating Booking...'
  },
  footer: {
    text: 'By confirming, you agree to our terms of service and privacy policy'
  }
};

const BookingConfirmation = ({ bookingData, onConfirm, isSubmitting, onPaymentSuccess, onPaymentCancel }) => {
  const { service, date, timeSlot, customerInfo, isUrgent } = bookingData;
  const { createBookingDepositPayment, openStripeCheckout, isStripeConfigured } = useStripe();
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const popupRef = useRef(null);
  
  // Cleanup popup on unmount
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);
  
  // Parse date properly to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  const formattedDate = localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const handlePaymentAndConfirm = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setPopupBlocked(false);
    
    try {
      // Generate a temporary booking reference for the payment
      const tempBookingRef = `QH-${new Date().toISOString().slice(2,10).replace(/-/g, '')}-TEMP`;
      
      // Create payment session for deposit
      const paymentResult = await createBookingDepositPayment({
        bookingRef: tempBookingRef,
        customerName: customerInfo.name,
        email: customerInfo.email,
        service: service.name,
        date: formattedDate,
        time: timeSlot.display
      });
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to create payment session');
      }
      
      // Save checkout URL for retry if popup blocked
      setCheckoutUrl(paymentResult.url);
      
      // Open Stripe checkout in popup
      const checkoutResult = openStripeCheckout(
        paymentResult.url,
        (result) => {
          // Payment complete callback
          setIsProcessingPayment(false);
          setPopupBlocked(false);
          setCheckoutUrl(null);
          
          if (result.success) {
            console.log('💰 Payment successful! Creating booking...');
            // Payment successful - now create the actual booking
            onConfirm(true); // Pass true to indicate deposit was paid
          } else if (result.cancelled) {
            console.log('❌ Payment cancelled by user');
            setPaymentError('Payment was cancelled. Please try again.');
          } else if (result.closed) {
            setPaymentError('Payment window was closed. Please try again.');
          }
        },
        (blockedInfo) => {
          // Popup blocked callback
          setIsProcessingPayment(false);
          setPopupBlocked(true);
          setPaymentError(null);
        }
      );
      
      // Store popup reference if successful
      if (checkoutResult) {
        popupRef.current = checkoutResult.popup;
      }
      
    } catch (error) {
      setIsProcessingPayment(false);
      setPaymentError(error.message || 'Payment failed. Please try again.');
    }
  };
  
  const handleRetryPayment = () => {
    if (checkoutUrl) {
      setPopupBlocked(false);
      setPaymentError(null);
      setIsProcessingPayment(true);
      
      const checkoutResult = openStripeCheckout(
        checkoutUrl,
        (result) => {
          setIsProcessingPayment(false);
          setPopupBlocked(false);
          setCheckoutUrl(null);
          
          if (result.success) {
            onConfirm(true);
          } else if (result.cancelled) {
            setPaymentError('Payment was cancelled. Please try again.');
          } else if (result.closed) {
            setPaymentError('Payment window was closed. Please try again.');
          }
        },
        (blockedInfo) => {
          setIsProcessingPayment(false);
          setPopupBlocked(true);
        }
      );
      
      if (checkoutResult) {
        popupRef.current = checkoutResult.popup;
      }
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-600" />
        {CONTENT.title}
        {isUrgent && (
          <span className="ml-auto bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            🚨 URGENT
          </span>
        )}
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
            <div className="text-right">
              <span className="font-bold text-blue-600 text-xl">{service.price}</span>
              {isUrgent && (
                <div className="text-sm text-red-600 font-semibold mt-1">
                  + $35 Urgent Service Premium
                </div>
              )}
            </div>
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
          {customerInfo.estimateRef && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-gray-600 text-sm">{CONTENT.sections.customer.labels.estimateRef}</span>
                <p className="font-medium text-blue-600">{customerInfo.estimateRef}</p>
              </div>
            </div>
          )}
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

      {/* Deposit Information */}
      <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-6">
        <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {CONTENT.deposit.title}
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{CONTENT.deposit.description}</span>
            <span className="text-3xl font-bold text-green-600">{CONTENT.deposit.amount}</span>
          </div>
          <div className="border-t border-green-200 pt-3">
            <ul className="space-y-2 text-sm text-green-800">
              {CONTENT.deposit.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Popup Blocked Alert */}
      {popupBlocked && (
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6 mb-6">
          <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {CONTENT.deposit.popupBlocked.title}
          </h4>
          <p className="text-yellow-800 mb-3">{CONTENT.deposit.popupBlocked.message}</p>
          <ul className="space-y-2 text-sm text-yellow-700 mb-4">
            {CONTENT.deposit.popupBlocked.instructions.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-600">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleRetryPayment}
            className="w-full py-3 px-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {CONTENT.deposit.popupBlocked.button}
          </button>
        </div>
      )}
      
      {/* Payment Error */}
      {paymentError && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{paymentError}</p>
          </div>
        </div>
      )}

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

      {/* Confirm Button - Only show if not popup blocked */}
      {!popupBlocked && (
        <button
          onClick={handlePaymentAndConfirm}
          disabled={isSubmitting || isProcessingPayment}
          className={`
            w-full py-4 px-6 font-semibold rounded-lg shadow-lg transform transition-all
            ${(isSubmitting || isProcessingPayment)
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl hover:scale-[1.02]'
            }
          `}
        >
          {isProcessingPayment ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {CONTENT.buttons.processing}
            </span>
          ) : isSubmitting ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {CONTENT.buttons.processingBooking}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              {CONTENT.buttons.confirm}
            </span>
          )}
        </button>
      )}

      <p className="text-center text-sm text-gray-500 mt-4">
        {CONTENT.footer.text}
      </p>
    </div>
  );
};

export default BookingConfirmation;