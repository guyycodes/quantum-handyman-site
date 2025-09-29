import emailjs from 'emailjs-com';

// Initialize EmailJS with your public key
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

// Email templates configuration
const EMAIL_TEMPLATES = {
  CONTACT_FORM: 'contact_form',
  SUPPORT_TICKET: 'support_ticket'
};

// Email service configuration
const EMAIL_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  toEmail: import.meta.env.VITE_EMAILJS_TO_EMAIL,
  templates: {
    contactForm: import.meta.env.VITE_EMAILJS_DEFAULT_TEMPLATE_ID,
    supportTicket: import.meta.env.VITE_EMAILJS_DEFAULT_TEMPLATE_ID,
    booking: import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID
  },
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};

/**
 * Send a contact form email
 * @param {Object} formData - The contact form data
 * @param {string} formData.name - Sender's name
 * @param {string} formData.email - Sender's email
 * @param {string} formData.phone - Sender's phone (optional)
 * @param {string} formData.service - Service type (optional)
 * @param {string} formData.message - Message content
 * @returns {Promise} EmailJS response
 */
export const sendContactEmail = async (formData) => {
  try {
    // Initialize EmailJS if not already done
    initEmailJS();

    const templateParams = {
      from_name: formData.name,
      to_email: EMAIL_CONFIG.toEmail,
      reply_to: formData.email,
      phone: formData.phone || "Not provided",
      service_type: formData.service || "Not specified",
      message: formData.message
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templates.contactForm,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    return {
      success: true,
      response
    };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email'
    };
  }
};

/**
 * Send a support ticket email
 * @param {Object} ticketData - The support ticket data
 * @param {string} ticketData.ticketId - Unique ticket ID
 * @param {string} ticketData.name - Customer's name
 * @param {string} ticketData.email - Customer's email
 * @param {string} ticketData.phone - Customer's phone
 * @param {string} ticketData.address - Service address
 * @param {string} ticketData.serviceType - Type of service needed
 * @param {string} ticketData.urgency - Urgency level
 * @param {string} ticketData.description - Issue description
 * @param {string} ticketData.type - Ticket type (normal/complaint/emergency)
 * @returns {Promise} EmailJS response
 */
export const sendSupportTicketEmail = async (ticketData) => {
  try {
    // Initialize EmailJS if not already done
    initEmailJS();

    // Format the urgency for display
    const urgencyLabels = {
      emergency: '🚨 EMERGENCY (ASAP)',
      urgent: '⚠️ URGENT (Within 24 hours)',
      normal: 'Normal (Within a week)',
      flexible: 'Flexible timing'
    };

    // Format the service type for display
    const serviceTypeLabels = {
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      carpentry: 'Carpentry',
      painting: 'Painting',
      appliance: 'Appliance Installation',
      general: 'General Repair',
      emergency: 'Emergency Repair',
      other: 'Other'
    };

    // Create a formatted message with all ticket details
    const formattedMessage = `
=== SUPPORT TICKET ${ticketData.ticketId} ===

Type: ${ticketData.type ? ticketData.type.toUpperCase() : 'NORMAL'}
Urgency: ${urgencyLabels[ticketData.urgency] || ticketData.urgency}

CUSTOMER INFORMATION:
Name: ${ticketData.name}
Email: ${ticketData.email}
Phone: ${ticketData.phone}
Address: ${ticketData.address}

SERVICE DETAILS:
Service Type: ${serviceTypeLabels[ticketData.serviceType] || ticketData.serviceType}

DESCRIPTION:
${ticketData.description}

---
Submitted via: Quantum Handyman AI Assistant
Time: ${new Date().toLocaleString()}
    `.trim();

    const templateParams = {
      ticket_id: ticketData.ticketId,
      from_name: ticketData.name,
      to_email: EMAIL_CONFIG.toEmail,
      reply_to: ticketData.email,
      phone: ticketData.phone,
      address: ticketData.address,
      service_type: serviceTypeLabels[ticketData.serviceType] || ticketData.serviceType,
      urgency: urgencyLabels[ticketData.urgency] || ticketData.urgency,
      ticket_type: ticketData.type ? ticketData.type.toUpperCase() : 'NORMAL',
      message: ticketData.description,
      full_details: formattedMessage
    };

    // Use the support ticket template if available, otherwise use the contact form template
    const templateId = EMAIL_CONFIG.templates.supportTicket;

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      templateId,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    return {
      success: true,
      response,
      ticketId: ticketData.ticketId
    };
  } catch (error) {
    console.error('Support Ticket Email Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send support ticket'
    };
  }
};

/**
 * Validate email configuration
 * @returns {Object} Configuration status
 */
