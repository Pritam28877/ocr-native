import Constants from 'expo-constants';
import auth from '@react-native-firebase/auth';

type Extra = {
  EXPO_PUBLIC_OCR_API_URL?: string;
};

const extra = (Constants?.expoConfig?.extra || {}) as Extra;

export const OCR_API_URL: string =
  process.env.EXPO_PUBLIC_OCR_API_URL || extra.EXPO_PUBLIC_OCR_API_URL || '';

// Get Firebase ID token for OCR API authentication
export const getOcrApiToken = async (): Promise<string> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get fresh ID token
    const idToken = await user.getIdToken(true);
    return idToken;
  } catch (error) {
    console.error('❌ Error getting Firebase ID token:', error);
    throw new Error('Failed to get authentication token');
  }
};

export function assertOcrConfig() {
  if (!OCR_API_URL) {
    throw new Error('OCR API URL missing');
  }
}
