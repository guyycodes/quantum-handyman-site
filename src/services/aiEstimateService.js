// Lazy load axios to improve initial page load
let axiosModule = null;

const getAxios = async () => {
  if (!axiosModule) {
    const module = await import('axios');
    axiosModule = module.default;
  }
  return axiosModule;
};

// AI Service configuration
const AI_CONFIG = {
  model: 'gpt-4o-mini', // Most cost-effective model with vision capabilities
  maxTokens: 1500,
  temperature: 0.3, // Lower temperature for more consistent pricing
};

/**
 * Generate an AI-powered estimate based on project details and images
 * @param {Object} estimateData - The estimate request data
 * @returns {Promise} AI response with price and job description
 */
export const generateAIEstimate = async (estimateData) => {
  try {
    // API key is now handled server-side
    
    const { customerInfo, service } = estimateData;
    
    // System prompt is now handled in the backend edge function

    // Prepare the user message with project details
    let userContent = [
      {
        type: 'text',
        text: `Please provide an estimate for the following project:
        
Service Type: ${service.name}
Customer Address: ${customerInfo.address || 'Not provided'}
Project Description: ${customerInfo.description || 'No description provided'}

Please analyze the provided information and any images to generate a comprehensive estimate.`
      }
    ];

    // Add images if provided (up to 3 images)
    if (customerInfo.images && customerInfo.images.length > 0) {
      const maxImages = Math.min(customerInfo.images.length, 3);
      
      for (let i = 0; i < maxImages; i++) {
        const image = customerInfo.images[i];
        if (image instanceof File) {
          // Convert to base64
          const base64 = await fileToBase64(image);
          // OpenAI expects image URLs or base64 without the data URL prefix
          const base64Data = base64.split(',')[1];
          
          userContent.push({
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`,
              detail: 'high' // Use 'high' for better analysis, 'low' for faster/cheaper
            }
          });
        }
      }
    }

    const requestBody = {
      model: AI_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: userContent
        }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      response_format: { type: "json_object" } // Ensure JSON response
    };

    const axios = await getAxios();
    const response = await axios.post(
      '/api/ai-estimate',
      requestBody
    );

    const aiResponse = response.data.choices[0].message.content;
    const parsedResponse = JSON.parse(aiResponse);

    // Format the response for our system
    return {
      success: true,
      price: parsedResponse.price,
      jobDescription: formatJobDescription(parsedResponse),
      materials: parsedResponse.materials,
      laborHours: parsedResponse.laborHours,
      complexity: parsedResponse.complexity,
      notes: parsedResponse.notes,
      rawResponse: parsedResponse
    };

  } catch (error) {
    console.error('AI Estimate Error:', error);
    
    // Log more detailed error info
    if (error.response) {
      console.error('OpenAI API Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Check for specific error types
      if (error.response.status === 401) {
        console.error('Authentication failed. Check your OpenAI API key.');
      } else if (error.response.status === 400) {
        console.error('Bad request. The model name or request format may be incorrect.');
      } else if (error.response.status === 429) {
        console.error('Rate limit exceeded or quota reached.');
      }
    }
    
    // Provide fallback response
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message || 'Failed to generate AI estimate',
      price: 'Unable to estimate',
      jobDescription: 'AI estimation Pending. Please request a manual estimate or retry with promo code AIESTIMATE_RETRY.',
      materials: [],
      laborHours: 'Unknown',
      complexity: 'Unknown',
      notes: 'An error occurred while generating the estimate. Our team will review your request manually.'
    };
  }
};

/**
 * Convert a File object to base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Format the job description with all details
 */
const formatJobDescription = (aiResponse) => {
  let description = aiResponse.jobDescription;
  
  if (aiResponse.materials && aiResponse.materials.length > 0) {
    description += `\n\nEstimated Materials:\n${aiResponse.materials.map(m => `• ${m}`).join('\n')}`;
  }
  
  if (aiResponse.laborHours) {
    description += `\n\nEstimated Time: ${aiResponse.laborHours}`;
  }
  
  if (aiResponse.complexity) {
    description += `\nComplexity Level: ${aiResponse.complexity}`;
  }
  
  if (aiResponse.notes) {
    description += `\n\nAdditional Notes:\n${aiResponse.notes}`;
  }
  
  return description;
};

/**
 * Validate if AI service is properly configured
 */
export const validateAIConfig = () => {
  return {
    isValid: true, // Always valid since API key is server-side
    hasKey: true,
    model: AI_CONFIG.model
  };
};

export default {
  generateAIEstimate,
  validateAIConfig
};
