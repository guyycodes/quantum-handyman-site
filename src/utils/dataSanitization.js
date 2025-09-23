/**
 * Data Sanitization Utility
 * Provides moderate sanitization and validation for user inputs
 * Protects against XSS, SQL injection, and ensures data quality
 */

/**
 * Sanitize general text input - removes dangerous characters but allows normal text
 * @param {string} text - Text to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text, options = {}) => {
  const {
    allowNewlines = true,
    maxLength = 5000,
    trimWhitespace = true
  } = options;
  
  if (!text || typeof text !== 'string') return '';
  
  let sanitized = text;
  
  // Remove any HTML tags and scripts
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<[^>]+>/g, '');
  
  // Remove dangerous characters while preserving normal punctuation
  // Allow: letters, numbers, spaces, common punctuation, and some special chars
  const allowedPattern = allowNewlines 
    ? /[^a-zA-Z0-9\s\-.,!?'"():;@#$%&*+=_/\\\n\r]/g
    : /[^a-zA-Z0-9\s\-.,!?'"():;@#$%&*+=_/\\]/g;
  
  sanitized = sanitized.replace(allowedPattern, '');
  
  // Remove multiple spaces/newlines in a row
  sanitized = sanitized.replace(/\s+/g, ' ');
  if (allowNewlines) {
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n'); // Max 2 newlines in a row
  }
  
  // Trim if requested
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }
  
  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Validate and format email address
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, sanitized: string, error?: string }
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email is required' };
  }
  
  // Basic sanitization - lowercase and trim
  let sanitized = email.toLowerCase().trim();
  
  // Remove any obviously dangerous characters
  sanitized = sanitized.replace(/[<>'"]/g, '');
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(sanitized);
  
  // Additional checks
  if (isValid) {
    // Check for reasonable length
    if (sanitized.length > 254) { // Max email length per RFC
      return { isValid: false, sanitized, error: 'Email address is too long' };
    }
    
    // Check for double dots
    if (sanitized.includes('..')) {
      return { isValid: false, sanitized, error: 'Email contains invalid characters' };
    }
    
    // Check domain has at least one dot after @
    const [, domain] = sanitized.split('@');
    if (!domain || !domain.includes('.')) {
      return { isValid: false, sanitized, error: 'Invalid email domain' };
    }
  }
  
  return {
    isValid,
    sanitized,
    error: isValid ? undefined : 'Please enter a valid email address'
  };
};

/**
 * Validate and format phone number (US format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, sanitized: string, formatted: string, error?: string }
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, sanitized: '', formatted: '', error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check for valid US phone number (10 digits, optional 1 prefix)
  let sanitized = digitsOnly;
  
  // Remove country code if present
  if (sanitized.length === 11 && sanitized.startsWith('1')) {
    sanitized = sanitized.substring(1);
  }
  
  // Validate length
  if (sanitized.length !== 10) {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Please enter a valid 10-digit phone number'
    };
  }
  
  // Check for valid area code and exchange (not starting with 0 or 1)
  const areaCode = sanitized.substring(0, 3);
  const exchange = sanitized.substring(3, 6);
  
  if (areaCode[0] === '0' || areaCode[0] === '1') {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid area code'
    };
  }
  
  if (exchange[0] === '0' || exchange[0] === '1') {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid phone number format'
    };
  }
  
  // Format as (XXX) XXX-XXXX
  const formatted = `(${areaCode}) ${exchange}-${sanitized.substring(6)}`;
  
  return {
    isValid: true,
    sanitized,
    formatted,
    error: undefined
  };
};

/**
 * Validate and sanitize address (Google Maps compatible format)
 * @param {string} address - Address to validate
 * @returns {Object} { isValid: boolean, sanitized: string, error?: string }
 */
export const sanitizeAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return { isValid: false, sanitized: '', error: 'Address is required' };
  }
  
  // Basic sanitization
  let sanitized = address.trim();
  
  // Remove dangerous characters but keep address-valid ones
  // Allow: letters, numbers, spaces, commas, periods, hyphens, #, and newlines
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-.,#\n\r'/]/g, '');
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // Remove multiple newlines
  sanitized = sanitized.replace(/\n{2,}/g, '\n');
  
  // Check minimum length
  if (sanitized.length < 10) {
    return {
      isValid: false,
      sanitized,
      error: 'Please enter a complete address'
    };
  }
  
  // Check maximum length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }
  
  // Check for basic address components (very loose check)
  // Should have at least a number or street name and some additional info
  const hasNumber = /\d/.test(sanitized);
  const hasLetters = /[a-zA-Z]{3,}/.test(sanitized); // At least 3 consecutive letters
  const hasMultipleWords = sanitized.split(/\s+/).length >= 3; // At least 3 words
  
  // For US addresses, check for state abbreviation or zip code patterns
  const hasStateOrZip = /\b[A-Z]{2}\b|\b\d{5}\b/.test(sanitized.toUpperCase());
  
  const isValid = hasLetters && hasMultipleWords;
  
  if (!isValid) {
    return {
      isValid: false,
      sanitized,
      error: 'Please enter a complete address including street and city'
    };
  }
  
  // Check for common PO Box formats (if you want to restrict them)
  const isPOBox = /^(p\.?o\.?\s?box|post\s?office\s?box)/i.test(sanitized);
  
  return {
    isValid: true,
    sanitized,
    isPOBox, // Include this info in case you want to handle PO Boxes differently
    error: undefined
  };
};

