// Using React Native Firebase SDK for native phone auth
// The web SDK doesn't work properly in React Native due to reCAPTCHA requirements
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';
import { sendMockVerificationCode } from './phoneAuthMock';

export async function sendVerificationCode(phoneNumber: string) {
  try {
    // Format phone number to include country code if not present
    const formattedNumber = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+${phoneNumber}`;

    console.log(`📱 Sending SMS to ${formattedNumber}`);

    // Use React Native Firebase SDK for phone authentication
    // This uses native Android/iOS SDKs and doesn't require reCAPTCHA
    const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
    console.log('✅ SMS sent successfully via Firebase');
    return confirmation;
  } catch (error: any) {
    console.error('❌ Firebase Phone Auth failed:', error);

    // Check if it's a configuration error
    if (
      error.code === 'auth/argument-error' ||
      error.code === 'auth/operation-not-allowed'
    ) {
      console.log('🔧 Firebase Phone Auth not configured. Please:');
      console.log(
        '1. Go to Firebase Console → Authentication → Sign-in method'
      );
      console.log('2. Enable Phone provider');
      console.log('3. Configure your app for phone authentication');
      throw new Error(
        'Phone authentication not enabled. Please configure Firebase Console first.'
      );
    }

    // Fallback to mock for development if real SMS fails
    if (__DEV__) {
      console.log('🔄 Falling back to mock authentication');
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
    const result = await auth().signInWithCredential(credential);
    console.log('✅ Phone verification successful:', result.user.phoneNumber);
    return result.user;
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
    return { verificationId: confirmation.verificationId || '' };
  } catch (error: any) {
    console.error('❌ Error resending verification code:', error);
    if (__DEV__) {
      console.log('🔄 Using mock authentication for development');
      const mock = await sendMockVerificationCode(phoneNumber);
      return { verificationId: mock.verificationId };
    }
    throw error;
  }
};
