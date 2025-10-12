import React, { useState } from 'react';
import { Calculator, User, Mail, Phone, MapPin, FileText, Camera, Check, Sparkles, DollarSign } from 'lucide-react';

// Content Management - All text content in one place
const CONTENT = {
  title: 'Review Your Estimate Request',
  subtitle: 'Please confirm your details before submitting',
  sections: {
    service: 'Service Selected',
    customerInfo: 'Your Information',
    projectDetails: 'Project Details',
    photos: 'Photos Attached',
    aiEstimate: 'AI-Powered Instant Estimate'
  },
  aiOption: {
    label: 'Get instant AI-powered estimate',
    price: '$1.95',
    priceWithPromo: 'FREE with promo code',
    description: '⚠️ IMPORTANT: Ensure your project description + photos are accurate & detailed to receive the best estimate.',
    checkboxHint: '✓ Check this box to add AI estimate (have a promo code? Enter it after checking!)',
    benefits: [
      'Instant professional estimate',
      'Cost breakdown',
      'Work breakdown',
      'Labor hours',
      'Complexity',
      'Materials (if applicable)',
      'High level project roadmap'
    ],
    promoCode: {
      label: 'Have a Promo Code? Enter it here for FREE AI Estimate:',
      placeholder: 'Enter promo code for FREE estimate',
      applied: '✅ Promo code applied - FREE AI Estimate!',
      hint: '💡 Enter your promo code below to get this AI estimate for FREE!'
    }
  },
  confirmButton: {
    normal: 'Submit Estimate Request',
    withAI: 'Proceed to Payment ($1.95)',
    withAIFree: 'Submit AI Estimate Request (FREE)',
    submitting: 'Submitting...'
  },
  editPrompt: 'Need to make changes? Use the back button below to edit.',
  disclaimer: 'By submitting this request, you agree to be contacted regarding your free estimate.',
  disclaimerWithAI: 'By proceeding, you agree to pay $1.95 for AI-powered instant estimate analysis.',
  disclaimerWithAIFree: 'By submitting, you agree to receive your FREE AI-powered instant estimate.'
};

