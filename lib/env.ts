import Constants from 'expo-constants';

type Extra = {
  EXPO_PUBLIC_OCR_API_URL?: string;
  EXPO_PUBLIC_OCR_API_TOKEN?: string;
};

const extra = (Constants?.expoConfig?.extra || {}) as Extra;

export const OCR_API_URL: string =
  process.env.EXPO_PUBLIC_OCR_API_URL || extra.EXPO_PUBLIC_OCR_API_URL || '';

export const OCR_API_TOKEN: string =
  process.env.EXPO_PUBLIC_OCR_API_TOKEN || extra.EXPO_PUBLIC_OCR_API_TOKEN || '';

export function assertOcrConfig() {
  if (!OCR_API_URL || !OCR_API_TOKEN) {
    throw new Error('OCR API URL or TOKEN missing');
  }
}



