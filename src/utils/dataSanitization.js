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
 * Validate and format email address with strict RFC-compliant validation
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
  
  // More strict email validation regex
  // Ensures proper format with all required components
  const emailRegex = /^[a-z0-9][a-z0-9._%-+]*[a-z0-9]@[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/;
  
  // First check basic structure
  if (!sanitized.includes('@')) {
    return {
      isValid: false,
      sanitized,
      error: 'Email must include @ symbol'
    };
  }
  
  const parts = sanitized.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      sanitized,
      error: 'Email can only contain one @ symbol'
    };
  }
  
  const [localPart, domainPart] = parts;
  
  if (localPart.length === 0) {
    return {
      isValid: false,
      sanitized,
      error: 'Email must have username before @'
    };
  }
  
  if (domainPart.length === 0) {
    return {
      isValid: false,
      sanitized,
      error: 'Email must have domain after @'
    };
  }
  
  if (!domainPart.includes('.')) {
    return {
      isValid: false,
      sanitized,
      error: 'Email domain must include extension (e.g., .com)'
    };
  }
  
  // Check for invalid patterns
  if (sanitized.includes('..')) {
    return {
      isValid: false,
      sanitized,
      error: 'Email cannot contain consecutive dots'
    };
  }
  
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      sanitized,
      error: 'Email username cannot start or end with a dot'
    };
  }
  
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return {
      isValid: false,
      sanitized,
      error: 'Invalid email domain format'
    };
  }
  
  if (domainPart.startsWith('-') || domainPart.endsWith('-')) {
    return {
      isValid: false,
      sanitized,
      error: 'Domain cannot start or end with hyphen'
    };
  }
  
  // Length checks
  if (sanitized.length > 254) {
    return {
      isValid: false,
      sanitized,
      error: 'Email address is too long (max 254 characters)'
    };
  }
  
  if (localPart.length > 64) {
    return {
      isValid: false,
      sanitized,
      error: 'Email username is too long (max 64 characters)'
    };
  }
  
  // Domain extension check
  const domainExtension = domainPart.split('.').pop();
  if (domainExtension.length < 2) {
    return {
      isValid: false,
      sanitized,
      error: 'Invalid domain extension'
    };
  }
  
  // Check for common typos
  const commonTypos = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',  
    'gamil.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'iclod.com': 'icloud.com'
  };
  
  for (const [typo, correct] of Object.entries(commonTypos)) {
    if (domainPart === typo) {
      return {
        isValid: false,
        sanitized,
        error: `Did you mean ${localPart}@${correct}?`
      };
    }
  }
  
  // Check for test/fake emails
  const fakePatterns = [
    /^test@test/,
    /^admin@admin/,
    /^user@user/,
    /^email@email/,
    /^nobody@/,
    /^noreply@/,
    /^fake@/,
    /^xxx/
  ];
  
  for (const pattern of fakePatterns) {
    if (pattern.test(sanitized)) {
      return {
        isValid: false,
        sanitized,
        error: 'Please enter your actual email address'
      };
    }
  }
  
  // Final regex validation
  if (!emailRegex.test(sanitized)) {
    return {
      isValid: false,
      sanitized,
      error: 'Please enter a valid email address (e.g., name@example.com)'
    };
  }
  
  return {
    isValid: true,
    sanitized,
    error: undefined
  };
};

