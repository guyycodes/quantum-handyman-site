import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaRedo,
  FaCheckCircle,
  FaWrench,
  FaBolt,
  FaTools
} from 'react-icons/fa';
import chatbotResponses from '../utils/chatbotResponses';
import { sendSupportTicketEmail } from '../services/emailService';
import { generateTicketRef } from '../utils/uniqueIdGenerator';
import BookingModal from './BookingModal';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { sender: 'bot', text: 'Hello! I\'m your Quantum Handyman assistant. How can I help with your home repair or improvement needs today?', type: 'text' }
  ]);
  const [currentStage, setCurrentStage] = useState('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isComplaintTicket, setIsComplaintTicket] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const getThinkingDelay = () => {
    return Math.floor(Math.random() * 800) + 600;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setConversation(prev => [...prev, { sender: 'user', text: message, type: 'text' }]);
    const userMessage = message;
    setMessage('');

    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      
      // Always try to generate a proper response, passing the current stage
      const response = chatbotResponses.generateResponse(userMessage, currentStage);
      
      // If we get a valid response, handle it
      if (response && (response.type === 'booking_info' || currentStage === 'initial')) {
        handleBotResponse(response);
      } else if (currentStage !== 'initial' && currentStage !== 'support_ticket' && currentStage !== 'completed') {
        // For non-initial stages, provide a contextual response
        const followUpResponse = "I can help you with additional questions. You can also start a new conversation or create a service request.";
        setConversation(prev => [...prev, { 
          sender: 'bot', 
          text: followUpResponse,
          type: 'text'
        }]);
        
        // Show restart options
        setConversation(prev => [...prev, {
          sender: 'bot',
          text: 'Would you like to:',
          type: 'restart_options'
        }]);
      }
    }, getThinkingDelay());
  };

  const handleBotResponse = (response) => {
    const newMessages = [];
    
    // Handle booking info response type
    if (response.type === 'booking_info') {
      newMessages.push({ sender: 'bot', text: response.message, type: 'text' });
      
      if (response.features && response.features.length > 0) {
        newMessages.push({
          sender: 'bot',
          text: response.features.join('\n'),
          type: 'text'
        });
      }
      
      if (response.ctaText) {
        newMessages.push({ sender: 'bot', text: response.ctaText, type: 'text' });
      }
      
      if (response.service) {
        newMessages.push({
          sender: 'bot',
          text: '',
          type: 'booking_action',
          service: response.service
        });
      }
      
      if (response.tipText) {
        newMessages.push({
          sender: 'bot',
          text: response.tipText,
          type: 'tip'
        });
      }
      
      setCurrentStage('booking_shown');
    } else {
      // Default message handling
      newMessages.push({ sender: 'bot', text: response.message, type: 'text' });
    }

    if (response.type === 'greeting') {
      newMessages.push({
        sender: 'bot',
        text: response.followUp,
        type: 'text'
      });
    } else if (response.type === 'emergency') {
      setCurrentStage('support_ticket');
      setIsEmergency(true);
      
      newMessages.push({
        sender: 'bot',
        text: response.followUp,
        type: 'text'
      });
      
      newMessages.push({
        sender: 'bot',
        text: 'Please fill out the following information:',
        type: 'support_form'
      });
    } else if (response.type === 'complaint') {
      setCurrentStage('support_ticket');
      setIsComplaintTicket(true);
      
      newMessages.push({
        sender: 'bot',
        text: response.followUp,
        type: 'text'
      });
      
      newMessages.push({
        sender: 'bot',
        text: 'Please fill out the following information:',
        type: 'support_form'
      });
    } else if (response.type === 'definitive') {
      setCurrentStage('definitive');
      
      newMessages.push({
        sender: 'bot',
        text: response.service.actionMessage,
        type: 'action',
        service: response.service
      });
    } else if (response.type === 'clarification_with_suggestions') {
      setCurrentStage('clarifying');
      
      const allOptions = [
        ...response.suggestions,
        ...chatbotResponses.clarifyingQuestions.options.filter(
          option => !response.suggestions.find(s => s.id === option.leadToService)
        )
      ];
      
      newMessages.push({
        sender: 'bot',
        text: 'Please select the option that best matches what you need:',
        type: 'clarification_options',
        options: allOptions
      });
    } else if (response.type === 'clarification') {
      if (response.showOptions) {
        setCurrentStage('clarifying');
        
        newMessages.push({
          sender: 'bot',
          text: 'Here are the main ways I can help you:',
          type: 'clarification_options', 
          options: chatbotResponses.clarifyingQuestions.options
        });
      }
    }

    setConversation(prev => [...prev, ...newMessages]);
  };

  const handleClarificationClick = (option) => {
    setConversation(prev => [...prev, { 
      sender: 'user', 
      text: option.label, 
      type: 'selection',
      description: option.description 
    }]);

    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      
      if (option.leadToService === 'support_ticket') {
        setCurrentStage('support_ticket');
        setIsComplaintTicket(false);
        
        const newMessages = [
          { sender: 'bot', text: chatbotResponses.supportTicket.introduction, type: 'text' },
          { sender: 'bot', text: 'Please fill out the following information:', type: 'support_form' }
        ];
        
        setConversation(prev => [...prev, ...newMessages]);
      } else {
        const service = chatbotResponses.getServiceById(option.leadToService);
        if (service) {
          setCurrentStage('definitive');
          
          const newMessages = [
            { sender: 'bot', text: service.confirmationMessage, type: 'text' },
            { sender: 'bot', text: service.actionMessage, type: 'action', service: service }
          ];
          
          setConversation(prev => [...prev, ...newMessages]);
        }
      }
    }, getThinkingDelay());
  };

  const handleRedirect = (path) => {
    if (path) {
      // Check for booking-related paths
      if (path.includes('dandymen') || path.includes('book')) {
        setIsBookingModalOpen(true);
      } else if (path.startsWith('http://') || path.startsWith('https://')) {
        // Open external URLs in new tab
        window.open(path, '_blank', 'noopener,noreferrer');
      } else {
        navigate(path);
      }
      setIsOpen(false);
    }
  };

  const handleSupportTicketSubmit = async (formData) => {
    setIsSubmitting(true);
    
    const validation = chatbotResponses.validateSupportTicket(formData);
    
    if (!validation.isValid) {
      setConversation(prev => [...prev, {
        sender: 'bot',
        text: 'Please correct the following errors:\n' + validation.errors.join('\n'),
        type: 'error'
      }]);
      setIsSubmitting(false);
      return;
    }

    try {
      // Generate ticket ID
      const ticketId = generateTicketRef();
      
      // Determine ticket type
      let ticketType = 'normal';
      if (isEmergency) {
        ticketType = 'emergency';
      } else if (isComplaintTicket) {
        ticketType = 'complaint';
      }
      
      // Prepare email data - inject ticket ID into description
      const emailData = {
        ticketId: ticketId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        serviceType: formData.serviceType,
        urgency: formData.urgency,
        description: `[Ticket ID: ${ticketId}]\n\n${formData.description}\n\nAddress: ${formData.address}\n\nUrgency: ${formData.urgency}\n\nTicket Type: ${ticketType}`,
        type: ticketType
      };
      
      // Send email via email service
      const emailResult = await sendSupportTicketEmail(emailData);
      
      if (emailResult.success) {
        let confirmationMsg = chatbotResponses.supportTicket.confirmationMessage;
        
        if (isEmergency) {
          confirmationMsg = chatbotResponses.supportTicket.emergencyConfirmationMessage;
        } else if (isComplaintTicket) {
          confirmationMsg = chatbotResponses.supportTicket.complaintConfirmationMessage;
        }
          
        setConversation(prev => [...prev, {
          sender: 'bot',
          text: confirmationMsg,
          type: 'success'
        }, {
          sender: 'bot',
          text: `Your service request ID is: ${ticketId}`,
          type: 'ticket_confirmation',
          ticketId: ticketId
        }]);
        
        setCurrentStage('completed');
      } else {
        throw new Error(emailResult.error || 'Failed to send support ticket');
      }
    } catch (error) {
      console.error('Support Ticket Error:', error);
      setConversation(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, there was an error creating your service request. Please try again or contact us directly at (555) 123-4567.',
        type: 'error'
      }]);
    }
    
    setIsSubmitting(false);
  };

  const resetConversation = () => {
    setConversation([
      { sender: 'bot', text: 'Hello! I\'m your Quantum Handyman assistant. How can I help with your home repair or improvement needs today?', type: 'text' }
    ]);
    setCurrentStage('initial');
    setIsComplaintTicket(false);
    setIsEmergency(false);
    setIsThinking(false);
    setMessage('');
  };

  const SupportTicketForm = () => {
    const [formData, setFormData] = useState(
      isEmergency ? { urgency: 'emergency' } : isComplaintTicket ? { urgency: 'urgent' } : {}
    );
    
    const handleFormSubmit = (e) => {
      e.preventDefault();
      handleSupportTicketSubmit(formData);
    };

    const handleInputChange = (fieldId, value) => {
      setFormData(prev => ({
        ...prev,
        [fieldId]: value
      }));
    };

    return (
      <form onSubmit={handleFormSubmit} className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-blue-500/30 mb-2">
        {chatbotResponses.supportTicket.fields.map((field) => (
          <div key={field.id} className="mb-3">
            {field.type === 'select' ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {field.label} {field.required && '*'}
                </label>
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">Select...</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={3}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaBolt className="text-sm" />
                Submit Request
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetConversation}
            className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const ThinkingIndicator = () => {
    return isThinking ? (
      <div className="flex justify-start mb-2 chatbot-animate-fade-in">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl rounded-bl-none p-3 border border-blue-500/30 flex items-center gap-2">
          <FaTools className="text-blue-400 text-sm animate-pulse" />
          <span className="text-white text-sm font-medium">Thinking</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    ) : null;
  };

  const renderMessage = (msg, index) => {
    const isBotMessage = msg.sender === 'bot';
    
    if (msg.type === 'clarification_options') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="w-full space-y-2">
            {msg.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleClarificationClick(option)}
                className="w-full text-left p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-blue-500/30 hover:border-blue-400 hover:bg-gray-700/50 transition-all duration-300 group"
              >
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {option.label}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === 'booking_action') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
            >
              <FaBolt className="text-sm" />
              Book Service
            </button>
            <button
              onClick={resetConversation}
              className="border border-gray-500 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-300 flex items-center gap-2"
            >
              <FaRedo className="text-sm" />
              Start Over
            </button>
          </div>
        </div>
      );
    }
    
    if (msg.type === 'action') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="space-y-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl rounded-bl-none p-3 border border-blue-500/30">
              <p className="text-white text-sm">{msg.text}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  // Check if this is a booking service
                  if (msg.service.id === 'booking' || msg.service.redirectPath?.includes('dandymen')) {
                    setIsBookingModalOpen(true);
                  } else {
                    handleRedirect(msg.service.redirectPath);
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                <FaWrench className="text-sm" />
                {msg.service.id === 'booking' ? 'Book Service' : msg.service.buttonText}
              </button>
              <button
                onClick={resetConversation}
                className="border border-gray-500 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-300 flex items-center gap-2"
              >
                <FaRedo className="text-sm" />
                Start Over
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'support_form') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="w-full">
            <SupportTicketForm />
          </div>
        </div>
      );
    }

    if (msg.type === 'success') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="bg-green-900/50 backdrop-blur-sm rounded-2xl rounded-bl-none p-3 border border-green-500/50 flex items-center gap-2">
            <FaCheckCircle className="text-green-400 text-sm" />
            <p className="text-white text-sm">{msg.text}</p>
          </div>
        </div>
      );
    }

    if (msg.type === 'ticket_confirmation') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="space-y-2">
            <div className="bg-blue-900/50 backdrop-blur-sm rounded-2xl rounded-bl-none p-3 border border-blue-500/50">
              <p className="text-white text-sm font-semibold">{msg.text}</p>
            </div>
            <button
              onClick={resetConversation}
              className="border border-gray-500 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-300 flex items-center gap-2"
            >
              <FaRedo className="text-sm" />
              Start New Conversation
            </button>
          </div>
        </div>
      );
    }

    if (msg.type === 'tip') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl rounded-bl-none p-3 border border-blue-500/30">
            <p className="text-blue-200 text-sm">{msg.text}</p>
          </div>
        </div>
      );
    }
    
    if (msg.type === 'restart_options') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="space-y-2">
            <button
              onClick={resetConversation}
              className="w-full text-left p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-blue-500/30 hover:border-blue-400 hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="font-semibold text-white flex items-center gap-2">
                <FaRedo className="text-sm" />
                Start a New Conversation
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Begin fresh with a new request
              </div>
            </button>
            <button
              onClick={() => {
                setCurrentStage('support_ticket');
                setConversation(prev => [...prev, 
                  { sender: 'bot', text: chatbotResponses.supportTicket.introduction, type: 'text' },
                  { sender: 'bot', text: 'Please fill out the following information:', type: 'support_form' }
                ]);
              }}
              className="w-full text-left p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-blue-500/30 hover:border-blue-400 hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="font-semibold text-white flex items-center gap-2">
                <FaTools className="text-sm" />
                Create a Service Request
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Submit a detailed request for our team
              </div>
            </button>
          </div>
        </div>
      );
    }
    
    if (msg.type === 'error') {
      return (
        <div key={index} className="flex justify-start mb-2 chatbot-animate-fade-in">
          <div className="bg-red-900/50 backdrop-blur-sm rounded-2xl rounded-bl-none p-3 border border-red-500/50">
            <p className="text-red-200 text-sm whitespace-pre-line">{msg.text}</p>
          </div>
        </div>
      );
    }

    // Regular text message
    return (
      <div key={index} className={`flex ${isBotMessage ? 'justify-start' : 'justify-end'} mb-2 chatbot-animate-fade-in`}>
        <div className={`max-w-[80%] ${
          isBotMessage
            ? 'bg-gray-800/50 backdrop-blur-sm rounded-2xl rounded-bl-none border border-blue-500/30'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-br-none'
        } p-3`}>
          <p className="text-white text-sm">{msg.text}</p>
          {msg.type === 'selection' && msg.description && (
            <p className="text-gray-300 text-xs mt-1 opacity-80">{msg.description}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-[500]">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 chatbot-animate-pulse-slow"
        >
          <FaComments className="text-2xl" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/20 flex flex-col chatbot-animate-slide-up">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm p-4 rounded-t-2xl border-b border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <FaTools className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Quantum Handyman</h3>
                <p className="text-gray-400 text-xs">AI Assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetConversation}
                className="text-gray-400 hover:text-white transition-colors"
                title="Reset conversation"
              >
                <FaRedo className="text-sm" />
              </button>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 chatbot-scrollbar-thin chatbot-scrollbar-thumb-gray-600 chatbot-scrollbar-track-transparent">
            {conversation.map((msg, index) => renderMessage(msg, index))}
            <ThinkingIndicator />
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          {currentStage !== 'support_ticket' && currentStage !== 'completed' && (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-500/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder={currentStage === 'initial' ? "Ask about repairs, quotes, or services..." : "Any additional questions?"}
                  className="flex-1 bg-gray-800/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
};

export default ChatBot;
