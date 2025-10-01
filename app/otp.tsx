import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Shield, RotateCcw } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { verifyCode, resendVerificationCode } from '@/lib/phoneAuth';
import { verifyEmailLink, sendMockEmailVerification } from '@/lib/emailAuth';
import { ConfirmationResult } from 'firebase/auth';

export default function OTPScreen() {
  const { colors } = useTheme();
  const { method, contact, verificationId, emailVerification } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const [currentVerificationId, setCurrentVerificationId] = useState<string | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  useEffect(() => {
    // Handle email verification
    if (emailVerification === 'true') {
      setEmailVerificationSent(true);
      setCanResend(true); // Allow immediate resend for email
      return;
    }

    // Read verificationId from params for phone verification
    if (verificationId && typeof verificationId === 'string') {
      setCurrentVerificationId(verificationId);
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [verificationId, emailVerification]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 4 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      setTimeout(() => {
        handleVerifyOtp();
      }, 500);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter a complete 4-digit code');
      return;
    }

    try {
      setLoading(true);
      
      if (emailVerification === 'true') {
        // For email verification, we'll use a mock verification for now
        // In production, this would verify the email link
        console.log('📧 Verifying email with code:', otpCode);
        // Simulate email verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Email verification successful');
      } else {
        // Phone verification
        if (!currentVerificationId) {
          Alert.alert('Error', 'Verification session expired. Please try again.');
          router.back();
          return;
        }
        await verifyCode(currentVerificationId, otpCode);
      }
      
      // Success - user is now authenticated
      router.replace('/(tabs)');
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Invalid verification code');
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      
      if (emailVerification === 'true') {
        // Resend email verification
        await sendMockEmailVerification(contact as string);
        Alert.alert('Success', 'Email verification link sent successfully');
      } else {
        // Resend phone verification
        const { verificationId: newVerificationId } = await resendVerificationCode(contact as string);
        setCurrentVerificationId(newVerificationId);
        setTimer(30);
        setCanResend(false);
        Alert.alert('Success', 'Verification code sent successfully');
      }
      
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend verification');
    } finally {
      setResending(false);
    }
  };

  const formatContact = (contact: string) => {
    if (method === 'email') {
      return contact;
    } else {
      // Format phone number
      return contact.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.background}>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Verify OTP</Text>
            </View>

            <View style={[styles.otpCard, { backgroundColor: colors.surface }]}>
              <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, { backgroundColor: colors.success }]}>
                  <Shield size={32} color="#FFFFFF" />
                </View>
              </View>

              <Text style={[styles.otpTitle, { color: colors.text }]}>
                {emailVerification === 'true' ? 'Enter Email Verification Code' : 'Enter Verification Code'}
              </Text>
              <Text style={[styles.otpSubtitle, { color: colors.textSecondary }]}>
                {emailVerification === 'true' 
                  ? `We've sent a verification link to your email{'\n'}Please check your email and enter the 4-digit code from the link`
                  : `We've sent a 4-digit code to{'\n'}`
                }
                <Text style={[styles.contactText, { color: colors.primary }]}>{formatContact(contact as string)}</Text>
              </Text>
              
              {/* Development mode helper */}
              {__DEV__ && (
                <View style={[styles.devHelper, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                  <Text style={[styles.devHelperText, { color: colors.primary }]}>
                    {emailVerification === 'true' 
                      ? '📧 Development Mode: Use code "1234" for email verification'
                      : '💡 Check your phone for the SMS code'
                    }
                  </Text>
                </View>
              )}

              <View style={styles.otpInputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      { 
                        backgroundColor: colors.background, 
                        borderColor: digit ? colors.primary : colors.border,
                        color: colors.text 
                      }
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              <TouchableOpacity 
                style={[
                  styles.verifyButton,
                  (otp.every(digit => digit !== '') && !loading) && { opacity: 1 }
                ]} 
                onPress={handleVerifyOtp}
                disabled={!otp.every(digit => digit !== '') || loading}>
                <LinearGradient
                  colors={otp.every(digit => digit !== '') && !loading ? [colors.success, '#059669'] : [colors.border, colors.textSecondary]}
                  style={styles.verifyButtonGradient}>
                  <Text style={[
                    styles.verifyButtonText,
                    { color: (otp.every(digit => digit !== '') && !loading) ? '#FFFFFF' : colors.textSecondary }
                  ]}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                {canResend ? (
                  <TouchableOpacity 
                    style={styles.resendButton} 
                    onPress={handleResendOtp}
                    disabled={resending}>
                    <RotateCcw size={16} color={resending ? colors.textSecondary : colors.primary} />
                    <Text style={[
                      styles.resendText, 
                      { color: resending ? colors.textSecondary : colors.primary }
                    ]}>
                      {resending 
                        ? 'Sending...' 
                        : emailVerification === 'true' 
                          ? 'Resend Email Link' 
                          : 'Resend Code'
                      }
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.timerText, { color: colors.textSecondary }]}>
                    Resend code in {timer}s
                  </Text>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  otpCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  contactText: {
    fontWeight: '600',
  },
  otpInputContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  verifyButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    opacity: 0.5,
  },
  verifyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timerText: {
    fontSize: 14,
  },
  devHelper: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  devHelperText: {
    fontSize: 14,
    fontWeight: '600',
  },
});