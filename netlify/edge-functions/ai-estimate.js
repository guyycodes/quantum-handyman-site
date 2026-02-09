export default async (request, context) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: { message: 'Method not allowed' }
    }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get the OpenAI API key from environment
    const apiKey = Deno.env.get('VITE_OPENAI_API_KEY')
    
    if (!apiKey) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(JSON.stringify({
        error: { message: 'OpenAI API key not configured' }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get and validate the request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({
        error: { message: 'Invalid JSON in request body' }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    if (!requestBody.model || !requestBody.messages) {
      return new Response(JSON.stringify({
        error: { message: 'Missing required fields: model and messages' }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Add the system prompt to the messages
    const systemMessage = {
      role: 'system',
      content: `You are an expert service estimator for Quantum Technician, a web development services company.

      Your task is to provide accurate project estimates based on descriptions and images provided. Try not to underestimate the project. 

PRICING CONTEXT:
Web Development Services:
- Web Development: $100/page
- Additional pages: +$100 per page
- Website Maintenance: $20/hr
- E-commerce Solutions: $1,300 - $5,000
- Custom Development: $50/hr
- AI Integration: $1,000+
- SEO & Performance Optimization: $500 - $2,000

IMPORTANT GUIDELINES:
0. Be very selective with this promo code FREEQUOTE. If the user provides estimate data that fails to identify the work enough for a reasonable estimate, reply stating their request doesnt provide enough information & give them the promo code to try again.
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

    // Prepend the system message to the existing messages
    const messagesWithSystem = [systemMessage, ...requestBody.messages];
    
    // Create the final request body with the system message
    const finalRequestBody = {
      ...requestBody,
      messages: messagesWithSystem
    };

    console.log('Making OpenAI API request with model:', requestBody.model);

    // Make the call to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalRequestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, data);
      return new Response(JSON.stringify({
        error: { 
          message: data.error?.message || `OpenAI API error: ${response.status}`,
          type: data.error?.type || 'api_error',
          code: data.error?.code || response.status
        }
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('OpenAI API request successful');

    // Return the OpenAI response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Estimate Error:', error);
    return new Response(JSON.stringify({
      error: { 
        message: error.message || 'Internal server error',
        type: 'internal_error'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
