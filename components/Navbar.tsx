import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Sun, Moon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Navbar({ title, showBackButton, onBackPress }: NavbarProps) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.navbar}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>Q</Text>
            </View>
            <Text style={[styles.logoTitle, { color: colors.text }]}>QuoteAI</Text>
          </View>

          {/* Right Side Icons */}
          <View style={styles.rightIcons}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: isDarkMode ? colors.card : '#F9FAFB' }]}
              onPress={toggleTheme}>
              {isDarkMode ? (
                <Sun size={20} color="#F59E0B" />
              ) : (
                <Moon size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDarkMode ? colors.card : '#F9FAFB' }]}>
              <Bell size={20} color={colors.textSecondary} />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});