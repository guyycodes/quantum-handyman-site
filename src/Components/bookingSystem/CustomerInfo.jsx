import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, FileText, Camera, AlertCircle } from 'lucide-react';
import { 
  sanitizeName, 
  sanitizeEmail, 
  sanitizePhone, 
  sanitizeAddress, 
  sanitizeProjectDescription,
  sanitizeEstimateRef,
  sanitizeCustomerFormData 
} from '../../utils/dataSanitization';
import { testImageCompression } from '../../utils/imageCompression';

// Content Management - All text content in one place
const CONTENT = {
  title: 'Your Information',
  fields: {
    name: {
      label: 'Full Name *',
      placeholder: 'John Doe',
      error: 'Please enter your full name'
    },
    email: {
      label: 'Email Address *',
      placeholder: 'john@example.com',
      error: 'Please enter a valid email address'
    },
    phone: {
      label: 'Phone Number *',
      placeholder: '(555) 123-4567',
      error: 'Please enter a valid phone number'
    },
    address: {
      label: 'Service Address *',
      placeholder: '123 Main Street\nCity, State ZIP',
      error: 'Please enter your complete address'
    },
    description: {
      label: 'Project Description *',
      placeholder: 'Please describe what needs to be done. Include any specific requirements or concerns...',
      error: 'Please describe your project (minimum 10 characters)'
    },
    estimateRef: {
      label: 'Estimate Reference Number',
      placeholder: 'e.g. EST-250928-252E-9EB',
      helpText: 'Enter the estimate reference number here. Note: AI Generated estimates can vary.'
    },
    photos: {
      label: 'Photos (Optional)',
      uploadText: 'Click to upload photos',
      maxSizeText: 'Max 5MB per image • Max 3 photos',
      uploadButton: 'Upload',
      maxImagesReached: 'Maximum 3 images allowed'
    }
  },
  validation: {
    fileTooLarge: (fileName) => `${fileName} is too large. Maximum size is 5MB.`,
    notImage: (fileName) => `${fileName} is not an image file.`
  },
  button: {
    submit: 'Continue to Review'
  }
};

