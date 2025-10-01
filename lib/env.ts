import Constants from 'expo-constants';

type Extra = {
  EXPO_PUBLIC_OCR_API_URL?: string;
  EXPO_PUBLIC_OCR_API_TOKEN?: string;
};

const extra = (Constants?.expoConfig?.extra || {}) as Extra;

export const OCR_API_URL: string =
  process.env.EXPO_PUBLIC_OCR_API_URL || extra.EXPO_PUBLIC_OCR_API_URL || '';

export const OCR_API_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1NTc3MjZmYWIxMjMxZmEyZGNjNTcyMWExMDgzZGE2ODBjNGE3M2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vb2NlYW5pYy1kZXB0aC00NzM2MTUtdjMiLCJhdWQiOiJvY2VhbmljLWRlcHRoLTQ3MzYxNS12MyIsImF1dGhfdGltZSI6MTc1OTMyMDIyMywidXNlcl9pZCI6IlFoYWY4UnJ5TFliSW1RUERNbFV1MDFHaTNuUDIiLCJzdWIiOiJRaGFmOFJyeUxZYkltUVBETWxVdTAxR2kzblAyIiwiaWF0IjoxNzU5MzIwMjIzLCJleHAiOjE3NTkzMjM4MjMsInBob25lX251bWJlciI6Iis5MTkwMjgyODY3MTYiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis5MTkwMjgyODY3MTYiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.SagW8Fxq920APT8McKkEr8Bm4w40kBkuoOWDcIuI3kJKS2-GBI_RSqVsFTI1ZxtzYa8SllFLLGPK21lBAUpj1qLT9jTLG8e6JZEuEy5Wc0x1V4MtGeve57lxCjlNSpJTHQ116WA7nMmv5QOcBpqKKyKUTLO8lb7Ii50yh9_7pO5aFaGtUMEyKjELR_NRFF3if2LR9LiIEZ8eZbg6ZIa-FXaVXLzrHef7niDnv50DFcNF6vL9wexTTrqIe2Hwymh9CANIuGFhJmYf971U-661yUsZfFioTiHK-6vh-xsnBLOhgxcKDxvNtDasMBarr4pezBL6hsSvB867eVufCeqMDg';

export function assertOcrConfig() {
  if (!OCR_API_URL || !OCR_API_TOKEN) {
    throw new Error('OCR API URL or TOKEN missing');
  }
}
