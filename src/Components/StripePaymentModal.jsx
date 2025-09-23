import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, Loader } from 'lucide-react';
import stripePaymentService from '../services/stripePaymentService';

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
  const [isTestMode, setIsTestMode] = useState(!stripePaymentService.validateStripeConfig().isValid);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let result;
      
      if (isTestMode) {
        // Use mock payment for testing
        result = await stripePaymentService.mockPayment(customerInfo);
      } else {
        // Create checkout session and redirect
        const session = await stripePaymentService.createAIEstimateCheckoutSession(customerInfo);
        
        if (session.success) {
          // Store payment status in session storage for return
          sessionStorage.setItem('pendingAIEstimate', JSON.stringify({
            customerInfo,
            timestamp: Date.now()
          }));
          
          // Redirect to Stripe checkout
          await stripePaymentService.redirectToCheckout(session.sessionId);
          return; // User will be redirected
        } else {
          result = session;
        }
      }

      if (result.success) {
        onPaymentSuccess(result);
      } else {
        setError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
                    disabled={!stripePaymentService.validateStripeConfig().isValid}
                  >
                    {stripePaymentService.validateStripeConfig().isValid 
                      ? CONTENT.testMode.useRealPayment 
                      : 'Stripe not configured'}
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
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