const CustomerInfo = ({ onSubmit, initialData, service }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    estimateRef: '',
    images: []
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const [touched, setTouched] = useState({});  // Track which fields have been interacted with
  const [realtimeErrors, setRealtimeErrors] = useState({});  // Real-time validation errors
  
  // Generate previews for existing images on component mount
  useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      const generatePreviews = async () => {
        const previews = [];
        for (const file of initialData.images) {
          if (file instanceof File) {
            const reader = new FileReader();
            await new Promise((resolve) => {
              reader.onload = (e) => {
                previews.push({
                  name: file.name,
                  url: e.target.result
                });
                resolve();
              };
              reader.readAsDataURL(file);
            });
          }
        }
        setImagePreview(previews);
      };
      generatePreviews();
    }
  }, []); // Only run on mount

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation with sanitization
    const nameResult = sanitizeName(formData.name);
    if (!nameResult.isValid) {
      newErrors.name = nameResult.error || CONTENT.fields.name.error;
    }
    
    // Email validation with sanitization
    const emailResult = sanitizeEmail(formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error || CONTENT.fields.email.error;
    }
    
    // Phone validation with sanitization
    const phoneResult = sanitizePhone(formData.phone);
    if (!phoneResult.isValid) {
      newErrors.phone = phoneResult.error || CONTENT.fields.phone.error;
    }
    
    // Address validation with sanitization
    const addressResult = sanitizeAddress(formData.address);
    if (!addressResult.isValid) {
      newErrors.address = addressResult.error || CONTENT.fields.address.error;
    }
    if (addressResult.isPOBox && service?.id !== 'estimate') {
      // Optionally warn about PO Box for service appointments
      newErrors.address = 'Service address cannot be a PO Box';
    }
    
    // Description validation with sanitization
    const descResult = sanitizeProjectDescription(formData.description);
    if (!descResult.isValid) {
      newErrors.description = descResult.error || CONTENT.fields.description.error;
    }
    
    // Estimate ref validation if present
    if (formData.estimateRef) {
      const refResult = sanitizeEstimateRef(formData.estimateRef);
      if (!refResult.isValid) {
        newErrors.estimateRef = refResult.error || 'Invalid estimate reference';
      }
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    let realtimeError = '';
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Apply field-specific sanitization and real-time validation
    switch(name) {
      case 'name':
        // Light sanitization during typing - allow spaces but remove dangerous characters
        processedValue = value.replace(/[<>{}]/g, '');
        // Only validate length and basic requirements during typing
        if (value.length > 0 && value.trim().length === 0) {
          realtimeError = 'Name cannot be only spaces';
        } else if (value.length > 0 && value.trim().length < 2) {
          realtimeError = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        // For email, light processing but validate format
        processedValue = value.trim();
        // Show error after @ is typed or complete email
        if (value.includes('@') || value.length > 5) {
          const emailResult = sanitizeEmail(value);
          if (!emailResult.isValid) {
            realtimeError = emailResult.error;
          }
        }
        break;
      case 'address':
        // Light sanitization for address during typing
        processedValue = value.replace(/[<>{}]/g, '');
        // Show validation hint after enough content (15+ chars)
        if (value.length > 15) {
          const addressResult = sanitizeAddress(value);
          if (!addressResult.isValid) {
            realtimeError = addressResult.error;
          }
        }
        break;
      case 'description':
        // Light sanitization for description during typing
        processedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        if (value.length > 0 && value.length < 10) {
          realtimeError = 'Description must be at least 10 characters';
        }
        break;
      case 'estimateRef':
        // Convert to uppercase and keep only valid chars (letters, numbers, hyphens)
        processedValue = value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
        // Only validate if they've typed something
        if (value.length > 0) {
          const refResult = sanitizeEstimateRef(processedValue);
          if (!refResult.isValid) {
            realtimeError = 'Format: EST-XXXXXX-XXXX-XXX';
          }
        }
        break;
      default:
        processedValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Update real-time validation error
    setRealtimeErrors(prev => ({
      ...prev,
      [name]: realtimeError
    }));
    
    // Clear submit error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxImages = 3; // Maximum 3 images allowed
    
    // Check if we already have 3 images
    if (formData.images.length >= maxImages) {
      alert(CONTENT.fields.photos.maxImagesReached);
      e.target.value = ''; // Reset file input
      return;
    }
    
    const remainingSlots = maxImages - formData.images.length;
    const filesToProcess = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}. Maximum 3 images allowed.`);
    }
    
    const validFiles = [];
    const previews = [...imagePreview];
    
    for (const file of filesToProcess) {
      if (file.size > maxSize) {
        alert(CONTENT.validation.fileTooLarge(file.name));
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(CONTENT.validation.notImage(file.name));
        continue;
      }
      
      // Test if image can be compressed successfully
      const compressionTest = await testImageCompression(file);
      if (!compressionTest.success) {
        alert(`❌ ${file.name}\n\n${compressionTest.error}\n\nTip: Try a smaller resolution image or crop the image before uploading.`);
        continue;
      }
      
      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({
          name: file.name,
          url: e.target.result
        });
        setImagePreview([...previews]);
      };
      reader.readAsDataURL(file);
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    
    // Reset file input
    e.target.value = '';
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sanitize all form data before validation and submission
    const sanitizationResult = sanitizeCustomerFormData(formData);
    
    if (!sanitizationResult.isValid) {
      setErrors(sanitizationResult.errors);
      // Scroll to first error
      const firstErrorField = Object.keys(sanitizationResult.errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    // Update form data with sanitized values
    const sanitizedData = {
      ...sanitizationResult.sanitized,
      images: formData.images // Keep images as-is
    };
    
    // Submit the sanitized data
    onSubmit(sanitizedData);
  };

  const handlePhoneChange = (e) => {
    const phoneResult = sanitizePhone(e.target.value);
    
    // Mark as touched
    if (!touched.phone) {
      setTouched(prev => ({ ...prev, phone: true }));
    }
    
    // Use the formatted phone if valid, otherwise keep what user typed
    const phoneValue = phoneResult.isValid ? phoneResult.formatted : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      phone: phoneValue
    }));
    
    // Update real-time error for phone
    if (!phoneResult.isValid && e.target.value.length > 0) {
      setRealtimeErrors(prev => ({
        ...prev,
        phone: phoneResult.error
      }));
    } else {
      setRealtimeErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
    
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" />
        {CONTENT.title}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {CONTENT.fields.name.label}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={(e) => {
                // Fully sanitize name on blur
                const nameResult = sanitizeName(e.target.value);
                if (nameResult.sanitized !== e.target.value) {
                  setFormData(prev => ({
                    ...prev,
                    name: nameResult.sanitized
                  }));
                }
                // Update error state if invalid after sanitization
                if (!nameResult.isValid) {
                  setRealtimeErrors(prev => ({
                    ...prev,
                    name: nameResult.error
                  }));
                } else {
                  setRealtimeErrors(prev => ({
                    ...prev,
                    name: ''
                  }));
                }
              }}
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                ${(errors.name || realtimeErrors.name)
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.name.placeholder}
            />
          </div>
          {(errors.name || realtimeErrors.name) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name || realtimeErrors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {CONTENT.fields.email.label}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={(e) => {
                // Sanitize email on blur
                const emailResult = sanitizeEmail(e.target.value);
                if (emailResult.sanitized !== e.target.value) {
                  setFormData(prev => ({
                    ...prev,
                    email: emailResult.sanitized
                  }));
                }
              }}
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                ${(errors.email || realtimeErrors.email)
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.email.placeholder}
            />
          </div>
          {(errors.email || realtimeErrors.email) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email || realtimeErrors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            {CONTENT.fields.phone.label}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                ${(errors.phone || realtimeErrors.phone)
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.phone.placeholder}
            />
          </div>
          {(errors.phone || realtimeErrors.phone) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone || realtimeErrors.phone}
            </p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            {CONTENT.fields.address.label}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onBlur={(e) => {
                // Fully sanitize address on blur
                const addressResult = sanitizeAddress(e.target.value);
                if (addressResult.sanitized !== e.target.value) {
                  setFormData(prev => ({
                    ...prev,
                    address: addressResult.sanitized
                  }));
                }
              }}
              rows={3}
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                ${(errors.address || realtimeErrors.address)
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.address.placeholder}
            />
          </div>
          {(errors.address || realtimeErrors.address) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.address || realtimeErrors.address}
            </p>
          )}
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            {CONTENT.fields.description.label}
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              onBlur={(e) => {
                // Fully sanitize description on blur
                const descResult = sanitizeProjectDescription(e.target.value);
                if (descResult.sanitized !== e.target.value) {
                  setFormData(prev => ({
                    ...prev,
                    description: descResult.sanitized
                  }));
                }
              }}
              rows={4}
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                ${(errors.description || realtimeErrors.description)
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.description.placeholder}
            />
          </div>
          {(errors.description || realtimeErrors.description) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.description || realtimeErrors.description}
            </p>
          )}
        </div>

        {/* Estimate Reference Number - Only show for bookings, not for estimate requests */}
        {service && service.id !== 'estimate' && (
          <div>
            <label htmlFor="estimateRef" className="block text-sm font-medium text-gray-700 mb-2">
              {CONTENT.fields.estimateRef.label}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="estimateRef"
                name="estimateRef"
                value={formData.estimateRef}
                onChange={handleInputChange}
                className={`
                  w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${realtimeErrors.estimateRef
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }
                `}
                placeholder={CONTENT.fields.estimateRef.placeholder}
              />
            </div>
            {realtimeErrors.estimateRef ? (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {realtimeErrors.estimateRef}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                {CONTENT.fields.estimateRef.helpText}
              </p>
            )}
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {CONTENT.fields.photos.label}
            {formData.images.length > 0 && (
              <span className="ml-2 text-xs text-gray-500">
                ({formData.images.length}/3 uploaded)
              </span>
            )}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={formData.images.length >= 3}
            />
            <label
              htmlFor="images"
              className={`
                flex flex-col items-center justify-center py-4 rounded-lg transition-colors
                ${formData.images.length >= 3 
                  ? 'cursor-not-allowed bg-gray-100' 
                  : 'cursor-pointer hover:bg-gray-50'
                }
              `}
            >
              <Camera className={`w-8 h-8 mb-2 ${formData.images.length >= 3 ? 'text-gray-300' : 'text-gray-400'}`} />
              <span className={`text-sm ${formData.images.length >= 3 ? 'text-gray-400' : 'text-gray-600'}`}>
                {formData.images.length >= 3 ? CONTENT.fields.photos.maxImagesReached : CONTENT.fields.photos.uploadText}
              </span>
              <span className="text-xs text-gray-500 mt-1">{CONTENT.fields.photos.maxSizeText}</span>
            </label>
            
            {/* Image Previews */}
            {imagePreview.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-3">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                        Image {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {formData.images.length < 3 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    You can add {3 - formData.images.length} more image{3 - formData.images.length === 1 ? '' : 's'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {CONTENT.button.submit}
        </button>
      </form>
    </div>
  );
};

export default CustomerInfo;