/**
 * Validate and format phone number (US format) with strict validation
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
  } else if (sanitized.length === 11) {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid country code (US numbers start with 1 if 11 digits)'
    };
  }
  
  // Validate length
  if (sanitized.length !== 10) {
    if (sanitized.length < 10) {
      return {
        isValid: false,
        sanitized,
        formatted: phone,
        error: `Phone number too short (${sanitized.length}/10 digits)`
      };
    }
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Phone number too long (US numbers are 10 digits)'
    };
  }
  
  // Parse components
  const areaCode = sanitized.substring(0, 3);
  const exchange = sanitized.substring(3, 6);
  const subscriber = sanitized.substring(6, 10);
  
  // Area code validation (NANP rules)
  if (areaCode[0] === '0' || areaCode[0] === '1') {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid area code (cannot start with 0 or 1)'
    };
  }
  
  // Exchange validation (NANP rules)
  if (exchange[0] === '0' || exchange[0] === '1') {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid exchange (middle 3 digits cannot start with 0 or 1)'
    };
  }
  
  // Check for N11 service codes (reserved numbers)
  if (areaCode[1] === '1' && areaCode[2] === '1') {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid area code (N11 codes are reserved for services)'
    };
  }
  
  if (exchange[1] === '1' && exchange[2] === '1') {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid exchange (N11 codes are reserved)'
    };
  }
  
  // Check for fake/invalid patterns
  const invalidPatterns = [
    /^(\d)\1{9}$/,           // All same digit (e.g., 5555555555)
    /^(012|123|234|345|456|567|678|789|890|901)/,  // Sequential at start
    /^555(01\d{2})$/         // Hollywood numbers (555-0100 to 555-0199)
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(sanitized)) {
      return {
        isValid: false,
        sanitized,
        formatted: phone,
        error: 'Please enter a real phone number (not a test/fake number)'
      };
    }
  }
  
  // Check for known fake area codes
  const fakeAreaCodes = ['555', '123', '000', '999', '111'];
  if (fakeAreaCodes.includes(areaCode)) {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Invalid area code (not assigned)'
    };
  }
  
  // Check for 555 exchange (except 555-0100 through 555-0199 which are fictional)
  if (exchange === '555') {
    const lastFour = parseInt(subscriber);
    if (lastFour < 100 || lastFour > 199) {
      return {
        isValid: false,
        sanitized,
        formatted: phone,
        error: 'Invalid phone number (555 exchange is reserved)'
      };
    }
  }
  
  // Check for patterns that are likely fake
  if (subscriber === '0000' || subscriber === '1234' || subscriber === '1111') {
    return {
      isValid: false,
      sanitized,
      formatted: phone,
      error: 'Please enter a valid phone number'
    };
  }
  
  // Format as (XXX) XXX-XXXX
  const formatted = `(${areaCode}) ${exchange}-${subscriber}`;
  
  return {
    isValid: true,
    sanitized,
    formatted,
    error: undefined
  };
};

/**
 * Validate and sanitize address (Google Maps compatible format)
 * Requires: Street Address, City, State, ZIP
 * @param {string} address - Address to validate
 * @returns {Object} { isValid: boolean, sanitized: string, error?: string, components?: Object }
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
  if (sanitized.length < 20) {
    return {
      isValid: false,
      sanitized,
      error: 'Please enter a complete address including street, city, state, and ZIP'
    };
  }
  
  // Check maximum length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }
  
  // Parse address components (strict validation)
  const addressUpper = sanitized.toUpperCase();
  
  // Check for street address (must have number and street name)
  const hasStreetNumber = /^\d+/.test(sanitized) || /\b\d+\b/.test(sanitized.split(/[\n,]/)[0]);
  const hasStreetName = /\d+\s+[a-zA-Z]+/.test(sanitized) || /[a-zA-Z]+\s+\d+/.test(sanitized); // Handles both "123 Main" and "Main 123"
  
  if (!hasStreetNumber || !hasStreetName) {
    return {
      isValid: false,
      sanitized,
      error: 'Please include a valid street number and street name'
    };
  }
  
  // Check for US state (2-letter abbreviation or full state name)
  const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  
  const stateNames = [
    'ALABAMA', 'ALASKA', 'ARIZONA', 'ARKANSAS', 'CALIFORNIA', 'COLORADO',
    'CONNECTICUT', 'DELAWARE', 'FLORIDA', 'GEORGIA', 'HAWAII', 'IDAHO',
    'ILLINOIS', 'INDIANA', 'IOWA', 'KANSAS', 'KENTUCKY', 'LOUISIANA',
    'MAINE', 'MARYLAND', 'MASSACHUSETTS', 'MICHIGAN', 'MINNESOTA',
    'MISSISSIPPI', 'MISSOURI', 'MONTANA', 'NEBRASKA', 'NEVADA',
    'NEW HAMPSHIRE', 'NEW JERSEY', 'NEW MEXICO', 'NEW YORK',
    'NORTH CAROLINA', 'NORTH DAKOTA', 'OHIO', 'OKLAHOMA', 'OREGON',
    'PENNSYLVANIA', 'RHODE ISLAND', 'SOUTH CAROLINA', 'SOUTH DAKOTA',
    'TENNESSEE', 'TEXAS', 'UTAH', 'VERMONT', 'VIRGINIA', 'WASHINGTON',
    'WEST VIRGINIA', 'WISCONSIN', 'WYOMING'
  ];
  
  // Check for state abbreviation or full name
  const hasStateAbbr = stateAbbreviations.some(state => 
    new RegExp(`\\b${state}\\b`).test(addressUpper)
  );
  
  const hasStateName = stateNames.some(state => 
    addressUpper.includes(state)
  );
  
  if (!hasStateAbbr && !hasStateName) {
    return {
      isValid: false,
      sanitized,
      error: 'Please include a valid US state (e.g., CO or Colorado)'
    };
  }
  
  // Check for ZIP code (5 digits or 5+4 format)
  const hasZipCode = /\b\d{5}(?:-\d{4})?\b/.test(sanitized);
  
  if (!hasZipCode) {
    return {
      isValid: false,
      sanitized,
      error: 'Please include a valid 5-digit ZIP code'
    };
  }
  
  // Check for city (at least 2 letters together that aren't part of state/street)
  // This is a basic check - hard to validate city names precisely
  const wordCount = sanitized.split(/[\s,]+/).filter(w => w.length > 0).length;
  if (wordCount < 5) { // Minimum: number, street, city, state, zip
    return {
      isValid: false,
      sanitized,
      error: 'Please include city name in your address'
    };
  }
  
  // Check for common PO Box formats
  const isPOBox = /^(p\.?o\.?\s?box|post\s?office\s?box)/i.test(sanitized);
  
  // Extract components for reference
  const zipMatch = sanitized.match(/\b(\d{5}(?:-\d{4})?)\b/);
  const stateMatch = stateAbbreviations.find(state => 
    new RegExp(`\\b${state}\\b`).test(addressUpper)
  );
  
  return {
    isValid: true,
    sanitized,
    isPOBox,
    components: {
      hasStreetAddress: hasStreetNumber && hasStreetName,
      hasCity: true, // Assumed if word count is sufficient
      state: stateMatch || 'Found',
      zipCode: zipMatch ? zipMatch[1] : null
    },
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
