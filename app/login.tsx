import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Smartphone, Mail, Rocket } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    const contact = loginMethod === 'phone' ? phoneNumber : email;
    if (contact.trim()) {
      router.push({
        pathname: '/otp',
        params: { method: loginMethod, contact: contact.trim() }
      });
    }
  };

  const handleContinueAsGuest = () => {
    router.replace('/(tabs)');
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
              <TouchableOpacity style={styles.backButton}>
                <ArrowLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome Back</Text>
            </View>

            <View style={[styles.loginCard, { backgroundColor: colors.surface }]}>
              <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                  <View style={styles.iconInner} />
                </View>
              </View>

              <Text style={[styles.signInText, { color: colors.textSecondary }]}>Sign in to continue</Text>

              <View style={[styles.methodSelector, { backgroundColor: colors.background }]}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    loginMethod === 'phone' && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => setLoginMethod('phone')}>
                  <Smartphone size={16} color={loginMethod === 'phone' ? '#FFFFFF' : colors.primary} />
                  <Text style={[
                    styles.methodButtonText, 
                    { color: loginMethod === 'phone' ? '#FFFFFF' : colors.primary }
                  ]}>Phone</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    loginMethod === 'email' && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => setLoginMethod('email')}>
                  <Mail size={16} color={loginMethod === 'email' ? '#FFFFFF' : colors.primary} />
                  <Text style={[
                    styles.methodButtonText, 
                    { color: loginMethod === 'email' ? '#FFFFFF' : colors.primary }
                  ]}>Email</Text>
                </TouchableOpacity>
              </View>

              {loginMethod === 'phone' ? (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor={colors.textSecondary}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              ) : (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <LinearGradient
                  colors={['#06B6D4', '#0891B2']}
                  style={styles.loginButtonGradient}>
                  <Rocket size={16} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.guestButton} onPress={handleContinueAsGuest}>
                <Text style={[styles.guestButtonText, { color: colors.primary }]}>👤 Continue as Guest</Text>
              </TouchableOpacity>
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
  iconInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  signInText: {
    fontSize: 16,
    marginBottom: 24,
  },
  methodSelector: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '500',
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