export const validateEmailConfig = () => {
  const missing = [];
  
  if (!EMAIL_CONFIG.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
  if (!EMAIL_CONFIG.toEmail) missing.push('VITE_EMAILJS_TO_EMAIL');
  if (!EMAIL_CONFIG.templates.contactForm) missing.push('VITE_EMAILJS_TEMPLATE_ID');
  if (!EMAIL_CONFIG.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');

  return {
    isValid: missing.length === 0,
    missing,
    hasSupport: !!EMAIL_CONFIG.templates.supportTicket
  };
};

/**
 * Format phone number for display
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not standard US format
  return phone;
};

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  // Allow digits, spaces, parentheses, hyphens, and plus sign
  const phoneRegex = /^[\d\s()+-]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Send a booking confirmation email
 * @param {Object} bookingData - The booking data
 * @param {Object} bookingData.service - Selected service details
 * @param {string} bookingData.date - Booking date
 * @param {Object} bookingData.timeSlot - Selected time slot
 * @param {Object} bookingData.customerInfo - Customer information
 * @returns {Promise} EmailJS response
 */
export const sendBookingEmail = async (bookingData) => {
  try {
    // Initialize EmailJS if not already done
    initEmailJS();

    const { service, date, timeSlot, customerInfo, bookingRef, isUrgent } = bookingData;
    
    // Format the date
    const bookingDate = new Date(date + 'T00:00:00');
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Use the booking reference passed in (generated in BookingModal)
    const finalBookingRef = bookingRef;

    // Create calendar event details for the Add to Calendar link
    const calendarStartDate = new Date(date + 'T' + timeSlot.value);
    const calendarEndDate = new Date(calendarStartDate);
    calendarEndDate.setHours(calendarEndDate.getHours() + service.duration);
    
    // Format dates for Google Calendar URL (YYYYMMDDTHHmmSS)
    const formatCalendarDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    const calendarDateRange = `${formatCalendarDate(calendarStartDate)}/${formatCalendarDate(calendarEndDate)}`;
    const calendarDetails = `Service: ${service.name}%0APrice: ${service.price}%0AAddress: ${customerInfo.address || 'TBD'}%0APhone: ${customerInfo.phone}%0ADescription: ${encodeURIComponent((customerInfo.description || 'No description provided').substring(0, 200)).replace(/%20/g, '+')}`;

    // Create the email content - MUST match EmailJS template variables exactly
    const templateParams = {
      // Standard EmailJS fields
      from_name: customerInfo.name,
      to_email: customerInfo.email,
      to_name: customerInfo.name,  // Some templates use to_name
      user_email: customerInfo.email,  // Alternative parameter name
      reply_to: EMAIL_CONFIG.toEmail,
      
      // Booking details - these MUST match your EmailJS template variables
      booking_ref: finalBookingRef,
      customer_name: customerInfo.name,
      request_type: isUrgent ? 'URGENT Appointment' : 'Appointment',
      service_name: service.name,
      booking_date: formattedDate,
      booking_time: timeSlot.display,
      service_duration: `${service.duration} hour${service.duration > 1 ? 's' : ''}`,
      service_price: isUrgent ? `${service.price} $35 Urgent Premium` : service.price,
      customer_address: customerInfo.address,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      project_description: customerInfo.description || 'No description provided',
      estimate_ref: customerInfo.estimateRef || '', // Include estimate reference if this booking came from an estimate
      
      // Calendar link variables
      calendar_date: calendarDateRange,
      calendar_details: calendarDetails,
      
      // Image tracking (if any)
      has_images: customerInfo.images && customerInfo.images.length > 0 ? 'Yes' : 'No',
      image_count: customerInfo.images?.length || 0,
      image_note: customerInfo.images && customerInfo.images.length > 0 
        ? `${customerInfo.images.length} image(s) uploaded - Available in Project Portal`
        : 'No images uploaded'
    };

    // Use booking template if available, otherwise use contact template
    const templateId = EMAIL_CONFIG.templates.booking

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      templateId,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    // NOTE: Admin notification is now handled via CC in the EmailJS template
    // This avoids sending duplicate emails
    // Make sure your EmailJS template has CC: hello@quantumhandyman.com

    return {
      success: true,
      response,
      bookingRef: finalBookingRef
    };
  } catch (error) {
    console.error('Booking Email Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send booking confirmation'
    };
  }
};

/**
 * Send an estimate request email
 * @param {Object} estimateData - The estimate request data
 * @param {Object} estimateData.service - Selected service (estimate)
 * @param {Object} estimateData.customerInfo - Customer information
 * @returns {Promise} EmailJS response
 */
export const sendEstimateRequestEmail = async (estimateData) => {
  try {
    // Initialize EmailJS if not already done
    initEmailJS();

    const { service, customerInfo, estimateRef, isAiEstimate, aiEstimateResult } = estimateData;

    // Format the current date for estimate request
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Format the current time
    const bookingTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    // Use the estimate reference passed in (generated in BookingModal)
    const finalEstimateRef = estimateRef

    // Create calendar event details for estimates
    // For estimates, we'll create an all-day reminder to review the estimate
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // Set to 9 AM tomorrow
    const dayAfter = new Date(tomorrow);
    dayAfter.setHours(10, 0, 0, 0); // 1 hour duration
    
    // Format dates for Google Calendar URL (YYYYMMDDTHHmmSS)
    const formatCalendarDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    // Create calendar date range for tomorrow 9-10 AM (review estimate time)
    const calendarDateRange = `${formatCalendarDate(tomorrow)}/${formatCalendarDate(dayAfter)}`;
    
    // Create detailed calendar description with estimate info
    const calendarDetails = isAiEstimate && aiEstimateResult?.success ? 
      `Estimate Ref: ${finalEstimateRef}%0A` +
      `Type: AI Generated Estimate%0A` +
      `Price Range: ${aiEstimateResult.price}%0A` +
      `Customer: ${customerInfo.name}%0A` +
      `Phone: ${customerInfo.phone}%0A` +
      `Email: ${customerInfo.email}%0A` +
      `Address: ${customerInfo.address || 'TBD'}%0A` +
      `%0AProject Description:%0A${encodeURIComponent((customerInfo.description || '').substring(0, 200)).replace(/%20/g, '+')}%0A` +
      `%0AAction Required:%0A` +
      `- Review this estimate%0A` +
      `- Contact customer to discuss%0A` +
      `- Schedule service if approved%0A` +
      `%0AView full details at: quantumhandyman.com/portal`
      : 
      `Estimate Ref: ${finalEstimateRef}%0A` +
      `Type: Manual Estimate Request%0A` +
      `Customer: ${customerInfo.name}%0A` +
      `Phone: ${customerInfo.phone}%0A` +
      `Email: ${customerInfo.email}%0A` +
      `Address: ${customerInfo.address || 'TBD'}%0A` +
      `%0AProject Description:%0A${encodeURIComponent((customerInfo.description || '').substring(0, 200)).replace(/%20/g, '+')}%0A` +
      `%0AAction Required:%0A` +
      `- Prepare manual estimate%0A` +
      `- Contact customer with pricing%0A` +
      `- Schedule service if approved%0A` +
      `%0AView full details at: quantumhandyman.com/portal`;

    // Create the base template parameters
    const templateParams = {
      // Standard EmailJS fields
      from_name: customerInfo.name,
      to_email: EMAIL_CONFIG.toEmail,
      to_name: customerInfo.name, 
      user_email: customerInfo.email, 
      reply_to: customerInfo.email,
      
      // Estimate details - these MUST match your EmailJS template variables
      booking_ref: finalEstimateRef,
      customer_name: customerInfo.name,
      request_type: isAiEstimate && aiEstimateResult.success ? 'Ai Generated Estimate' : 'Service Estimate',
      service_name: "Estimate",
      // Request timestamp
      booking_date: formattedDate,
      booking_time: bookingTime,
      service_duration: 'Estimate',
      service_price: isAiEstimate && aiEstimateResult.success ? 
        `${aiEstimateResult.price}` : `(Pending...)`,
      customer_address: customerInfo.address || 'Not provided',
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      project_description: isAiEstimate && aiEstimateResult.success ? 
        `${aiEstimateResult.jobDescription}\n\n(Disclaimer:\nThis AI-generated estimate is based on provided details & can vary ±(60%). AI can miss nuance—consult your service provider for comprehensive review. Final pricing varies based on materials, complexity, permits, and unforeseen conditions.)` 
        : customerInfo.description || 'No description provided',

      // Calendar link variables
      calendar_date: calendarDateRange,
      calendar_details: calendarDetails,
      
      // Image tracking (if any)
      has_images: customerInfo.images && customerInfo.images.length > 0 ? 'Yes' : 'No',
      image_count: customerInfo.images?.length || 0,
      image_note: customerInfo.images && customerInfo.images.length > 0 
        ? `${customerInfo.images.length} image(s) uploaded - Available in Project Portal`
        : 'No images uploaded'
    };

    // Always use the booking template (as per user requirement)
    const templateId = EMAIL_CONFIG.templates.booking;

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      templateId,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    return {
      success: true,
      response,
      estimateRef: finalEstimateRef
    };
  } catch (error) {
    console.error('Estimate Request Email Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send estimate request'
    };
  }
};

// Export everything as a service object as well
const emailService = {
  sendContactEmail,
  sendSupportTicketEmail,
  sendBookingEmail,
  sendEstimateRequestEmail,
  validateEmailConfig,
  formatPhoneNumber,
  isValidEmail,
  isValidPhone,
  EMAIL_TEMPLATES,
  EMAIL_CONFIG
};

export default emailService;
