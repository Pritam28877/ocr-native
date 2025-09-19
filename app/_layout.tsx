import { useEffect } from 'react';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useUIStore } from '@/stores/useUIStore';
import * as NavigationBar from 'expo-navigation-bar';

function RootStatusBar() {
  const { isDarkMode } = useTheme();
  const statusBarStyle = useUIStore((s) => s.statusBarStyle);
  // Prefer explicit store style when set, otherwise derive from theme
  const style = statusBarStyle !== 'auto' ? statusBarStyle : isDarkMode ? 'light' : 'dark';

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Make Android navigation bar solid black with light icons
      NavigationBar.setBackgroundColorAsync('#000000').catch(() => {});
      NavigationBar.setButtonStyleAsync('light').catch(() => {});
      // Ensure app content is inset above the navigation bar to prevent overlap
      NavigationBar.setBehaviorAsync('inset-swipe').catch(() => {});
    }
  }, [isDarkMode]);
  return (
    <StatusBar 
      style={style}
    />
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <>
        <RootStatusBar />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="otp" options={{ headerShown: false }} />
          <Stack.Screen name="camera" options={{ headerShown: false }} />
          <Stack.Screen name="processing" options={{ headerShown: false }} />
          <Stack.Screen name="quotation" options={{ headerShown: false }} />
          <Stack.Screen name="item-edit" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </>
    </ThemeProvider>
  );
}
