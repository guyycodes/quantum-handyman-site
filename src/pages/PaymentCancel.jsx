import React, { useEffect, useState } from 'react';
import { XCircle, AlertCircle, ArrowLeft, RefreshCw, Mail, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentType, setPaymentType] = useState('unknown');
  
  useEffect(() => {
    // Check if we're in a popup window
    const isPopup = window.opener !== null;
    
    // Check session storage for payment context to understand what was cancelled
    const pendingAIEstimate = sessionStorage.getItem('pendingAIEstimate');
    const pendingBookingDeposit = sessionStorage.getItem('pendingBookingDeposit');
    const pendingJobPayment = sessionStorage.getItem('pendingJobPayment');
    
    let paymentData = null;
    
    if (pendingAIEstimate) {
      setPaymentType('ai_estimate');
      paymentData = JSON.parse(pendingAIEstimate);
      setPaymentDetails(paymentData);
      // Don't clear session storage - they might want to retry
      
    } else if (pendingBookingDeposit) {
      setPaymentType('booking_deposit');
      paymentData = JSON.parse(pendingBookingDeposit);
      setPaymentDetails(paymentData);
      
    } else if (pendingJobPayment) {
      setPaymentType('job_payment');
      paymentData = JSON.parse(pendingJobPayment);
      setPaymentDetails(paymentData);
    }
    
    // If we're in a popup, send cancel message to parent window
    if (isPopup && window.opener) {
      // Send cancel message to parent
      window.opener.postMessage({
        type: 'payment-cancelled',
        payload: {
          paymentType,
          paymentDetails: paymentData
        }
      }, window.location.origin);
      
      // Auto-close popup after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);
  
  const handleRetry = () => {
    // Navigate back to the appropriate page based on payment type
    switch (paymentType) {
      case 'ai_estimate':
        navigate('/services');
        break;
      case 'booking_deposit':
        navigate('/services');
        break;
      case 'job_payment':
        navigate('/portal');
        break;
      default:
        navigate('/');
    }
  };
  
  const getCancelMessage = () => {
    switch (paymentType) {
      case 'ai_estimate':
        return {
          title: 'Payment Cancelled',
          subtitle: 'Your AI estimate request was not completed',
          description: 'No payment has been processed. You can try again anytime or contact us for assistance.',
          icon: '🤖',
          impact: 'Your estimate request has not been submitted. To get your AI-powered estimate, you\'ll need to complete the payment.',
          nextSteps: [
            'Click "Try Again" to return to payment',
            'Or contact us for a manual quote',
            'Your project details have been saved'
          ]
        };
        
      case 'booking_deposit':
        return {
          title: 'Booking Not Confirmed',
          subtitle: 'Your service booking requires a deposit',
          description: 'Your appointment slot is being held temporarily. Please complete the deposit to secure your booking.',
          icon: '📅',
          impact: 'Your booking is NOT confirmed without the deposit. The time slot may be given to another customer.',
          urgent: true,
          nextSteps: [
            'Your slot is held for 30 minutes',
            'Complete payment to secure booking',
            'Or call us to book by phone'
          ]
        };
        
      case 'job_payment':
        return {
          title: 'Payment Incomplete',
          subtitle: 'Your service payment was not processed',
          description: 'Your service has been completed but payment is still pending. Please complete payment at your earliest convenience.',
          icon: '💳',
          impact: 'Your account shows an outstanding balance. Please complete payment to maintain your account in good standing.',
          nextSteps: [
            'Return to Portal to pay',
            'Or call us to pay by phone',
            'Check your email for invoice'
          ]
        };
        
      default:
        return {
          title: 'Payment Cancelled',
          subtitle: 'Your transaction was not completed',
          description: 'No payment has been processed. You can try again or contact support if you need assistance.',
          icon: '❌',
          impact: 'No charges have been made to your account.',
          nextSteps: [
            'Try again when ready',
            'Contact support if you need help'
          ]
        };
    }
  };
  
  const message = getCancelMessage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className={`${message.urgent ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'} p-8 text-white text-center`}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                <XCircle className="w-12 h-12" />
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
              
              {/* Impact Alert */}
              {message.impact && (
                <div className={`${message.urgent ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'} border rounded-xl p-6 mb-8`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`w-6 h-6 ${message.urgent ? 'text-red-600' : 'text-yellow-600'} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Important:</h3>
                      <p className="text-gray-700">{message.impact}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Next Steps */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">What You Can Do:</h3>
                <ul className="space-y-3">
                  {message.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-gray-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transform transition-all hover:scale-[1.02]"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                
                <Link
                  to="/"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Return Home
                </Link>
              </div>
              
              {/* Contact Support */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  If you're having trouble with payment or have questions, we're here to help:
                </p>
                <div className="space-y-3">
                  <a 
                    href="mailto:support@quantumtechnician.com" 
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Mail className="w-5 h-5" />
                    support@quantumtechnician.com
                  </a>
                  <a 
                    href="tel:555-123-4567" 
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Phone className="w-5 h-5" />
                    (555) 123-4567
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Available Monday-Friday, 8AM-6PM MST
                </p>
              </div>
              
              {/* Security Note */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  🔒 Your payment information is secure and encrypted. No charges were made.
                </p>
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
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
