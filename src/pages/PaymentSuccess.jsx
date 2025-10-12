import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, FileText, Home, Mail } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentType, setPaymentType] = useState('unknown');
  
  useEffect(() => {
    // Get session ID from URL (Stripe adds this)
    const sessionId = searchParams.get('session_id');
    
    // Check if we're in a popup window
    const isPopup = window.opener !== null;
    
    // Check session storage for payment context
    const pendingAIEstimate = sessionStorage.getItem('pendingAIEstimate');
    const pendingBookingDeposit = sessionStorage.getItem('pendingBookingDeposit');
    const pendingJobPayment = sessionStorage.getItem('pendingJobPayment');
    
    let paymentData = null;
    
    if (pendingAIEstimate) {
      setPaymentType('ai_estimate');
      paymentData = JSON.parse(pendingAIEstimate);
      setPaymentDetails(paymentData);
      
      // Only clear session storage if not in popup (popup keeps modal alive)
      if (!isPopup) {
        sessionStorage.removeItem('pendingAIEstimate');
      }
      
    } else if (pendingBookingDeposit) {
      setPaymentType('booking_deposit');
      paymentData = JSON.parse(pendingBookingDeposit);
      setPaymentDetails(paymentData);
      
      if (!isPopup) {
        sessionStorage.removeItem('pendingBookingDeposit');
      }
      
    } else if (pendingJobPayment) {
      setPaymentType('job_payment');
      paymentData = JSON.parse(pendingJobPayment);
      setPaymentDetails(paymentData);
      
      if (!isPopup) {
        sessionStorage.removeItem('pendingJobPayment');
      }
    }
    
    // If we're in a popup, send success message to parent window
    if (isPopup && window.opener) {
      // Send success message to parent
      window.opener.postMessage({
        type: 'payment-success',
        payload: {
          sessionId,
          paymentType,
          paymentDetails: paymentData
        }
      }, window.location.origin);
      
      // Auto-close popup after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);
    } else {
      // Not in popup - handle redirect flow
      if (paymentType === 'ai_estimate') {
        // Redirect to services page after 5 seconds
        setTimeout(() => {
          navigate('/services?estimate=success');
        }, 5000);
      }
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [searchParams, navigate]);
  
  const getSuccessMessage = () => {
    switch (paymentType) {
      case 'ai_estimate':
        return {
          title: '🎉 Payment Successful!',
          subtitle: 'Your AI estimate is being generated...',
          description: 'We\'re analyzing your project details and will have your estimate ready in just a moment.',
          icon: '🤖',
          nextSteps: [
            'AI is processing your project images and description',
            'Detailed cost breakdown being calculated',
            'You\'ll receive an email with the full estimate',
            'Redirecting you to your estimate in 5 seconds...'
          ]
        };
        
      case 'booking_deposit':
        return {
          title: '✅ Booking Confirmed!',
          subtitle: 'Your $25 deposit has been received',
          description: 'Your service appointment is now secured. We\'ll see you on the scheduled date!',
          icon: '📅',
          nextSteps: [
            'Confirmation email sent to your inbox',
            'Calendar invite will arrive shortly',
            'We\'ll call 24 hours before your appointment',
            'Deposit will be applied to your final bill'
          ]
        };
        
      case 'job_payment':
        return {
          title: '💰 Payment Complete!',
          subtitle: 'Thank you for your payment',
          description: 'Your service invoice has been paid in full. Thank you for choosing Quantum Handyman!',
          icon: '🏡',
          nextSteps: [
            'Payment receipt sent to your email',
            'Service warranty information included',
            'Leave us a review to help others',
            'Contact us anytime for future services'
          ]
        };
        
      default:
        return {
          title: 'Payment Successful!',
          subtitle: 'Your transaction has been completed',
          description: 'Thank you for your payment.',
          icon: '✅',
          nextSteps: [
            'Confirmation email has been sent',
            'You can now close this page'
          ]
        };
    }
  };
  
  const message = getSuccessMessage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{message.title}</h1>
              <p className="text-lg opacity-95">{message.subtitle}</p>
            </div>
            
            {/* Body */}
            <div className="p-8">
              {/* Main Message */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{message.icon}</div>
                <p className="text-gray-600 text-lg">{message.description}</p>
              </div>
              
              {/* Next Steps */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600" />
                  What Happens Next:
                </h3>
                <ul className="space-y-3">
                  {message.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-green-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Payment Details */}
              {paymentDetails && (
                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Transaction Details:
                  </h3>
                  <div className="space-y-2 text-sm">
                    {paymentDetails.customerInfo?.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{paymentDetails.customerInfo.name}</span>
                      </div>
                    )}
                    {paymentDetails.customerInfo?.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{paymentDetails.customerInfo.email}</span>
                      </div>
                    )}
                    {paymentDetails.bookingRef && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium font-mono">{paymentDetails.bookingRef}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform transition-all hover:scale-[1.02]"
                >
                  <Home className="w-5 h-5" />
                  Return Home
                </Link>
                
                {paymentType === 'job_payment' && (
                  <Link
                    to="/portal"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Back to Portal
                  </Link>
                )}
                
                {paymentType === 'ai_estimate' && (
                  <Link
                    to="/services"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    View Services
                  </Link>
                )}
              </div>
              
              {/* Support */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need help? Contact our support team:
                </p>
                <a 
                  href="mailto:support@quantumhandyman.com" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Mail className="w-4 h-4" />
                  support@quantumhandyman.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Auto-close notice for popup mode */}
          {window.opener && (
            <div className="mt-6 text-center text-gray-600">
              <p className="animate-pulse">
                ⏳ This window will close automatically...
              </p>
            </div>
          )}
          
          {/* Auto-redirect notice for AI estimates (non-popup mode) */}
          {!window.opener && paymentType === 'ai_estimate' && (
            <div className="mt-6 text-center text-gray-600">
              <p className="animate-pulse">
                ⏳ Redirecting to your estimate in 5 seconds...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
