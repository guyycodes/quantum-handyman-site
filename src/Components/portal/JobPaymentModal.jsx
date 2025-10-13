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
    username: '@QuantumTechnician',
    appInstructions: 'Authorize Venmo to open with payment details pre-filled',
    webInstructions: 'Not using Venmo mobile? You\'ll redirect to Venmo\'s website'
  },
  buttons: {
    stripe: 'Pay with Stripe',
    venmo: 'Pay with Venmo',
    cancel: 'Cancel'
  }
};

const JobPaymentModal = ({ isOpen, onClose, job, onStripePayment, onVenmoPayment, popupBlocked, onRetryPayment, isMobile, getAdditionalTimeCost, getMaterialsCost }) => {
  const [selectedTip, setSelectedTip] = useState(0);
  const [showVenmoInfo, setShowVenmoInfo] = useState(false);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [isProcessingVenmo, setIsProcessingVenmo] = useState(false);
  const [additionalTimeCost, setAdditionalTimeCost] = useState(0);
  const [loadingAdditionalCost, setLoadingAdditionalCost] = useState(false);
  const [materialsCost, setMaterialsCost] = useState(0);
  const [loadingMaterialsCost, setLoadingMaterialsCost] = useState(false);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all modal state when it closes
      setSelectedTip(0);
      setShowVenmoInfo(false);
      setIsProcessingStripe(false);
      setIsProcessingVenmo(false);
      setAdditionalTimeCost(0);
      setLoadingAdditionalCost(false);
      setMaterialsCost(0);
      setLoadingMaterialsCost(false);
    }
  }, [isOpen]);

  // Fetch additional time cost when modal opens
  useEffect(() => {
    const fetchAdditionalTimeCost = async () => {
      if (isOpen && getAdditionalTimeCost && job && job['Booking Reference']) {
        setLoadingAdditionalCost(true);
        try {
          const result = await getAdditionalTimeCost(job['Booking Reference']);
          if (result.success) {
            setAdditionalTimeCost(result.totalCost || 0);
          }
        } catch (error) {
          console.error('Error fetching additional time cost:', error);
        } finally {
          setLoadingAdditionalCost(false);
        }
      }
    };

    fetchAdditionalTimeCost();
  }, [isOpen, job, getAdditionalTimeCost]);

  // Fetch materials cost when modal opens
  useEffect(() => {
    const fetchMaterialsCost = async () => {
      if (isOpen && getMaterialsCost && job && job['Booking Reference']) {
        setLoadingMaterialsCost(true);
        try {
          const result = await getMaterialsCost(job['Booking Reference']);
          if (result.success) {
            setMaterialsCost(result.totalCost || 0);
          }
        } catch (error) {
          console.error('Error fetching materials cost:', error);
        } finally {
          setLoadingMaterialsCost(false);
        }
      }
    };

    fetchMaterialsCost();
  }, [isOpen, job, getMaterialsCost]);
  
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
  
  // Calculate total with additional time cost and materials cost
  const totalJobAmount = originalAmount + additionalTimeCost + materialsCost;
  
  // Subtract deposit from the amount owed (ensure it doesn't go negative)
  const baseAmount = Math.max(0, totalJobAmount - deposit);
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
            {/* Job Details - Compact */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Job:</span>
                  <span className="font-semibold text-sm">{job['Booking Reference']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="font-semibold text-sm">{job['Service']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="font-semibold text-sm">{formatDate(job['Date'])}</span>
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
            
              {/* Price Breakdown - Compact */}
              <div className="border-t border-gray-200 pt-3 mb-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service:</span>
                    <span className="font-semibold text-sm">${originalAmount.toFixed(2)}</span>
                  </div>
                  {loadingAdditionalCost ? (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Additional Time:</span>
                      <span className="text-gray-500 text-xs">Loading...</span>
                    </div>
                  ) : additionalTimeCost > 0 ? (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Additional Time:</span>
                      <span className="font-semibold text-sm text-green-600">+ ${additionalTimeCost.toFixed(2)}</span>
                    </div>
                  ) : null}
                  {loadingMaterialsCost ? (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Materials:</span>
                      <span className="text-gray-500 text-xs">Loading...</span>
                    </div>
                  ) : materialsCost > 0 ? (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Materials:</span>
                      <span className="font-semibold text-sm text-blue-600">+ ${materialsCost.toFixed(2)}</span>
                    </div>
                  ) : null}
                  {(additionalTimeCost > 0 || loadingAdditionalCost || materialsCost > 0 || loadingMaterialsCost) && (
                    <div className="flex justify-between pt-1.5 border-t border-gray-100">
                      <span className="text-sm text-gray-700 font-medium">Subtotal:</span>
                      <span className="font-semibold text-sm">${totalJobAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {deposit > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deposit Paid:</span>
                        <span className="font-semibold text-sm text-green-600">- ${deposit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-gray-100">
                        <span className="text-sm text-gray-700 font-medium">Amount Due:</span>
                        <span className={`font-semibold text-sm ${baseAmount === 0 ? 'text-green-600' : ''}`}>
                          ${baseAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  {baseAmount === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                      <p className="text-xs text-green-700">
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