const EstimateConfirmation = ({ estimateData, onConfirm, isSubmitting, onAIToggle }) => {
  const { service, customerInfo } = estimateData;
  const [useAIEstimate, setUseAIEstimate] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoValid, setIsPromoValid] = useState(false);
  
  // Check if photos are uploaded
  const hasPhotos = customerInfo.images && customerInfo.images.length > 0;

  // Check promo code validity
  const checkPromoCode = (code) => {
    const validPromoCodes = [
      import.meta.env.VITE_PROMO_1,
      import.meta.env.VITE_PROMO_2,
      import.meta.env.VITE_PROMO_3
    ].filter(Boolean);
    
    return validPromoCodes.includes(code.trim());
  };

  const handlePromoCodeChange = (e) => {
    const code = e.target.value;
    setPromoCode(code);
    const isValid = checkPromoCode(code);
    setIsPromoValid(isValid);
  };

  const handleAIToggle = (checked) => {
    // Only allow toggling if photos are uploaded
    if (!hasPhotos) return;
    
    setUseAIEstimate(checked);
    if (onAIToggle) {
      onAIToggle(checked);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Check className="w-6 h-6 text-green-500" />
        {CONTENT.title}
      </h3>
      <p className="text-gray-600 mb-6">{CONTENT.subtitle}</p>

      {/* Service Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          {CONTENT.sections.service}
        </h4>
        <div className="space-y-2 ml-7">
          <p className="text-gray-700">
            <span className="font-medium">{service.name}</span>
          </p>
          <p className="text-sm text-gray-600">{service.description}</p>
          <p className="text-lg font-bold text-green-600">{service.price}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          {CONTENT.sections.customerInfo}
        </h4>
        <div className="space-y-2 ml-7">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{customerInfo.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{customerInfo.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{customerInfo.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
            <span className="text-gray-700 whitespace-pre-wrap">{customerInfo.address}</span>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          {CONTENT.sections.projectDetails}
        </h4>
        <div className="ml-7">
          <p className="text-gray-700 whitespace-pre-wrap">{customerInfo.description}</p>
        </div>
      </div>

      {/* Photos if any */}
      {customerInfo.images && customerInfo.images.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            {CONTENT.sections.photos}
          </h4>
          <div className="ml-7">
            <p className="text-gray-700">
              {customerInfo.images.length} photo{customerInfo.images.length > 1 ? 's' : ''} attached
            </p>
          </div>
        </div>
      )}

      {/* AI Estimate Option */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
        {/* No Photos Warning */}
        {!hasPhotos && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 mb-3 text-center">
            <span className="text-sm font-medium text-yellow-700">
              📷 Photo uploads are required for AI to perform analysis & generate estimates.
            </span>
          </div>
        )}
        {/* Promo Code Hint Banner */}
        {!useAIEstimate && hasPhotos && (
          <div className="bg-green-100 border border-green-300 rounded-lg px-3 py-2 mb-3 text-center">
            <span className="text-sm font-medium text-green-700">
              🎁 Have a promo code? Check the box below to enter it and get your AI estimate FREE!
            </span>
          </div>
        )}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="ai-estimate"
            checked={useAIEstimate}
            onChange={(e) => handleAIToggle(e.target.checked)}
            disabled={!hasPhotos}
            className={`mt-1 w-5 h-5 ${hasPhotos ? 'text-purple-600' : 'text-gray-400'} bg-white border-gray-300 rounded focus:ring-purple-500 ${!hasPhotos ? 'cursor-not-allowed opacity-50' : ''}`}
          />
          <div className="flex-1">
            <label htmlFor="ai-estimate" className={hasPhotos ? "cursor-pointer" : "cursor-not-allowed"}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-5 h-5 ${hasPhotos ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${hasPhotos ? 'text-gray-900' : 'text-gray-500'}`}>{CONTENT.aiOption.label}</span>
                {hasPhotos && (
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {CONTENT.aiOption.price}
                    </span>
                    <span className="text-xs font-semibold text-green-600 animate-pulse">
                      or {CONTENT.aiOption.priceWithPromo}
                    </span>
                  </div>
                )}
              </div>
              <p className={`text-sm mb-2 ${hasPhotos ? 'text-gray-600' : 'text-gray-400'}`}>
                {hasPhotos ? CONTENT.aiOption.description : '📷 Please upload photos of your project to enable AI-powered instant estimates'}
              </p>
              {hasPhotos && (
                <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                  {CONTENT.aiOption.checkboxHint}
                </p>
              )}
            </label>
            
            {useAIEstimate && (
              <div className="mt-3">
                <div className="pl-2 border-l-2 border-purple-300">
                  <ul className="space-y-1">
                    {CONTENT.aiOption.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Promo Code Field */}
                <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    {CONTENT.aiOption.promoCode.hint}
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {CONTENT.aiOption.promoCode.label}
                  </label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={handlePromoCodeChange}
                    placeholder={CONTENT.aiOption.promoCode.placeholder}
                    className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-medium"
                  />
                  {isPromoValid && (
                    <p className="mt-2 text-sm font-medium text-green-600">
                      {CONTENT.aiOption.promoCode.applied}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Prompt */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-800">{CONTENT.editPrompt}</p>
      </div>

      {/* Disclaimer */}
      <div className="text-sm text-gray-500 mb-6 text-center">
        {useAIEstimate 
          ? isPromoValid 
            ? CONTENT.disclaimerWithAIFree 
            : CONTENT.disclaimerWithAI 
          : CONTENT.disclaimer}
      </div>

      {/* Confirm Button */}
      <button
        onClick={() => onConfirm(useAIEstimate, isPromoValid, promoCode)}
        disabled={isSubmitting}
        className={`
          w-full py-3 px-4 font-semibold rounded-lg shadow-lg transform transition-all
          ${isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : useAIEstimate
              ? isPromoValid 
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl hover:scale-[1.02]'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl hover:scale-[1.02]'
              : 'bg-gradient-to-r from-blue-600 to-green-500 text-white hover:shadow-xl hover:scale-[1.02]'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {CONTENT.confirmButton.submitting}
          </span>
        ) : (
          <>
            {useAIEstimate && !isPromoValid && <DollarSign className="w-5 h-5 inline mr-1" />}
            {useAIEstimate 
              ? isPromoValid 
                ? CONTENT.confirmButton.withAIFree 
                : CONTENT.confirmButton.withAI 
              : CONTENT.confirmButton.normal}
          </>
        )}
      </button>
    </div>
  );
};

export default EstimateConfirmation;
