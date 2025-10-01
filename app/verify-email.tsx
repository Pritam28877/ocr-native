import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { verifyEmailLink } from '@/lib/emailAuth';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleLinkVerification = async () => {
      try {
        // Determine current URL
        let url = '';
        if (Platform.OS === 'web') {
          url = window.location.href;
        } else {
          const initial = await Linking.getInitialURL();
          url = initial || '';
        }

        if (!url) {
          throw new Error('Missing verification URL');
        }

        // Retrieve stored email
        const storedEmail =
          Platform.OS === 'web'
            ? (typeof window !== 'undefined' ? window.localStorage.getItem('emailForSignIn') : null)
            : await AsyncStorage.getItem('emailForSignIn');

        if (!storedEmail) {
          throw new Error('No stored email for verification');
        }

        // Use emailAuth helper to complete sign-in (web expects window.location.href)
        await verifyEmailLink(storedEmail);

        router.replace('/(tabs)');
      } catch (error: any) {
        Alert.alert('Verification Error', error.message || 'Failed to verify email link');
        router.replace('/login');
      } finally {
        setProcessing(false);
      }
    };

    handleLinkVerification();
  }, [router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}