/**
 * Sanitize name input
 * @param {string} name - Name to sanitize
 * @returns {Object} { isValid: boolean, sanitized: string, error?: string }
 */
export const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Name is required' };
  }
  
  // Basic sanitization
  let sanitized = name.trim();
  
  // Remove dangerous characters but keep name-valid ones
  // Allow: letters, spaces, hyphens, apostrophes, periods
  sanitized = sanitized.replace(/[^a-zA-Z\s\-'.]/g, '');
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // Check minimum length
  if (sanitized.length < 2) {
    return {
      isValid: false,
      sanitized,
      error: 'Name must be at least 2 characters'
    };
  }
  
  // Check maximum length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  
  // Check that it contains at least one letter
  if (!/[a-zA-Z]/.test(sanitized)) {
    return {
      isValid: false,
      sanitized,
      error: 'Name must contain letters'
    };
  }
  
  // Capitalize first letter of each word
  sanitized = sanitized.replace(/\b\w/g, char => char.toUpperCase());
  
  return {
    isValid: true,
    sanitized,
    error: undefined
  };
};

/**
 * Sanitize project description
 * @param {string} description - Description to sanitize
 * @returns {Object} { isValid: boolean, sanitized: string, error?: string }
 */
export const sanitizeProjectDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return { isValid: false, sanitized: '', error: 'Project description is required' };
  }
  
  // Use general text sanitization with specific options
  const sanitized = sanitizeText(description, {
    allowNewlines: true,
    maxLength: 2000,
    trimWhitespace: true
  });
  
  // Check minimum length
  if (sanitized.length < 10) {
    return {
      isValid: false,
      sanitized,
      error: 'Please provide at least 10 characters describing your project'
    };
  }
  
  // Check for suspicious patterns that might indicate spam or malicious content
  const suspiciousPatterns = [
    /(.)\1{10,}/g, // Same character repeated 10+ times
    /(https?:\/\/|www\.)[^\s]+/gi, // URLs (you may want to allow these)
    /\b(click here|viagra|casino|lottery)\b/gi // Common spam words
  ];
  
  let isSuspicious = false;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      isSuspicious = true;
      break;
    }
  }
  
  return {
    isValid: !isSuspicious,
    sanitized,
    isSuspicious,
    error: isSuspicious ? 'Description contains invalid content' : undefined
  };
};

/**
 * Sanitize estimate reference
 * @param {string} ref - Estimate reference to sanitize
 * @returns {Object} { isValid: boolean, sanitized: string, error?: string }
 */
export const sanitizeEstimateRef = (ref) => {
  if (!ref || typeof ref !== 'string') {
    return { isValid: true, sanitized: '', error: undefined }; // Optional field
  }
  
  // Remove all non-alphanumeric characters except hyphens
  let sanitized = ref.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
  
  // Check format (EST-XXXXXX or similar)
  const isValid = /^[A-Z]{2,4}-?\d{4,8}$/.test(sanitized) || sanitized === '';
  
  return {
    isValid,
    sanitized,
    error: isValid ? undefined : 'Invalid estimate reference format'
  };
};

/**
 * Batch sanitize all customer form data
 * @param {Object} formData - Form data object
 * @returns {Object} { isValid: boolean, sanitized: Object, errors: Object }
 */
export const sanitizeCustomerFormData = (formData) => {
  const errors = {};
  const sanitized = {};
  
  // Sanitize name
  const nameResult = sanitizeName(formData.name);
  sanitized.name = nameResult.sanitized;
  if (!nameResult.isValid) errors.name = nameResult.error;
  
  // Sanitize email
  const emailResult = sanitizeEmail(formData.email);
  sanitized.email = emailResult.sanitized;
  if (!emailResult.isValid) errors.email = emailResult.error;
  
  // Sanitize phone
  const phoneResult = sanitizePhone(formData.phone);
  sanitized.phone = phoneResult.formatted || phoneResult.sanitized;
  if (!phoneResult.isValid) errors.phone = phoneResult.error;
  
  // Sanitize address
  const addressResult = sanitizeAddress(formData.address);
  sanitized.address = addressResult.sanitized;
  if (!addressResult.isValid) errors.address = addressResult.error;
  
  // Sanitize description
  const descResult = sanitizeProjectDescription(formData.description || formData.projectDescription);
  sanitized.description = descResult.sanitized;
  if (!descResult.isValid) errors.description = descResult.error;
  
  // Sanitize estimate ref if present
  if (formData.estimateRef) {
    const refResult = sanitizeEstimateRef(formData.estimateRef);
    sanitized.estimateRef = refResult.sanitized;
    if (!refResult.isValid) errors.estimateRef = refResult.error;
  }
  
  // Keep images as-is (handled separately with compression)
  sanitized.images = formData.images || [];
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    isValid,
    sanitized,
    errors
  };
};

// Export all functions as default object too
export default {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  sanitizeAddress,
  sanitizeName,
  sanitizeProjectDescription,
  sanitizeEstimateRef,
  sanitizeCustomerFormData
};
