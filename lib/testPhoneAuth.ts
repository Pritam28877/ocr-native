// Test the phone authentication implementation
import { sendVerificationCode, verifyCode } from './phoneAuth';

export const testPhoneAuth = async () => {
  try {
    console.log('🧪 Testing phone authentication...');
    
    // Test sending verification code
    const phoneNumber = '+1234567890';
    console.log(`📱 Sending verification code to ${phoneNumber}`);
    
    const confirmationResult = await sendVerificationCode(phoneNumber);
    console.log('✅ Verification code sent successfully');
    
    // Test verifying the code
    const testCode = '1234'; // Mock code for development
    console.log(`🔑 Verifying code: ${testCode}`);
    
    const user = await verifyCode(confirmationResult, testCode);
    console.log('✅ Code verified successfully');
    console.log('👤 User authenticated:', user.uid);
    
    return true;
  } catch (error) {
    console.error('❌ Phone authentication test failed:', error);
    return false;
  }
};
