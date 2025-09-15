import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Return a minimal view while redirecting
  return <View style={{ flex: 1, backgroundColor: '#8B5CF6' }} />;
}