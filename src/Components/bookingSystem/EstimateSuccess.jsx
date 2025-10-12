import React, { useState } from 'react';
import { CheckCircle, Mail, Clock, Phone, ArrowRight, Calculator, FileSearch, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// Content Management - All text content in one place
const CONTENT = {
  title: '✅ Estimate Request Submitted!',
  subtitle: 'Thank you for your interest in our services',
  reminder: 'Reminder: Please check your spam folder for the confirmation email.',
  referenceNumber: 'Your reference number:',
  aiResults: {
    title:'🤖 AI Estimate Results',
    cost: 'Estimated Cost:',
    time: 'Time Estimate:',
    complexity: 'Project Complexity:',
    jobDescription: 'Scope of Work:',
    notes: 'Notes:',
    fullDetails: 'Full details have been emailed to you',
    requestSent: 'Estimate request sent to:'
  },
  whatNext: {
    title: 'What Happens Next?',
    steps: [
      {
        icon: Mail,
        title: 'Confirmation Email',
        description: 'You\'ll receive a confirmation email shortly'
      },
      {
        icon: Clock,
        title: 'Quick Review',
        description: 'Our team will review your request within 24 hours'
      },
      {
        icon: Calculator,
        title: 'Detailed Estimate',
        description: 'We\'ll send you a detailed estimate based on your project'
      },
      {
        icon: Phone,
        title: 'Follow Up',
        description: 'We may contact you if we need any additional information'
      }
    ]
  },
  contactInfo: {
    title: 'Need to reach us sooner?',
    email: 'hello@quantumtechnician.com',
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-4PM'
  },
  portalTracking: {
    title: '🔍 Track Your Estimate Status',
    subtitle: 'View your estimate anytime in the Portal',
    steps: [
      '1. Go to Portal',
      '2. Enter your reference number',
      '3. View estimate status & details'
    ],
    buttonText: 'Go to Portal',
    hint: 'Save your reference number to track your estimate'
  },
  closeButton: 'Close',
  newEstimateButton: 'Request Another Estimate'
};

const EstimateSuccess = ({ estimateData, onClose, aiResultText, onNewEstimate }) => {
  const [aiResultsChild, setAiResultsChild] = useState(aiResultText);
  const { estimateRef, customerInfo, service, aiEstimateResult, useAIEstimate } = estimateData;

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <CheckCircle className="w-24 h-24 text-green-500" />
          <div className="absolute inset-0 animate-ping">
            <CheckCircle className="w-24 h-24 text-green-500 opacity-30" />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{CONTENT.title}</h3>
      <p className="text-lg text-gray-600 mb-6">{CONTENT.subtitle}</p>

      {/* Reference Number */}
      {estimateRef && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">{CONTENT.referenceNumber}</p>
          <p className="text-sm text-green-600 mb-1">{CONTENT.reminder}</p>
          <p className="text-2xl font-bold text-blue-600">{estimateRef}</p>
        </div>
      )}

      {/* Portal Tracking Instructions */}
      {estimateRef && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-5 mb-8">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <FileSearch className="w-5 h-5 text-indigo-600" />
            {CONTENT.portalTracking.title}
          </h4>
          <p className="text-sm text-gray-600 mb-4">{CONTENT.portalTracking.subtitle}</p>
          
          {/* Visual Steps */}
          <div className="flex items-center justify-center gap-2 mb-4 bg-white rounded-lg p-3">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">Portal</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">Enter {estimateRef}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">View Status</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
          
          {/* Steps List */}
          <div className="space-y-1 mb-4">
            {CONTENT.portalTracking.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-indigo-500 mt-1 flex-shrink-0" />
                <span className="text-xs text-gray-600">{step}</span>
              </div>
            ))}
          </div>
          
          {/* Portal Button */}
          <Link
            to="/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {CONTENT.portalTracking.buttonText}
          </Link>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            💡 {CONTENT.portalTracking.hint}
          </p>
        </div>
      )}

      {/* AI Estimate Results (if available) */}
      {useAIEstimate && aiEstimateResult && aiEstimateResult.success && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6 mb-8 text-left">
          <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
            {CONTENT.aiResults.title}
          </h4>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">{CONTENT.aiResults.cost}</p>
              <p className="text-xl font-bold text-green-600">{aiEstimateResult.price}</p>
            </div>
            {aiEstimateResult.laborHours && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">{CONTENT.aiResults.time}</p>
                <p className="font-medium text-gray-900">{aiEstimateResult.laborHours}</p>
              </div>
            )}
            {aiEstimateResult.complexity && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">{CONTENT.aiResults.complexity}</p>
                <p className="font-medium text-gray-900">{aiEstimateResult.complexity}</p>
              </div>
            )}
          </div>
          {aiResultsChild && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-purple-100">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {aiResultsChild}
              </pre>
            </div>
          )}
          <p className="text-md text-gray-500 mt-4 text-center">
            {CONTENT.aiResults.fullDetails}
          </p>
        </div>
      )}

      {/* Customer Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <p className="text-sm text-gray-600 mb-2">{CONTENT.aiResults.requestSent}</p>
        <p className="font-medium text-gray-900">{customerInfo.email}</p>
      </div>

      {/* What Happens Next */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-gray-900 mb-4">{CONTENT.whatNext.title}</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {CONTENT.whatNext.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-start gap-3 text-left">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">{step.title}</h5>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-gray-900 mb-3">{CONTENT.contactInfo.title}</h4>
        <div className="space-y-2 text-sm">
          {/* <p className="text-gray-700">
            <Phone className="w-4 h-4 inline mr-1 text-blue-600" />
            Call: <a href={`tel:${CONTENT.contactInfo.phone.replace(/\D/g, '')}`} className="text-blue-600 hover:underline font-medium">
              {CONTENT.contactInfo.phone}
            </a>
          </p> */}
          <p className="text-gray-700">
            <Mail className="w-4 h-4 inline mr-1 text-blue-600" />
            Email: <a href={`mailto:${CONTENT.contactInfo.email}`} className="text-blue-600 hover:underline font-medium">
              {CONTENT.contactInfo.email}
            </a>
          </p>
          <p className="text-gray-600">
            <Clock className="w-4 h-4 inline mr-1 text-gray-400" />
            {CONTENT.contactInfo.hours}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          {CONTENT.closeButton}
        </button>
        <button
          onClick={onNewEstimate}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {CONTENT.newEstimateButton}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EstimateSuccess;
