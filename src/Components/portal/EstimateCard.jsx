import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, ArrowRight, Clock, ChevronDown, ChevronUp, CheckCircle, Bot, Image } from 'lucide-react';
import BookingModal from '../../Components/BookingModal';

const EstimateCard = ({ estimate, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Determine status display
  const getStatusBadge = () => {
    switch (estimate.displayStatus) {
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Converted to Booking
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
            <Clock className="w-3 h-3" />
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Clean the date string
    const cleanDate = dateString.toString().trim();
    
    // Try parsing the date
    let date;
    
    // Handle ISO format (from Timestamp field)
    if (cleanDate.includes('T')) {
      date = new Date(cleanDate);
    } 
    // Handle YYYY-MM-DD format
    else if (cleanDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = cleanDate.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } 
    // Fallback: Try direct parsing
    else {
      date = new Date(cleanDate);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date in EstimateCard:', dateString);
      return 'N/A';
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Parse customer images from CSV base64 strings
  const getCustomerImages = () => {
    const imagesData = estimate['Image Data (Base64)'] || '';
    if (!imagesData || imagesData === '' || imagesData === 'No') return [];
    
    // Split CSV and clean up
    const base64Images = imagesData.split(',')
      .map(img => img.trim())
      .filter(img => img && img.length > 0 && !img.includes('[EXCEEDED_LIMIT]'));
    
    // Add data URL prefix for display
    return base64Images.map(base64 => {
      // Check if it already has a data URL prefix
      if (base64.startsWith('data:')) {
        return base64;
      }
      // Try to detect if it's PNG or JPEG from the base64 content
      // PNG starts with iVBORw0KGgo, JPEG starts with /9j/
      if (base64.startsWith('iVBORw0KGgo')) {
        return `data:image/png;base64,${base64}`;
      } else {
        return `data:image/jpeg;base64,${base64}`;
      }
    });
  };
  
  const customerImages = getCustomerImages();
  
  const handleBookNow = () => {
    // Pass estimate reference and service info to booking modal
    setShowBookingModal(true);
  };
  
  const isAI = estimate['Type'] === 'AI' || estimate['AI Processed'] === 'Yes';
  const canBook = estimate.displayStatus === 'pending';
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Estimate #{estimate['Estimate Reference']}
                </h3>
                <p className="text-sm text-gray-600">
                  {estimate['Service Type'] || 'General Service'}
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
          
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{formatDate(estimate['Timestamp'])}</span>
            </div>
            {estimate['AI Price'] && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-900">{estimate['AI Price']}</span>
              </div>
            )}
            {isAI && (
              <div className="flex items-center gap-2 text-sm">
                <Bot className="w-4 h-4 text-purple-500" />
                <span className="text-purple-700 font-medium">AI Estimate</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          {/* Project Description Preview */}
          {estimate['Project Description'] && (
            <div className="mb-4">
              <p className="text-gray-700 line-clamp-2">
                {estimate['Project Description']}
              </p>
            </div>
          )}
          
          {/* Expandable Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
              {/* AI Analysis */}
              {isAI && estimate['AI Job Description'] && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-purple-800 mb-3">
                    {estimate['AI Job Description']}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {estimate['AI Labor Hours'] && (
                      <div>
                        <span className="text-purple-600">Labor Hours:</span>
                        <span className="ml-2 font-medium text-purple-900">
                          {estimate['AI Labor Hours']}
                        </span>
                      </div>
                    )}
                    {estimate['AI Complexity'] && (
                      <div>
                        <span className="text-purple-600">Complexity:</span>
                        <span className="ml-2 font-medium text-purple-900">
                          {estimate['AI Complexity']}
                        </span>
                      </div>
                    )}
                  </div>
                  {estimate['AI Notes'] && (
                    <div className="mt-3 text-sm">
                      <span className="text-purple-600">Notes:</span>
                      <p className="text-purple-800 mt-1">{estimate['AI Notes']}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Customer:</span>
                  <p className="font-medium text-gray-900">{estimate['Customer Name']}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium text-gray-900">{estimate['Customer Email']}</p>
                </div>
                {estimate['Customer Phone'] && (
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium text-gray-900">{estimate['Customer Phone']}</p>
                  </div>
                )}
                {estimate['Customer Address'] && (
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <p className="font-medium text-gray-900">{estimate['Customer Address']}</p>
                  </div>
                )}
              </div>
              
              {/* Booking Reference if converted */}
              {estimate['Booking Reference'] && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Booking Reference:</span> {estimate['Booking Reference']}
                  </p>
                </div>
              )}
              
              {/* Customer Images */}
              {customerImages.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project Photos</h4>
                  <div className="flex gap-2 flex-wrap">
                    {customerImages.slice(0, 3).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setShowImageGallery(true);
                        }}
                        className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors"
                      >
                        <img 
                          src={image} 
                          alt={`Project photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Image className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                    {customerImages.length > 3 && (
                      <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                        +{customerImages.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View Details
                </>
              )}
            </button>
            
            {canBook && (
              <button
                onClick={handleBookNow}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transform transition-all hover:scale-[1.02]"
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          if (onRefresh) onRefresh();
        }}
        initialService={{
          id: 'custom',
          name: estimate['Service Type'] || 'Service from Estimate',
          price: estimate['AI Price'] || 'TBD',
          estimateRef: estimate['Estimate Reference']
        }}
      />
      
      {/* Image Gallery Modal */}
      {showImageGallery && customerImages.length > 0 && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black bg-opacity-90"
          onClick={() => setShowImageGallery(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronDown className="w-6 h-6 rotate-180" />
            </button>
            
            {/* Main image display */}
            <div className="flex items-center justify-center h-[70vh]">
              <img 
                src={customerImages[selectedImageIndex]} 
                alt={`Project photo ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Image navigation */}
            {customerImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev - 1 + customerImages.length) % customerImages.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronDown className="w-6 h-6 rotate-90" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev + 1) % customerImages.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronDown className="w-6 h-6 -rotate-90" />
                </button>
              </>
            )}
            
            {/* Thumbnail strip */}
            {customerImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                {customerImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex ? 'border-purple-400 scale-110' : 'border-gray-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Image counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {customerImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstimateCard;
