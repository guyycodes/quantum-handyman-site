import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, FileText, Camera, AlertCircle } from 'lucide-react';

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
    photos: {
      label: 'Photos (Optional)',
      uploadText: 'Click to upload photos',
      maxSizeText: 'Max 5MB per image',
      uploadButton: 'Upload'
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
    images: []
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = CONTENT.fields.name.error;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = CONTENT.fields.email.error;
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s()+-]+$/;
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone || cleanedPhone.length < 10) {
      newErrors.phone = CONTENT.fields.phone.error;
    }
    
    // Address validation
    if (!formData.address || formData.address.length < 10) {
      newErrors.address = CONTENT.fields.address.error;
    }
    
    // Description validation
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = CONTENT.fields.description.error;
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
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
    const validFiles = [];
    const previews = [...imagePreview];
    
    for (const file of files) {
      if (file.size > maxSize) {
        alert(CONTENT.validation.fileTooLarge(file.name));
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(CONTENT.validation.notImage(file.name));
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
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    onSubmit(formData);
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
    
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
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.name 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.name.placeholder}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
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
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.email 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.email.placeholder}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
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
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.phone 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.phone.placeholder}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
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
              rows={3}
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.address 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.address.placeholder}
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.address}
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
              rows={4}
              className={`
                w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${errors.description 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
              placeholder={CONTENT.fields.description.placeholder}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {CONTENT.fields.photos.label}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center justify-center py-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">{CONTENT.fields.photos.uploadText}</span>
              <span className="text-xs text-gray-500 mt-1">{CONTENT.fields.photos.maxSizeText}</span>
            </label>
            
            {/* Image Previews */}
            {imagePreview.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
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
