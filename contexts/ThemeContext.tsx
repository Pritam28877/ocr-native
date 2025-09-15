import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

const lightColors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#8B5CF6',
  secondary: '#A855F7',
  accent: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const darkColors = {
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#4B5563',
  primary: '#A855F7',
  secondary: '#8B5CF6',
  accent: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === 'dark');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};