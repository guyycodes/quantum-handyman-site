import { useCallback } from 'react';
import googleScriptService from '../services/googleScriptService';

/**
 * Super simple SMS notification hook
 * Just sends a basic alert when events happen
 */
export const useSmsNotification = () => {
  const SMS_GATEWAY = import.meta.env.VITE_SMS_GATEWAY || '3034958899@vzwpix.com';

  const sendNotification = useCallback(async (type) => {
    try {
      // Simple message
      let message = '';
      
      switch (type) {
        case 'contact':
          message = 'You have a contact form request';
          break;
        case 'estimate':
          message = 'You have an estimate request';
          break;
        case 'booking':
          message = 'You have a new booking';
          break;
        default:
          message = 'You have a new notification';
      }

      // Use the googleScriptService which properly handles CORS
      // DO NOT set Content-Type header - Google Apps Script doesn't like it
      if (!googleScriptService.isConfigured()) return;

      const result = await googleScriptService.callGoogleScript({
        action: 'sendSMS',
        to: SMS_GATEWAY,
        message: message
      });
      console.log('SMS result:', result);
    } catch (error) {
      console.error('SMS failed:', error);
    }
  }, [SMS_GATEWAY]);

  return { sendNotification };
};

export default useSmsNotification;
