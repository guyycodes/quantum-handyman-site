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
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
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
    // Check if API key is configured
    if (!AI_CONFIG.apiKey) {
      console.error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file');
      throw new Error('OpenAI API key not configured');
    }
    
    const { customerInfo, service } = estimateData;
    
    // Prepare the system message for the AI
    const systemMessage = {
      role: 'system',
      content: `You are an expert service estimator for Quantum Handyman which is a handyman servicce for your property & technology needs (Craftsman + CS-degree).

      Your task is to provide accurate project estimates based on descriptions and images provided. Try not to underestimate the project.

IMPORTANT GUIDELINES:
0. Be selective with this promo code FREEQUOTE. If the user provides estimate data that fails to identify the work enough for a reasonable estimate, reply stating their request doesnt provide enough information & give them the promo code to try again.
1. Provide realistic price ranges based on typical US market rates
2. Consider materials, labor, and complexity 
3. Break down the work into clear phases if needed
4. Account for potential complications or unknowns
5. Be conservative in estimates to avoid underquoting

Format your response as JSON with exactly these fields:
{
  "price": "$X,XXX - $X,XXX",
  "jobDescription": "Detailed and impactful description of work to be done, with concise high level roadmap of critical phases.",
  "materials": ["list", "of", "materials"],
  "laborHours": "X-Y hour estimates attributed to each phase of the project, with 1-2 key tasks listed in each phase.",
  "complexity": "Low/Medium/High",
  "notes": "Any important considerations or warnings"
}`
    };

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
        systemMessage,
        {
          role: 'user',
          content: userContent
        }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      response_format: { type: "json_object" } // Ensure JSON response
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      }
    };

    const axios = await getAxios();
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      requestBody,
      config
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
      jobDescription: 'AI estimation failed. Please request a manual estimate.',
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
    isValid: !!AI_CONFIG.apiKey,
    hasKey: !!AI_CONFIG.apiKey,
    model: AI_CONFIG.model
  };
};

export default {
  generateAIEstimate,
  validateAIConfig
};
