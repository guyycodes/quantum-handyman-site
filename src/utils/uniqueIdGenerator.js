/**
 * Unique ID Generator Utility
 * Generates collision-resistant unique identifiers with custom prefixes
 * Designed to handle thousands of IDs per day without collisions
 */

// Store last generated timestamp to ensure uniqueness even in same millisecond
let lastTimestamp = 0;
let sequence = 0;

/**
 * Generate a unique ID with the specified prefix
 * Uses timestamp + random + sequence for collision resistance
 * 
 * @param {string} prefix - The prefix to use (e.g., 'EST', 'QH')
 * @returns {string} Unique identifier like 'EST-240923-7A3F-042'
 */
export const generateUniqueId = (prefix = 'ID') => {
  const now = Date.now();
  
  // Reset sequence if we're in a new millisecond
  if (now !== lastTimestamp) {
    sequence = 0;
    lastTimestamp = now;
  } else {
    sequence++;
  }
  
  // Create date component (YYMMDD format - 6 chars)
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Create time component (4 chars hex from timestamp)
  // This gives us ~65k unique values that cycle throughout the day
  const timeComponent = (now % 65536).toString(16).toUpperCase().padStart(4, '0');
  
  // Add random component for extra collision resistance (3 chars)
  const randomComponent = Math.floor(Math.random() * 4096).toString(16).toUpperCase().padStart(3, '0');
  
  // Add sequence if needed (for multiple IDs in same millisecond)
  const sequenceStr = sequence > 0 ? `-${sequence}` : '';
  
  // Format: PREFIX-YYMMDD-XXXX-XXX[sequence]
  // Example: EST-240923-7A3F-B2C or EST-240923-7A3F-B2C-1
  return `${prefix}-${dateStr}-${timeComponent}-${randomComponent}${sequenceStr}`;
};

/**
 * Generate an estimate reference number
 * @returns {string} Unique estimate reference like 'EST-240923-7A3F-042'
 */
export const generateEstimateRef = () => {
  return generateUniqueId('EST');
};

/**
 * Generate a booking reference number
 * @returns {string} Unique booking reference like 'QH-240923-8B4E-A31'
 */
export const generateBookingRef = () => {
  return generateUniqueId('QH');
};

/**
 * Generate a support ticket reference
 * @returns {string} Unique ticket reference like 'TKT-240923-9C5D-F42'
 */
export const generateTicketRef = () => {
  return generateUniqueId('TKT');
};

/**
 * Generate a shorter unique ID with prefix (backwards compatible)
 * This maintains similar length to your original but with better uniqueness
 * 
 * @param {string} prefix - The prefix to use
 * @returns {string} Shorter unique ID like 'EST-7A3FB2C'
 */
export const generateShortUniqueId = (prefix = 'ID') => {
  const now = Date.now();
  
  // Use more bits from timestamp (last 7 digits in base 36)
  const timeStr = (now % 78364164096).toString(36).toUpperCase(); // ~7 chars
  
  // Add random component (3 chars in base 36)
  const randomStr = Math.floor(Math.random() * 46656).toString(36).toUpperCase().padStart(3, '0');
  
  // Format: PREFIX-XXXXXXX
  // Example: EST-K4M8N2P or QH-L5N9O3Q
  return `${prefix}-${timeStr}${randomStr}`;
};

/**
 * Validate if an ID matches expected format
 * @param {string} id - The ID to validate
 * @param {string} expectedPrefix - Expected prefix
 * @returns {boolean} True if valid
 */
export const isValidId = (id, expectedPrefix = null) => {
  if (!id || typeof id !== 'string') return false;
  
  // Check basic format (PREFIX-XXXXXXX...)
  const parts = id.split('-');
  if (parts.length < 2) return false;
  
  // Check prefix if specified
  if (expectedPrefix && parts[0] !== expectedPrefix) return false;
  
  // Check that after prefix there's actual content
  const contentAfterPrefix = parts.slice(1).join('-');
  if (contentAfterPrefix.length < 6) return false;
  
  return true;
};

/**
 * Extract prefix from an ID
 * @param {string} id - The ID to parse
 * @returns {string|null} The prefix or null if invalid
 */
export const extractPrefix = (id) => {
  if (!id || typeof id !== 'string') return null;
  const parts = id.split('-');
  return parts.length >= 2 ? parts[0] : null;
};

/**
 * Parse date from new format IDs
 * @param {string} id - The ID to parse  
 * @returns {Date|null} Date object or null if not parseable
 */
export const parseDateFromId = (id) => {
  if (!id || typeof id !== 'string') return null;
  
  const parts = id.split('-');
  // Check if it's the new format (PREFIX-YYMMDD-...)
  if (parts.length >= 3 && parts[1].length === 6) {
    const dateStr = parts[1];
    const year = parseInt('20' + dateStr.slice(0, 2));
    const month = parseInt(dateStr.slice(2, 4)) - 1; // Months are 0-indexed
    const day = parseInt(dateStr.slice(4, 6));
    
    const date = new Date(year, month, day);
    // Validate the date is real
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  return null;
};

// Export all functions as default object too
export default {
  generateUniqueId,
  generateEstimateRef,
  generateBookingRef,
  generateTicketRef,
  generateShortUniqueId,
  isValidId,
  extractPrefix,
  parseDateFromId
};
