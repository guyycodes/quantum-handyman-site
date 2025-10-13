import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Clock, MapPin, DollarSign, User, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Loader, CreditCard, TrendingUp, Image, AlertTriangle, Pause, Plus, Package } from 'lucide-react';

const JobCard = ({ job, onPayment, onRefresh, onAddTime, getAdditionalTimeCost, onAddMaterials, getMaterialsCost }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showProgressImage, setShowProgressImage] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAddTimeDropdown, setShowAddTimeDropdown] = useState(false);
  const [isProcessingAddTime, setIsProcessingAddTime] = useState(false);
  const [additionalTimeCost, setAdditionalTimeCost] = useState(0);
  const [loadingAdditionalCost, setLoadingAdditionalCost] = useState(false);
  const [showAddMaterialsDropdown, setShowAddMaterialsDropdown] = useState(false);
  const [isProcessingAddMaterials, setIsProcessingAddMaterials] = useState(false);
  const [materialsCost, setMaterialsCost] = useState(0);
  const [loadingMaterialsCost, setLoadingMaterialsCost] = useState(false);
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  
  // Fetch additional time cost when component mounts
  useEffect(() => {
    const fetchAdditionalTimeCost = async () => {
      if (getAdditionalTimeCost && job['Booking Reference']) {
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
  }, [job['Booking Reference'], getAdditionalTimeCost]);

  // Fetch materials cost when component mounts
  useEffect(() => {
    const fetchMaterialsCost = async () => {
      if (getMaterialsCost && job['Booking Reference']) {
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
  }, [job['Booking Reference'], getMaterialsCost]);
  
  // Parse progress info (if not already parsed by backend)
  const getProgressInfo = () => {
    if (job.progressInfo) return job.progressInfo;
    
    const progress = job['Progress'] || '';
    if (!progress) {
      return {
        percentage: null,
        status: 'Scheduled',
        hasImage: false,
        imageUrl: null,
        message: 'Scheduled'
      };
    }
    
    const result = {
      percentage: null,
      status: progress,
      hasImage: false,
      imageUrl: null,
      message: progress
    };
    
    // Check for percentage
    const percentMatch = progress.match(/(\d+)%/);
    if (percentMatch) {
      result.percentage = parseInt(percentMatch[1]);
    }
    
    // Check for image URL
    const urlMatch = progress.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      result.hasImage = true;
      result.imageUrl = urlMatch[1];
      result.message = progress.replace(urlMatch[1], '').trim();
    }
    
    // Determine status based on keywords
    const lowerProgress = progress.toLowerCase();
    if (lowerProgress.includes('complete') && result.percentage === 100) {
      result.status = 'Completed';
    } else if (lowerProgress.includes('on hold') || lowerProgress.includes('delayed')) {
      result.status = 'On Hold';
    } else if (lowerProgress.includes('in progress') || (result.percentage && result.percentage > 0)) {
      result.status = 'In Progress';
    }
    
    return result;
  };
  
  const progressInfo = getProgressInfo();
  
  // Simple status determination - just use what's in the spreadsheet
  const getActualStatus = () => {
    const paymentStatus = job['Payment Status'] || 'Pending';
    const progressStr = job['Progress'] || '';
    const jobStatus = job['Status'] || '';
    
    // 1. If payment is completed and paid
    if (paymentStatus === 'Paid') {
      return 'completed_paid';
    }
    
    // 2. If job is 100% complete but payment is unpaid
    if (progressStr.includes('100%') && paymentStatus !== 'Paid') {
      return 'completed_unpaid';
    }
    
    // 3. If job is confirmed but not 100% complete & not on hold (in progress)
    if ((!progressStr.includes('100%') && jobStatus.toLowerCase().includes('confirmed')) && !progressStr.includes('On Hold')) {
      return 'in_progress';
    }
    
    // 4. Default fallback for scheduled/upcoming jobs
    return 'default';
  };
  
  const actualStatus = getActualStatus();
  
  // Parse customer images from CSV base64 strings
  const getCustomerImages = () => {
    const imagesData = job['Images'] || '';
    if (!imagesData || imagesData === '') return [];
    
    // Split CSV and clean up
    const base64Images = imagesData.split(',')
      .map(img => img.trim())
      .filter(img => img && img.length > 0 && !img.includes('[EXCEEDED_LIMIT]'));
    
    // Add data URL prefix for display (assuming JPEG, but PNG also works)
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
  
  // Get progress badge color and icon
  const getProgressBadge = () => {
    if (!progressInfo.message || progressInfo.message === 'Scheduled') return null;
    
    let bgColor, textColor, Icon;
    
    if (progressInfo.status === 'On Hold') {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      Icon = Pause;
    } else if (progressInfo.percentage === 100) {
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      Icon = CheckCircle;
    } else if (progressInfo.percentage && progressInfo.percentage > 0) {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      Icon = TrendingUp;
    } else {
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-700';
      Icon = AlertTriangle;
    }
    
    return { bgColor, textColor, Icon };
  };
  
  // Determine status display
  const getStatusBadge = () => {
    switch (actualStatus) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full animate-pulse">
            <Loader className="w-3 h-3 animate-spin" />
            In Progress
          </span>
        );
      case 'completed_paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Completed & Paid
          </span>
        );
      case 'completed_unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Payment Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Clean the date string and handle various formats
    const cleanDate = dateString.toString().trim();
    
    // Try different date parsing approaches
    let date;
    
    // First try: Parse YYYY-MM-DD format directly
    if (cleanDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Split and create date with local timezone
      const [year, month, day] = cleanDate.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      // Fallback: Try direct parsing
      date = new Date(cleanDate);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }
    
    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create job date for comparison
    const jobDate = new Date(date);
    jobDate.setHours(0, 0, 0, 0);
    
    // Add relative date info
    if (jobDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (jobDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (jobDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time - handle various time formats from Google Sheets
  const formatTime = (timeValue) => {
    if (!timeValue) return '';
    
    const timeStr = timeValue.toString().trim();
    
    // Check if it's an ISO datetime string (e.g., "1899-12-30T16:00:00.000Z")
    // This happens when Google Sheets stores time values in UTC
    if (timeStr.includes('T') && timeStr.includes('Z')) {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        // Use local time methods to automatically convert from UTC to local timezone
        const hours = date.getHours(); // This converts from UTC to local
        const minutes = date.getMinutes();
        
        // Convert to 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        
        return `${displayHour}:${displayMinutes} ${ampm}`;
      }
    }
    
    // Handle simple time string like "9:00" or "09:00"
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      const minute = timeMatch[2];
      
      // Convert to 12-hour format
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      
      return `${displayHour}:${minute} ${ampm}`;
    }
    
    // If we can't parse it, don't show the raw datetime string
    // Just return empty or a placeholder
    if (timeStr.includes('1899')) {
      return 'Time not set';
    }
    
    return timeStr;
  };
  
  const handlePayment = async (e) => {
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsProcessingPayment(true);
    
    // Call the payment handler passed from parent
    if (onPayment) {
      await onPayment(job);
    } else {
      console.log('❌ No onPayment handler provided!');
    }
    
    setIsProcessingPayment(false);
  };

  const handleAddTime = async (timeOption) => {
    setIsProcessingAddTime(true);
    
    try {
      // Call the add time handler passed from parent
      if (onAddTime) {
        await onAddTime(job, timeOption);
        setShowAddTimeDropdown(false);
        
        // Refresh additional time cost
        if (getAdditionalTimeCost && job['Booking Reference']) {
          try {
            const result = await getAdditionalTimeCost(job['Booking Reference']);
            if (result.success) {
              setAdditionalTimeCost(result.totalCost || 0);
            }
          } catch (error) {
            console.error('Error refreshing additional time cost:', error);
          }
        }
        
        // Refresh the job data if onRefresh is available
        if (onRefresh) {
          await onRefresh();
        }
      } else {
        console.log('❌ No onAddTime handler provided!');
      }
    } catch (error) {
      console.error('Error adding time:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessingAddTime(false);
    }
  };

  const handleAddMaterials = async () => {
    if (!materialDescription.trim() || !materialCost.trim()) {
      alert('Please enter both description and cost');
      return;
    }

    const cost = parseFloat(materialCost);
    if (isNaN(cost) || cost <= 0) {
      alert('Please enter a valid cost');
      return;
    }

    setIsProcessingAddMaterials(true);
    
    try {
      // Call the add materials handler passed from parent
      if (onAddMaterials) {
        await onAddMaterials(job, {
          description: materialDescription.trim(),
          cost: cost
        });
        setShowAddMaterialsDropdown(false);
        setMaterialDescription('');
        setMaterialCost('');
        
        // Refresh materials cost
        if (getMaterialsCost && job['Booking Reference']) {
          try {
            const result = await getMaterialsCost(job['Booking Reference']);
            if (result.success) {
              setMaterialsCost(result.totalCost || 0);
            }
          } catch (error) {
            console.error('Error refreshing materials cost:', error);
          }
        }
        
        // Refresh the job data if onRefresh is available
        if (onRefresh) {
          await onRefresh();
        }
      } else {
        console.log('❌ No onAddMaterials handler provided!');
      }
    } catch (error) {
      console.error('Error adding materials:', error);
      alert('Error adding materials. Please try again.');
    } finally {
      setIsProcessingAddMaterials(false);
    }
  };
  
  const needsPayment = actualStatus === 'completed_unpaid';
  const isUrgent = job['Urgent Flag'] === 'URGENT';
  
  // Determine card border color based on status
  const getBorderColor = () => {
    switch (actualStatus) {
      case 'in_progress':
        return 'border-orange-300';
      case 'completed_unpaid':
        return 'border-red-300';
      case 'completed_paid':
        return 'border-green-300';
      default:
        return 'border-gray-100';
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${getBorderColor()} relative`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 overflow-hidden rounded-t-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-lg">
                  Job #{job['Booking Reference']}
                </h3>
                {isUrgent && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded animate-pulse">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {job['Service']}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-medium">{formatDate(job['Date'])}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{formatTime(job['Time'])}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{job['Price']}</span>
              {loadingAdditionalCost ? (
                <span className="text-xs text-gray-500">
                  <Loader className="w-3 h-3 inline animate-spin mr-1" />
                  Loading additional costs...
                </span>
              ) : additionalTimeCost > 0 ? (
                <span className="text-xs text-green-600 font-medium">
                  +${additionalTimeCost.toFixed(2)} (additional time)
                </span>
              ) : null}
              {loadingMaterialsCost ? (
                <span className="text-xs text-gray-500">
                  <Loader className="w-3 h-3 inline animate-spin mr-1" />
                  Loading materials costs...
                </span>
              ) : materialsCost > 0 ? (
                <span className="text-xs text-blue-600 font-medium">
                  +${materialsCost.toFixed(2)} (materials)
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-900">{job['Deposit Paid']}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 truncate">{job['Name']}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 overflow-visible">
        {/* Progress Section - Show prominently if there's active progress */}
        {progressInfo.message && progressInfo.message !== 'Scheduled' && (
          <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getProgressBadge() && (
                  <>
                    {React.createElement(getProgressBadge().Icon, { 
                      className: `w-5 h-5 ${getProgressBadge().textColor}` 
                    })}
                    <span className={`font-semibold ${getProgressBadge().textColor}`}>
                      {progressInfo.status}
                    </span>
                  </>
                )}
              </div>
              {progressInfo.hasImage && (
                <button
                  onClick={() => setShowProgressImage(true)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Image className="w-4 h-4" />
                  View Photo
                </button>
              )}
            </div>
            
            {/* Progress Bar */}
            {progressInfo.percentage !== null && progressInfo.percentage > 0 && (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{progressInfo.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      progressInfo.percentage === 100 
                        ? 'bg-green-500' 
                        : progressInfo.percentage >= 75 
                        ? 'bg-blue-500' 
                        : progressInfo.percentage >= 50 
                        ? 'bg-cyan-500' 
                        : progressInfo.percentage >= 25 
                        ? 'bg-yellow-500' 
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${progressInfo.percentage}%` }}
                  >
                    <div className="h-full bg-white/20 animate-shimmer"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Progress Message */}
            <p className="text-sm text-gray-700">{progressInfo.message}</p>
          </div>
        )}
        
        {/* Location */}
        {job['Address'] && (
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-700">{job['Address']}</p>
          </div>
        )}
        
        {/* Description Preview */}
        {/* {job['Description'] && (
          <div className="mb-4">
            <p className="text-gray-700 line-clamp-2">
              {job['Description']}
            </p>
          </div>
        )} */}
        
        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
            {/* Full Description */}
            {job['Description'] && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                <p className="text-sm text-gray-700">{job['Description']}</p>
              </div>
            )}
            
            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Customer Email:</span>
                <p className="font-medium text-gray-900">{job['Email']}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <p className="font-medium text-gray-900">{job['Phone']}</p>
              </div>
              {job['Estimate Reference'] && (
                <div>
                  <span className="text-gray-500">From Estimate:</span>
                  <p className="font-medium text-gray-900">{job['Estimate Reference']}</p>
                </div>
              )}
              {job['Event ID'] && (
                <div>
                  <span className="text-gray-500">Calendar Event:</span>
                  <p className="font-medium text-gray-900 text-xs truncate">
                    {job['Event ID']}
                  </p>
                </div>
              )}
            </div>
            
            {/* Status Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Booking Status:</span>
                  <p className="font-medium text-gray-900">{job['Status'] || 'Confirmed'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Payment Status:</span>
                  <p className="font-medium text-gray-900">{job['Payment Status'] || 'Pending'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Deposit Paid:</span>
                  <p className="font-medium text-gray-900">{job['Deposit Paid'] || 'Pending'}</p>
                </div>
              </div>
            </div>
            
            {/* Customer Images */}
            {customerImages.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Photos</h4>
                <div className="flex gap-2 flex-wrap">
                  {customerImages.slice(0, 3).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowImageGallery(true);
                      }}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
                    >
                      <img 
                        src={image} 
                        alt={`Customer photo ${index + 1}`}
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
        <div className="mt-4">
          {/* Action buttons row */}
          <div className="flex justify-end items-center gap-2 mb-2">
            {/* Add Time dropdown - show for in progress or completed jobs */}
            {(actualStatus === 'in_progress' || actualStatus === 'completed_unpaid' || actualStatus === 'completed_paid') && (
              <div className="relative">
                <button
                  onClick={() => setShowAddTimeDropdown(!showAddTimeDropdown)}
                  disabled={isProcessingAddTime}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingAddTime ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Time
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAddTimeDropdown ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                
                {/* Dropdown menu */}
                {showAddTimeDropdown && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                    <button
                      onClick={() => handleAddTime({ duration: 30, cost: 35 })}
                      disabled={isProcessingAddTime}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">30 Minutes</div>
                          <div className="text-sm text-gray-600">Additional half hour</div>
                        </div>
                        <div className="font-bold text-green-600">+$35</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAddTime({ duration: 60, cost: 70 })}
                      disabled={isProcessingAddTime}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-b-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">1 Hour</div>
                          <div className="text-sm text-gray-600">Additional full hour</div>
                        </div>
                        <div className="font-bold text-green-600">+$70</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Add Materials dropdown - show for in progress or completed jobs */}
            {(actualStatus === 'in_progress' || actualStatus === 'completed_unpaid' || actualStatus === 'completed_paid') && (
              <div className="relative">
                <button
                  onClick={() => setShowAddMaterialsDropdown(!showAddMaterialsDropdown)}
                  disabled={isProcessingAddMaterials}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingAddMaterials ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4" />
                      Add Mat'ls
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAddMaterialsDropdown ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                
                {/* Dropdown menu */}
                {showAddMaterialsDropdown && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[250px] p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                        <input
                          type="text"
                          value={materialDescription}
                          onChange={(e) => setMaterialDescription(e.target.value)}
                          placeholder="e.g., Paint, screws, lumber"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          disabled={isProcessingAddMaterials}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost:</label>
                        <input
                          type="number"
                          value={materialCost}
                          onChange={(e) => setMaterialCost(e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          disabled={isProcessingAddMaterials}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleAddMaterials}
                          disabled={isProcessingAddMaterials || !materialDescription.trim() || !materialCost.trim()}
                          className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Material
                        </button>
                        <button
                          onClick={() => {
                            setShowAddMaterialsDropdown(false);
                            setMaterialDescription('');
                            setMaterialCost('');
                          }}
                          disabled={isProcessingAddMaterials}
                          className="px-3 py-2 text-gray-600 text-sm hover:text-gray-900 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {needsPayment && (
              <button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-subtle"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </>
                )}
              </button>
            )}
            
            {actualStatus === 'completed_paid' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Paid</span>
              </div>
            )}
          </div>
          
          {/* View Details button - separate row on small screens */}
          <div className="flex justify-start">
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
          </div>
        </div>
      </div>
      
      {/* Progress Image Modal */}
      {showProgressImage && progressInfo.hasImage && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setShowProgressImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg">
            <button
              onClick={() => setShowProgressImage(false)}
              className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronDown className="w-6 h-6 rotate-180" />
            </button>
            <img 
              src={progressInfo.imageUrl} 
              alt="Progress update"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-medium">{progressInfo.message}</p>
              {progressInfo.percentage && (
                <p className="text-white/80 text-sm">Progress: {progressInfo.percentage}%</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Customer Image Gallery Modal */}
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
                alt={`Customer photo ${selectedImageIndex + 1}`}
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
                      index === selectedImageIndex ? 'border-white scale-110' : 'border-gray-600 opacity-70 hover:opacity-100'
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
    </div>
  );
};

export default JobCard;
