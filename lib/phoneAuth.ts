import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  ConfirmationResult,
  RecaptchaVerifier,
} from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';
import { sendMockVerificationCode } from './phoneAuthMock';

export async function sendVerificationCode(phoneNumber: string) {
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
  return confirmation; // returns confirmation object
}

export async function confirmCode(confirmation: any, code: string) {
  return await confirmation.confirm(code);
}

export const resendVerificationCode = async (
  phoneNumber: string
): Promise<{ verificationId: string }> => {
  try {
    console.log(`📱 Resending real SMS to ${phoneNumber}`);

    return await sendVerificationCode(phoneNumber);
  } catch (error: any) {
    console.error('Error resending verification code:', error);
    // Fallback to mock implementation
    console.log('🔄 Falling back to mock authentication for resend');
    const mock = await sendMockVerificationCode(phoneNumber);
    return { verificationId: mock.verificationId } as unknown as {
      verificationId: string;
    };
  }
};
