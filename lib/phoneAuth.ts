// Using React Native Firebase SDK for native phone auth
// The web SDK doesn't work properly in React Native due to reCAPTCHA requirements
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';
import { sendMockVerificationCode } from './phoneAuthMock';

export async function sendVerificationCode(phoneNumber: string) {
  try {
    // Use React Native Firebase SDK for phone authentication
    // This uses native Android/iOS SDKs and doesn't require reCAPTCHA
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error: any) {
    console.error('Phone auth error:', error);
    // Fallback to mock for development if real SMS fails
    if (__DEV__) {
      console.log('Using mock verification for development');
      return await sendMockVerificationCode(phoneNumber);
    }
    throw error;
  }
}

export async function verifyCode(verificationId: string, code: string) {
  // For React Native Firebase, we use the confirmation object directly
  // The verificationId is actually the confirmation object
  try {
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);
    return await auth().signInWithCredential(credential);
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
}

export async function confirmCode(confirmation: any, code: string) {
  // Direct confirmation for React Native Firebase
  return await confirmation.confirm(code);
}

export const resendVerificationCode = async (
  phoneNumber: string
): Promise<{ verificationId: string }> => {
  try {
    console.log(`📱 Resending SMS to ${phoneNumber}`);
    const confirmation = await sendVerificationCode(phoneNumber);
    return { verificationId: confirmation.verificationId };
  } catch (error: any) {
    console.error('Error resending verification code:', error);
    if (__DEV__) {
      console.log('🔄 Using mock authentication for development');
      const mock = await sendMockVerificationCode(phoneNumber);
      return { verificationId: mock.verificationId };
    }
    throw error;
  }
};
