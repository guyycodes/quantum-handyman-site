import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, AlertCircle, Loader, ExternalLink, RefreshCw } from 'lucide-react';
import useStripe from '../hooks/useStripe';

const CONTENT = {
  title: '💳 Secure Payment',
  subtitle: 'AI-Powered Estimate Service',
  price: '$1.95',
  description: 'One-time payment for instant AI estimate analysis',
  features: [
    'Instant AI analysis of your project',
    'Detailed cost breakdown',
    'Material recommendations',
    'Time estimates'
  ],
  security: '🔒 Secure payment powered by Stripe',
  buttons: {
    pay: 'Pay $1.95',
    processing: 'Processing...',
    cancel: 'Cancel'
  },
  disclaimer: 'Your payment information is secure and encrypted. We never store your card details.',
  testMode: {
    message: '🧪 TEST MODE: Use card 4242 4242 4242 4242 with any future date',
    useRealPayment: 'Use Real Payment',
    useMockPayment: 'Use Mock Payment (Testing)'
  }
};

const StripePaymentModal = ({ isOpen, onClose, onPaymentSuccess, customerInfo }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [popupRef, setPopupRef] = useState(null);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  
  // Use the useStripe hook
  const { createAIEstimatePayment, openStripeCheckout, isStripeConfigured } = useStripe();
  const [isTestMode, setIsTestMode] = useState(!isStripeConfigured);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (isTestMode) {
        // Use mock payment for testing (90% success rate)
        console.log("your running in test mode - check your env vars")
        // await new Promise(resolve => setTimeout(resolve, 2000));
        // const success = Math.random() > 0.1;
        
        if (success) {
          // onPaymentSuccess({
          //   success: true,
          //   paymentId: `mock_${Date.now()}`,
          //   amount: 195,
          //   currency: 'usd'
          // });
          console.log('Mock payment successful');
        } else {
          setError('Mock payment failed for testing');
        }
        setIsProcessing(false);
      } else {
        // Create real Stripe checkout session using the hook
        const result = await createAIEstimatePayment({
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          description: customerInfo.description
        });
        
        if (result.success) {
          // Save the checkout URL in case we need to retry
          setCheckoutUrl(result.url);
          
          // Open Stripe checkout in popup
          const checkoutResult = openStripeCheckout(
            result.url,
            (paymentResult) => {
              // Payment completion callback
              setIsProcessing(false);
              setPopupBlocked(false);
              setCheckoutUrl(null);
              
              if (paymentResult.success) {
                // Payment successful
                onPaymentSuccess({
                  success: true,
                  sessionId: paymentResult.data?.sessionId,
                  customerInfo
                });
              } else if (paymentResult.cancelled) {
                // Payment cancelled
                setError('Payment was cancelled. Please try again.');
              } else if (paymentResult.closed) {
                // Popup was closed
                setError('Payment window was closed. Please try again.');
              }
            },
            (blockedInfo) => {
              // Popup was blocked callback
              setIsProcessing(false);
              setPopupBlocked(true);
              setError(null); // Clear any previous errors
              console.log('Popup blocked, URL saved for retry:', blockedInfo.url);
            }
          );
          
          // Store popup reference if successful
          if (checkoutResult) {
            setPopupRef(checkoutResult);
            setPopupBlocked(false);
          }
        } else {
          setError(result.error || 'Payment failed. Please try again.');
          setIsProcessing(false);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };
  
  // Retry payment after enabling popups
  const retryPayment = () => {
    if (checkoutUrl) {
      setError(null);
      setPopupBlocked(false);
      
      // Try to open the popup again
      const checkoutResult = openStripeCheckout(
        checkoutUrl,
        (paymentResult) => {
          // Payment completion callback
          setIsProcessing(false);
          setPopupBlocked(false);
          setCheckoutUrl(null);
          
          if (paymentResult.success) {
            onPaymentSuccess({
              success: true,
              sessionId: paymentResult.data?.sessionId,
              customerInfo
            });
          } else if (paymentResult.cancelled) {
            setError('Payment was cancelled. Please try again.');
          } else if (paymentResult.closed) {
            setError('Payment window was closed. Please try again.');
          }
        },
        (blockedInfo) => {
          // Still blocked
          setPopupBlocked(true);
          setError(null);
        }
      );
      
      if (checkoutResult) {
        setPopupRef(checkoutResult);
        setPopupBlocked(false);
      }
    }
  };
  
  // Clean up popup on unmount
  useEffect(() => {
    return () => {
      if (popupRef?.cleanup) {
        popupRef.cleanup();
      }
    };
  }, [popupRef]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">{CONTENT.title}</h3>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-bold">{CONTENT.price}</span>
              </div>
            </div>
            <p className="text-purple-100">{CONTENT.subtitle}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Service Description */}
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{CONTENT.description}</p>
              
              {/* Features */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <ul className="space-y-2">
                  {CONTENT.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Test Mode Notice */}
              {isTestMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">{CONTENT.testMode.message}</p>
                  <button
                    onClick={() => setIsTestMode(false)}
                    className="text-sm text-blue-600 hover:underline mt-2"
                    disabled={!isStripeConfigured}
                  >
                    {isStripeConfigured 
                      ? CONTENT.testMode.useRealPayment 
                      : 'Stripe not configured'}
                  </button>
                </div>
              )}

              {/* Popup Blocked Warning */}
              {popupBlocked && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Popup Blocked - Action Required</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Your browser blocked the payment window. Please allow popups for this site.
                      </p>
                      
                      <div className="bg-white rounded p-3 mb-3">
                        <p className="font-semibold text-xs text-gray-900 mb-2">Quick Fix:</p>
                        <ol className="space-y-1 text-xs text-gray-600">
                          <li>1. Look for the popup blocker icon in your address bar (right side)</li>
                          <li>2. Click it and select "Always allow popups from this site"</li>
                          <li>3. Click the button below to retry</li>
                        </ol>
                      </div>
                      
                      <button
                        onClick={retryPayment}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white font-medium rounded hover:bg-yellow-600 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Payment Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Error Message */}
              {error && !popupBlocked && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <Lock className="w-4 h-4" />
                <span>{CONTENT.security}</span>
              </div>

              {/* Customer Info Summary */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4">
                <p className="text-gray-600">Billing Email:</p>
                <p className="font-medium text-gray-900">{customerInfo.email}</p>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center">
                {CONTENT.disclaimer}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {CONTENT.buttons.cancel}
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {CONTENT.buttons.processing}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {CONTENT.buttons.pay}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
