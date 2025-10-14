/**
 * Promo Code Validation Service
 * Validates promo codes through edge function to keep codes secure
 */
class PromoCodeService {
  constructor() {
    this.endpoint = '/.netlify/edge-functions/validate-promo';
  }

  /**
   * Validate a promo code
   * @param {string} code - The promo code to validate
   * @returns {Promise<boolean>} - Whether the code is valid
   */
  async validateCode(code) {
    try {
      if (!code || !code.trim()) {
        return false;
      }

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() })
      });

      if (!response.ok) {
        console.error('Promo validation request failed:', response.status);
        return false;
      }

      const data = await response.json();
      return data.valid === true;

    } catch (error) {
      console.error('Error validating promo code:', error);
      // Return false on any error to fail safely
      return false;
    }
  }
}

// Export singleton instance
const promoCodeService = new PromoCodeService();
export default promoCodeService;
