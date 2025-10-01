import { Tabs } from 'expo-router/tabs';
import { Chrome as Home, FileText, Package, User, Bell, Menu, Sun, Moon } from 'lucide-react-native';
import { StyleSheet, Platform, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useUIStore } from '@/stores/useUIStore';

export default function TabLayout() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const toggleNotifications = useUIStore((s) => s.toggleNotifications);
  const insets = useSafeAreaInsets();
  // Ensure the tab bar sits above the system navigation by including safe-area inset
  const baseTabHeight = Platform.OS === 'ios' ? 70 : 62;
  const minPaddingBottom = Platform.OS === 'ios' ? 20 : 10;
  const tabBarPaddingBottom = Math.max(insets.bottom, minPaddingBottom);
  const tabBarHeight = baseTabHeight + tabBarPaddingBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: [
          styles.tabBar, 
          { 
            backgroundColor: colors.surface, 
            borderTopColor: colors.border,
            paddingTop: 10,
            paddingBottom: tabBarPaddingBottom,
            height: tabBarHeight,
          }
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
        headerStyle: {
          backgroundColor: colors.surface,
          height: Platform.OS === 'ios' ? 110 : 95,
        },
        headerTitleAlign: 'center',
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitleText, { color: colors.text }]}>QuoteAI</Text>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={toggleSidebar}
            style={[styles.headerIcon, { backgroundColor: isDarkMode ? colors.card : '#F3F4F6' }]}
          >
            <Menu size={22} color={colors.text} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity
              onPress={toggleNotifications}
              style={[styles.headerIcon, { backgroundColor: isDarkMode ? colors.card : '#F3F4F6' }]}
            >
              <Bell size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.headerIcon, { backgroundColor: isDarkMode ? colors.card : '#F3F4F6' }]}
            >
              {isDarkMode ? (
                <Sun size={22} color={colors.text} />
              ) : (
                <Moon size={22} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Quotes',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ size, color }) => (
            <Package size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    height: Platform.OS === 'ios' ? 84 : 68,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
  },
});