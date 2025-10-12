const chatbotResponses = {
  // Greeting responses for natural conversation
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'],
    responses: [
      "Hello! Welcome to Quantum Technician! 🔧",
      "Hi there! Ready to fix, build, or improve your space?",
      "Hey! Great to have you here today!",
      "Hello! Thanks for reaching out to Quantum Technician!"
    ],
    followUp: "How can I help with your home repair or improvement needs today?"
  },

  // Casual conversation starters
  casualResponses: {
    'how are you': "I'm doing great, thank you for asking! I'm here to help you with all your technician needs.",
    'what can you do': "I can help you book a service, learn about our repair and installation services, get a quote, or answer any questions about home improvements.",
    'who are you': "I'm your Quantum Technician assistant! We're a new kind of technician for your property & technology needs. Craftsman + CS-degree. No collars. Just capability.",
    'thanks': "You're very welcome! Is there anything else I can help you with?",
    'thank you': "My pleasure! Let me know if you need anything else!",
    'what services': "We offer home repairs, smart home automation, web development, landscaping, and more. From traditional technician work to tech solutions - we handle it all. What do you need help with?",
    'emergency': "For emergencies, I can help you get immediate assistance. Let me know what's happening!",
    'urgent': "I understand this is urgent. Let me help you get the fastest service possible."
  },

  // Main service categories that we can directly help with
  primaryServices: [
    {
      id: 'booking',
      label: 'Book a Service',
      description: 'Schedule a visit for property repairs, tech solutions, or installations',
      definitiveKeywords: ['book', 'schedule', 'appointment', 'visit', 'come', 'available', 'when can', 'book service', 'how do i book', 'how to book', 'make booking', 'reserve'],
      supportiveKeywords: ['today', 'tomorrow', 'week', 'asap', 'soon', 'urgent', 'emergency', 'broken', 'install', 'fix', 'repair'],
      minKeywordMatches: 1,
      confirmationMessage: 'Great! I can help you with booking.',
      actionMessage: 'Book directly through our secure platform for a seamless booking and job management experience. You can customize service & make secure payments & track jobs all in one place.',
      redirectPath: '/contact',
      buttonText: 'Book Service',
      externalLink: true
    },
    {
      id: 'services',
      label: 'View Services',
      description: 'Explore all our technician and repair services',
      definitiveKeywords: ['services', 'what do you do', 'repairs', 'electrical', 'plumbing', 'carpentry', 'painting', 'installation', 'maintenance'],
      supportiveKeywords: ['fix', 'install', 'repair', 'replace', 'build', 'mount', 'assemble', 'renovate'],
      minKeywordMatches: 1,
      confirmationMessage: 'I\'d be happy to show you all our services.',
      actionMessage: 'Let me direct you to our services page where you can see everything we offer.',
      redirectPath: '/services',
      buttonText: 'View All Services'
    },
    {
      id: 'quote',
      label: 'Get a Quote',
      description: 'Get an estimate for your project',
      definitiveKeywords: ['quote', 'estimate', 'price', 'cost', 'how much', 'pricing', 'rates', 'charge', 'fee'],
      supportiveKeywords: ['project', 'job', 'work', 'service', 'repair', 'installation', 'budget'],
      minKeywordMatches: 1,
      confirmationMessage: 'I can help you get a quote for your project.',
      actionMessage: 'I\'ll take you to our contact form where you can describe your project and get a custom quote.',
      redirectPath: '/contact',
      buttonText: 'Get Free Quote'
    },
    {
      id: 'portfolio',
      label: 'View Our Work',
      description: 'See examples of completed projects',
      definitiveKeywords: ['portfolio', 'work', 'projects', 'examples', 'gallery', 'photos', 'previous', 'completed', 'showcase'],
      supportiveKeywords: ['see', 'show', 'view', 'look', 'quality', 'before after', 'results'],
      minKeywordMatches: 1,
      confirmationMessage: 'I\'ll show you our portfolio of completed projects.',
      actionMessage: 'Check out our gallery of successful home improvements and repairs.',
      redirectPath: '/portfolio',
      buttonText: 'View Portfolio'
    }
  ],

  // Clarifying questions to ask when intent is unclear
  clarifyingQuestions: {
    initial: "I'd love to help! What specifically do you need assistance with today?",
    whenUnclear: "I want to make sure I point you in the right direction. Could you tell me a bit more about your home improvement needs?",
    options: [
      {
        id: 'booking_clarify',
        label: '📅 Schedule a Service',
        description: 'Book a technician visit',
        leadToService: 'booking'
      },
      {
        id: 'quote_clarify',
        label: '💬 Get a Quote',
        description: 'Describe your project for an estimate',
        leadToService: 'support_ticket'
      },
      {
        id: 'services_clarify', 
        label: '🔧 View Services',
        description: 'See what we offer',
        leadToService: 'services'
      },
      {
        id: 'emergency_clarify',
        label: '🚨 Emergency Help',
        description: 'Urgent repair needed',
        leadToService: 'support_ticket'
      },
      {
        id: 'other_clarify',
        label: '❓ Other Question',
        description: 'General inquiry or support',
        leadToService: 'support_ticket'
      }
    ]
  },

  // Support ticket configuration
  supportTicket: {
    introduction: "I'll help you create a service request so our team can assist you directly.",
    confirmationMessage: "Thank you! Your service request has been created. Our team will contact you within 2-4 hours.",
    complaintConfirmationMessage: "Your complaint has been escalated to our management team. We take service quality seriously and will contact you within 1 hour to address your concerns.",
    emergencyConfirmationMessage: "Your emergency request has been submitted. We'll call you within 30 minutes to arrange immediate assistance.",
    fields: [
      {
        id: 'name',
        label: 'Your Name',
        type: 'text',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '(555) 123-4567',
        required: true
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
        required: true
      },
      {
        id: 'address',
        label: 'Service Address',
        type: 'text',
        placeholder: 'Where do you need service?',
        required: true
      },
      {
        id: 'serviceType',
        label: 'Service Type',
        type: 'select',
        required: true,
        options: [
          { value: 'electrical', label: 'Electrical' },
          { value: 'plumbing', label: 'Plumbing' },
          { value: 'carpentry', label: 'Carpentry' },
          { value: 'painting', label: 'Painting' },
          { value: 'appliance', label: 'Appliance Installation' },
          { value: 'general', label: 'General Repair' },
          { value: 'emergency', label: 'Emergency Repair' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'urgency',
        label: 'Urgency',
        type: 'select',
        required: true,
        options: [
          { value: 'emergency', label: 'Emergency (ASAP)' },
          { value: 'urgent', label: 'Urgent (Within 24 hours)' },
          { value: 'normal', label: 'Normal (Within a week)' },
          { value: 'flexible', label: 'Flexible timing' }
        ]
      },
      {
        id: 'description',
        label: 'Describe the Issue',
        type: 'textarea',
        placeholder: 'Please describe what needs to be fixed or installed...',
        required: true
      }
    ]
  },

  // Emergency/Problem detection keywords
  emergencyKeywords: ['emergency', 'urgent', 'asap', 'immediately', 'right now', 'flooding', 'leak', 'no power', 'no electricity', 'broken pipe', 'gas leak'],
  complaintKeywords: ['terrible service', 'awful', 'disappointed', 'frustrated', 'upset', 'complaint', 'unhappy', 'dissatisfied', 'poor service', 'bad job', 'not satisfied', 'unsatisfied', 'unacceptable'],
  generalHelpKeywords: ['i need help', 'need help', 'help me', 'can you help', 'need assistance', 'need support', 'help please'],
  serviceRequestKeywords: ['problem', 'issue', 'not working', 'broken', 'damaged', 'need fixed', 'need repair', 'fix', 'repair'],

  // Special booking-related responses
  bookingInfo: {
    standardResponse: "We're a new kind of technician - combining traditional craftsmanship with tech expertise. Book directly through our platform where you can:",
    features: [
      "✅ Choose your service type",
      "📅 Pick a convenient time slot", 
      "🔒 Make secure payments",
      "📱 Track your booking status"
    ],
    ctaText: "Click below to book your service through our trusted partner:",
    tipText: "💡 Tip: Create an account to track all your bookings and receive service updates"
  },

  // Generate response based on user input
  generateResponse(userMessage, currentStage = 'initial') {
    const lowerMessage = userMessage.toLowerCase();
    const words = lowerMessage.split(/\s+/);

    // Always check for booking-related questions first (even in follow-up conversations)
    const isBookingQuestion = [
      'how do i book', 'how to book', 'how can i book', 
      'where do i book', 'where to book', 'book a service',
      'make a booking', 'schedule service', 'make appointment',
      'book online', 'booking process', 'how does booking work'
    ].some(phrase => lowerMessage.includes(phrase));

    if (isBookingQuestion) {
      return {
        type: 'booking_info',
        message: this.bookingInfo.standardResponse,
        features: this.bookingInfo.features,
        ctaText: this.bookingInfo.ctaText,
        tipText: this.bookingInfo.tipText,
        service: this.primaryServices[0] // booking service
      };
    }

    // Check for emergency situations
    const isEmergency = this.emergencyKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isEmergency) {
      return {
        type: 'emergency',
        message: "Note: If your facing a life impacting emergency, please call 911.",
        followUp: "If this is not a life impacting, please fill out the form below so we can help you as soon as possible."
      };
    }

    // Check for general help requests first
    const isGeneralHelp = this.generalHelpKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isGeneralHelp) {
      return {
        type: 'clarification',
        message: "I'm here to help! What would you like assistance with today?",
        showOptions: true
      };
    }

    // Check for greetings
    const isGreeting = this.greetings.keywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isGreeting && words.length <= 3) {
      const randomResponse = this.greetings.responses[Math.floor(Math.random() * this.greetings.responses.length)];
      return {
        type: 'greeting',
        message: randomResponse,
        followUp: this.greetings.followUp
      };
    }

    // Check for casual responses
    for (const [key, response] of Object.entries(this.casualResponses)) {
      if (lowerMessage.includes(key)) {
        return {
          type: 'casual',
          message: response
        };
      }
    }

    // Check for service request needs (not complaints)
    const isServiceRequest = this.serviceRequestKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isServiceRequest) {
      return {
        type: 'clarification',
        message: "I can help you with that repair or service need. What would you like to do?",
        showOptions: true
      };
    }

    // Check for complaints (actual dissatisfaction with service)
    const isComplaint = this.complaintKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isComplaint) {
      return {
        type: 'complaint',
        message: "I'm sorry to hear you're not satisfied with our service.",
        followUp: "Let me help you address this concern right away."
      };
    }

    // Check for definitive service matches
    for (const service of this.primaryServices) {
      // Check for definitive keywords
      const hasDefinitiveKeyword = service.definitiveKeywords.some(keyword => 
        lowerMessage.includes(keyword)
      );

      if (hasDefinitiveKeyword) {
        return {
          type: 'definitive',
          service: service,
          message: service.confirmationMessage
        };
      }

      // Check for supportive keywords
      const supportiveMatches = service.supportiveKeywords.filter(keyword => 
        lowerMessage.includes(keyword)
      ).length;

      if (supportiveMatches >= service.minKeywordMatches) {
        return {
          type: 'clarification_with_suggestions',
          message: this.clarifyingQuestions.initial,
          suggestions: [{
            id: service.id + '_clarify',
            label: service.label,
            description: service.description,
            leadToService: service.id
          }]
        };
      }
    }

    // If no clear intent, ask for clarification
    if (words.length < 5) {
      return {
        type: 'clarification',
        message: this.clarifyingQuestions.whenUnclear,
        showOptions: false
      };
    }

    return {
      type: 'clarification',
      message: this.clarifyingQuestions.initial,
      showOptions: true
    };
  },

  // Get service by ID
  getServiceById(serviceId) {
    return this.primaryServices.find(service => service.id === serviceId);
  },

  // Validate support ticket
  validateSupportTicket(formData) {
    const errors = [];
    
    // Check required fields
    this.supportTicket.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        errors.push(`${field.label} is required`);
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone format (basic check)
    if (formData.phone && !/^[\d\s()+-]+$/.test(formData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
};

export default chatbotResponses;
