// Mock implementation for development/testing
import { ConfirmationResult } from 'firebase/auth';

export const createMockConfirmationResult = (phoneNumber: string): ConfirmationResult => {
  return {
    verificationId: `mock_verification_${Date.now()}`,
    confirm: async (code: string) => {
      // Mock verification - accept any 4-digit code for development
      if (code.length === 4 && /^\d{4}$/.test(code)) {
        return {
          user: {
            uid: `mock_user_${Date.now()}`,
            phoneNumber: phoneNumber,
            displayName: null,
            email: null,
            photoURL: null,
            emailVerified: false,
            isAnonymous: false,
            metadata: {
              creationTime: new Date().toISOString(),
              lastSignInTime: new Date().toISOString()
            },
            providerData: [],
            refreshToken: 'mock_refresh_token',
            tenantId: null,
            delete: async () => {},
            getIdToken: async () => 'mock_id_token',
            getIdTokenResult: async () => ({
              token: 'mock_id_token',
              authTime: new Date().toISOString(),
              issuedAtTime: new Date().toISOString(),
              expirationTime: new Date(Date.now() + 3600000).toISOString(),
              signInProvider: 'phone',
              signInSecondFactor: null,
              claims: {}
            }),
            reload: async () => {},
            toJSON: () => ({})
          },
          providerId: 'phone',
          operationType: 'signIn'
        };
      } else {
        throw new Error('Invalid verification code');
      }
    }
  } as ConfirmationResult;
};

export const sendMockVerificationCode = async (phoneNumber: string): Promise<ConfirmationResult> => {
  console.log(`📱 Mock SMS sent to ${phoneNumber}`);
  console.log(`🔑 Mock verification code: 1234`);
  console.log(`💡 Use code "1234" to verify your phone number`);
  
  // Simulate a small delay like real SMS
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return createMockConfirmationResult(phoneNumber);
};
