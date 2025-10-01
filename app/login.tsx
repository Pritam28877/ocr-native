import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Smartphone, Rocket } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { sendVerificationCode } from '@/lib/phoneAuth';
// import RecaptchaContainer from '@/components/RecaptchaContainer';

export default function LoginScreen() {
  const { colors } = useTheme();
  // const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [phoneNumber, setPhoneNumber] = useState('+918580486958');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber.trim() || phoneNumber.trim() === '+91') {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      const confirmation = await sendVerificationCode(phoneNumber.trim());

      // Pass the confirmation object to OTP screen
      router.push({
        pathname: '/otp',
        params: {
          method: 'phone',
          contact: phoneNumber.trim(),
          confirmation: JSON.stringify(confirmation), // pass as string
        },
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to send verification code');
    }
  };

  const handleContinueAsGuest = () => {
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    // Navigate to onboarding screen
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome Back</Text>
            </View>

            <View
              style={[styles.loginCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Smartphone size={36} color="#FFFFFF" />
                </View>
              </View>

              <Text
                style={[styles.signInText, { color: colors.textSecondary }]}
              >
                Sign in with Phone Number
              </Text>
              <Text
                style={[styles.signInSubtext, { color: colors.textSecondary }]}
              >
                We'll send you an OTP to verify
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor={colors.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoFocus
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={
                    loading ? ['#9CA3AF', '#6B7280'] : ['#06B6D4', '#0891B2']
                  }
                  style={styles.loginButtonGradient}
                >
                  <Rocket size={16} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Sending...' : 'Login'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleContinueAsGuest}
              >
                <Text
                  style={[styles.guestButtonText, { color: colors.primary }]}
                >
                  👤 Continue as Guest
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        {/* <RecaptchaContainer />c */}
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
  loginCard: {
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
  signInText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  signInSubtext: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  loginButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guestButton: {
    paddingVertical: 12,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
