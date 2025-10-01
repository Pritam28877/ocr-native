import { 
  sendEmailVerification,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  ActionCodeSettings
} from 'firebase/auth';
import { auth } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Email link configuration
const actionCodeSettings: ActionCodeSettings = {
  // Replace with your deployed deep-link/redirect handler URL. Must be in Firebase Authorized domains.
  url: 'https://encoded-joy-472514-n7.web.app/verify-email',
  // The code is handled in-app for iOS/Android via Firebase Dynamic Links
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.qi.ocr'
  },
  android: {
    packageName: 'com.anonymous.exponativewind',
    installApp: true,
    minimumVersion: '12'
  },
  // Your Firebase Dynamic Link domain
  dynamicLinkDomain: 'encoded-joy-472514-n7.firebaseapp.com'
};

export const sendEmailVerificationLink = async (email: string): Promise<void> => {
  try {
    console.log(`📧 Sending email verification link to ${email}`);
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    // Save the email for later use (web and native)
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailForSignIn', email);
    }
    try {
      await AsyncStorage.setItem('emailForSignIn', email);
    } catch {}
    
    console.log('✅ Email verification link sent successfully');
  } catch (error: any) {
    console.error('❌ Error sending email verification link:', error);
    throw new Error(error.message || 'Failed to send email verification link');
  }
};

export const verifyEmailLink = async (email: string): Promise<any> => {
  try {
    console.log(`🔗 Verifying email link for ${email}`);
    
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via setPersistence.
      const result = await signInWithEmailLink(auth, email, window.location.href);
      
      // Clear the email from storage.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('emailForSignIn');
      }
      try {
        await AsyncStorage.removeItem('emailForSignIn');
      } catch {}
      
      console.log('✅ Email verification successful');
      return result.user;
    } else {
      throw new Error('Invalid email verification link');
    }
  } catch (error: any) {
    console.error('❌ Error verifying email link:', error);
    throw new Error(error.message || 'Failed to verify email link');
  }
};

// Mock implementation for development
export const sendMockEmailVerification = async (email: string): Promise<{ verificationLink: string }> => {
  console.log(`📧 Mock email verification sent to ${email}`);
  console.log(`🔗 Mock verification link: https://your-app.com/verify?email=${email}&code=123456`);
  console.log(`💡 In development, you can use any 6-digit code for verification`);
  
  // Simulate a small delay like real email
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    verificationLink: `https://your-app.com/verify?email=${email}&code=123456`
  };
};

