import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CONTENT = {
  title: 'Payment Summary',
  subtitle: 'Review and complete your payment',
  depositAmount: 25,
  tip: {
    label: 'Add a tip for excellent service',
    options: [
      { percent: 0, label: 'No tip' },
      { percent: 5, label: '5%' },
      { percent: 7, label: '7%' },
      { percent: 10, label: '10%' }
    ]
  },
  venmo: {
    label: 'Pay with Venmo',
    username: '@QuantumHandyman',
    appInstructions: 'Authorize Venmo to open with payment details pre-filled',
    webInstructions: 'Not using Venmo mobile? You\'ll redirect to Venmo\'s website'
  },
  buttons: {
    stripe: 'Pay with Stripe',
    venmo: 'Pay with Venmo',
    cancel: 'Cancel'
  }
};

const JobPaymentModal = ({ isOpen, onClose, job, onStripePayment, onVenmoPayment, popupBlocked, onRetryPayment, isMobile }) => {
  const [selectedTip, setSelectedTip] = useState(0);
  const [showVenmoInfo, setShowVenmoInfo] = useState(false);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [isProcessingVenmo, setIsProcessingVenmo] = useState(false);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all modal state when it closes
      setSelectedTip(0);
      setShowVenmoInfo(false);
      setIsProcessingStripe(false);
      setIsProcessingVenmo(false);
    }
  }, [isOpen]);
  
  if (!isOpen || !job) return null;
  
  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;
      
      // Format as "Monday, October 13, 2025"
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };  
  // Parse the job price to calculate amounts
  const baseAmountFloat = job['Price']
  const depositAmountString = job['Deposit Paid']
  const deposit = depositAmountString === "Yes" ? CONTENT.depositAmount : 0;
  const baseAmountString = String(baseAmountFloat);
  const originalAmount = parseFloat(baseAmountString.replace(/[^0-9.]/g, '') || 0);
  
  // Subtract deposit from the amount owed (ensure it doesn't go negative)
  const baseAmount = Math.max(0, originalAmount - deposit);
  const tipAmount = (baseAmount * selectedTip) / 100;
  const totalAmount = baseAmount + tipAmount;
  
  const handleStripePayment = async () => {
    setIsProcessingStripe(true);
    await onStripePayment({
      baseAmount,
      tipAmount,
      totalAmount,
      tipPercent: selectedTip
    });
    // Loading state will be cleared by useEffect when modal closes or on error
    setTimeout(() => setIsProcessingStripe(false), 3000); // Safety timeout
  };
  
  const handleVenmoClick = () => {
    // Show loading and Venmo info
    setIsProcessingVenmo(true);
    setShowVenmoInfo(true);
    
    // Trigger the Venmo payment after a short delay to show the info
    setTimeout(() => {
      if (onVenmoPayment) {
        onVenmoPayment({
          baseAmount,
          tipAmount,
          totalAmount,
          tipPercent: selectedTip
        });
      }
      // Clear loading state after action
      setTimeout(() => setIsProcessingVenmo(false), 1000);
    }, 1250); // Show info for 1.25 seconds before opening Venmo
  };
  
  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{CONTENT.title}</h3>
                <p className="text-blue-100 mt-1">{CONTENT.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Job Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Job Reference:</span>
                  <span className="font-semibold">{job['Booking Reference']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">{job['Service']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{formatDate(job['Date'])}</span>
                </div>
              </div>
            </div>
            
              {/* Tip Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {CONTENT.tip.label}
                  {CONTENT.depositAmount > 0 && baseAmount > 0 && (
                    <span className="text-xs font-normal text-gray-500 block mt-1">
                      Tip calculated on amount due (${baseAmount.toFixed(2)}) after deposit
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CONTENT.tip.options.map((option) => (
                    <button
                      key={option.percent}
                      onClick={() => setSelectedTip(option.percent)}
                      className={`py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                        selectedTip === option.percent
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            
              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Service Amount:</span>
                    <span className="font-semibold">${originalAmount.toFixed(2)}</span>
                  </div>
                  {CONTENT.depositAmount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span className="text-gray-600">Deposit Paid:</span>
                        <span className="font-semibold">- ${CONTENT.depositAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-700 font-medium">Amount Due:</span>
                        <span className={`font-semibold ${baseAmount === 0 ? 'text-green-600' : ''}`}>
                          ${baseAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  {baseAmount === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <p className="text-sm text-green-700">
                        ✅ Your deposit fully covers this service! You can still add a tip if you'd like.
                      </p>
                    </div>
                  )}
                  {tipAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip ({selectedTip}%):</span>
                      <span className="font-semibold">+ ${tipAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total to Pay:</span>
                    <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            
            {/* Venmo Info (shown when clicked) */}
            {showVenmoInfo && !popupBlocked && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Opening Venmo...</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-purple-800">
                    <strong>Amount to Pay:</strong> ${totalAmount.toFixed(2)}
                    {tipAmount > 0 && (
                      <span className="text-xs text-purple-600 ml-2">(includes ${tipAmount.toFixed(2)} tip)</span>
                    )}
                  </p>
                  <p className="text-sm text-purple-800">
                    <strong>To:</strong> {CONTENT.venmo.username}
                  </p>
                  <p className="text-sm text-purple-800">
                    <strong>Reference:</strong> {job['Booking Reference']}
                  </p>
                  <p className="text-md text-green-600 mt-3 italic">
                    <strong>Instructions: </strong>{isMobile ? CONTENT.venmo.appInstructions : CONTENT.venmo.webInstructions}
                  </p>
                </div>
              </div>
            )}
            
            {/* Popup Blocked Alert */}
            {popupBlocked && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Payment popup was blocked
                    </h4>
                    <p className="text-sm text-amber-800 mb-3">
                      To complete your payment, please allow popups:
                    </p>
                    <ol className="text-sm text-amber-800 space-y-1 mb-4">
                      <li>1. Look for the popup blocker icon in your browser's address bar</li>
                      <li>2. Click it and allow popups from this site</li>
                      <li>3. Click the button below to try again</li>
                    </ol>
                    <button
                      onClick={onRetryPayment}
                      className="w-full py-2 px-4 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Try Payment Again
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleStripePayment}
                disabled={isProcessingStripe || isProcessingVenmo}
                className={`w-full py-3 px-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isProcessingStripe || isProcessingVenmo 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : popupBlocked
                    ? 'bg-gray-400 text-gray-600'
                    : 'bg-gradient-to-r from-blue-600 to-green-500 text-white hover:shadow-lg'
                }`}
                style={{ display: popupBlocked ? 'none' : 'flex' }}
              >
                {isProcessingStripe ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {CONTENT.buttons.stripe}
                  </>
                )}
              </button>
              
              <button
                onClick={handleVenmoClick}
                disabled={isProcessingStripe || isProcessingVenmo}
                className={`w-full py-3 px-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isProcessingStripe || isProcessingVenmo
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                style={{ display: popupBlocked ? 'none' : 'flex' }}
              >
                {isProcessingVenmo ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Opening Venmo...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    {CONTENT.buttons.venmo}
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {CONTENT.buttons.cancel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPaymentModal;
