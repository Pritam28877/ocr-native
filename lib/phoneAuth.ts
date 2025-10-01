import { 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';
import { sendMockVerificationCode } from './phoneAuthMock';

// For web platform, we need to set up reCAPTCHA
let recaptchaVerifier: any = null;

export const setupRecaptcha = (containerId: string = 'recaptcha-container') => {
  // Only set up reCAPTCHA for web platform
  if (Platform.OS === 'web' && typeof window !== 'undefined' && !recaptchaVerifier) {
    try {
      // Import RecaptchaVerifier dynamically for web
      const { RecaptchaVerifier } = require('firebase/auth');
      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
    } catch (error) {
      console.log('reCAPTCHA not available:', error);
      return null;
    }
  }
  return recaptchaVerifier;
};

// Returns a serializable verificationId for use on the OTP screen
export const sendVerificationCode = async (phoneNumber: string): Promise<{ verificationId: string }> => {
  try {
    // Format phone number to include country code if not present
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    console.log(`📱 Sending real SMS to ${formattedNumber}`);
    
    // Handle different platforms
    if (Platform.OS === 'web') {
      // For web platform, set up reCAPTCHA
      const verifier = setupRecaptcha();
      if (verifier) {
        const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, verifier);
        console.log('✅ SMS sent successfully via Firebase');
        return { verificationId: (confirmationResult as ConfirmationResult).verificationId };
      } else {
        throw new Error('reCAPTCHA setup failed. Phone authentication requires reCAPTCHA on web.');
      }
    } else {
      // For mobile platforms (iOS/Android), no reCAPTCHA needed
      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber);
      console.log('✅ SMS sent successfully via Firebase');
      return { verificationId: (confirmationResult as ConfirmationResult).verificationId };
    }
  } catch (error: any) {
    console.error('❌ Firebase Phone Auth failed:', error);
    
    // Check if it's a configuration error
    if (error.code === 'auth/argument-error' || error.code === 'auth/operation-not-allowed') {
      console.log('🔧 Firebase Phone Auth not configured. Please:');
      console.log('1. Go to Firebase Console → Authentication → Sign-in method');
      console.log('2. Enable Phone provider');
      console.log('3. Configure your app for phone authentication');
      throw new Error('Phone authentication not enabled. Please configure Firebase Console first.');
    }
    
    // For other errors, fallback to mock
    console.log('🔄 Falling back to mock authentication');
    const mock = await sendMockVerificationCode(phoneNumber);
    return { verificationId: mock.verificationId } as unknown as { verificationId: string };
  }
};

// Accepts verificationId and code; builds credential and signs in
export const verifyCode = async (verificationId: string, code: string) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error: any) {
    console.error('Error verifying code:', error);
    throw new Error(error.message || 'Invalid verification code');
  }
};

export const resendVerificationCode = async (phoneNumber: string): Promise<{ verificationId: string }> => {
  try {
    console.log(`📱 Resending real SMS to ${phoneNumber}`);
    
    // Reset reCAPTCHA verifier for web platform
    if (Platform.OS === 'web') {
      recaptchaVerifier = null;
    }
    
    return await sendVerificationCode(phoneNumber);
  } catch (error: any) {
    console.error('Error resending verification code:', error);
    // Fallback to mock implementation
    console.log('🔄 Falling back to mock authentication for resend');
    const mock = await sendMockVerificationCode(phoneNumber);
    return { verificationId: mock.verificationId } as unknown as { verificationId: string };
  }
};
