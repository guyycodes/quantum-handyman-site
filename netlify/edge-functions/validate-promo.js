export default async (request, context) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      valid: false,
      error: 'Method not allowed'
    }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parse request body
    const { code } = await request.json();
    
    if (!code) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'No promo code provided'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get promo codes from environment variables
    const validPromoCodes = [
      Deno.env.get('PROMO_1') || Deno.env.get('VITE_PROMO_1'),
      Deno.env.get('PROMO_2') || Deno.env.get('VITE_PROMO_2'),
      Deno.env.get('PROMO_3') || Deno.env.get('VITE_PROMO_3'),
      context.env?.PROMO_1 || context.env?.VITE_PROMO_1,
      context.env?.PROMO_2 || context.env?.VITE_PROMO_2,
      context.env?.PROMO_3 || context.env?.VITE_PROMO_3
    ].filter(Boolean); // Remove undefined values

    // Check if the provided code matches any valid promo code
    const isValid = validPromoCodes.includes(code.trim());

    // Return validation result
    return new Response(JSON.stringify({
      valid: isValid
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Promo validation error:', error);
    return new Response(JSON.stringify({
      valid: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
