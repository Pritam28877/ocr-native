import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isSessionRestored: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const AUTH_STATE_KEY = '@auth_state';
const USER_DATA_KEY = '@user_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const tokenRefreshTimer = useRef<NodeJS.Timeout | null>(null);

  // Save auth state to AsyncStorage
  const saveAuthState = async (user: FirebaseAuthTypes.User | null) => {
    try {
      if (user) {
        const userData = {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          lastSignInTime: user.metadata.lastSignInTime,
          creationTime: user.metadata.creationTime,
        };
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        await AsyncStorage.setItem(AUTH_STATE_KEY, 'authenticated');
        console.log('✅ Auth state saved to storage');
      } else {
        await AsyncStorage.removeItem(USER_DATA_KEY);
        await AsyncStorage.setItem(AUTH_STATE_KEY, 'unauthenticated');
        console.log('✅ Auth state cleared from storage');
      }
    } catch (error) {
      console.error('❌ Error saving auth state:', error);
    }
  };

  // Restore auth state from AsyncStorage
  const restoreAuthState = async () => {
    try {
      const authState = await AsyncStorage.getItem(AUTH_STATE_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);

      if (authState === 'authenticated' && userData) {
        const parsedUserData = JSON.parse(userData);
        console.log(
          '🔄 Restoring auth state from storage:',
          parsedUserData.phoneNumber
        );

        // Check if Firebase user still exists
        const currentUser = auth().currentUser;
        if (currentUser && currentUser.uid === parsedUserData.uid) {
          setUser(currentUser);
          console.log('✅ User session restored successfully');
        } else {
          // Clear invalid session
          await AsyncStorage.removeItem(AUTH_STATE_KEY);
          await AsyncStorage.removeItem(USER_DATA_KEY);
          console.log('⚠️ Invalid session cleared');
        }
      }
    } catch (error) {
      console.error('❌ Error restoring auth state:', error);
    } finally {
      setIsSessionRestored(true);
    }
  };

  useEffect(() => {
    // Restore auth state on app startup
    restoreAuthState();

    // Listen to Firebase auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      console.log(
        '🔄 Firebase auth state changed:',
        user ? user.phoneNumber : 'No user'
      );

      setUser(user);
      setLoading(false);

      // Save auth state to storage
      await saveAuthState(user);

      // Set up automatic token refresh
      if (user) {
        console.log('✅ User authenticated:', user.phoneNumber);

        // Refresh token every 50 minutes (Firebase tokens expire in 1 hour)
        if (tokenRefreshTimer.current) {
          clearInterval(tokenRefreshTimer.current);
        }

        tokenRefreshTimer.current = setInterval(async () => {
          try {
            await user.getIdToken(true); // Force refresh
            console.log('🔄 Token refreshed successfully');

            // Update stored auth state
            await saveAuthState(user);
          } catch (error) {
            console.error('❌ Token refresh failed:', error);
            // If token refresh fails, user might need to re-authenticate
            if (error.code === 'auth/user-token-expired') {
              console.log('⚠️ Token expired, clearing session');
              await saveAuthState(null);
            }
          }
        }, 50 * 60 * 1000); // 50 minutes
      } else {
        // Clear timer if user logs out
        if (tokenRefreshTimer.current) {
          clearInterval(tokenRefreshTimer.current);
          tokenRefreshTimer.current = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (tokenRefreshTimer.current) {
        clearInterval(tokenRefreshTimer.current);
      }
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      // Clear stored auth state
      await saveAuthState(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut: handleSignOut,
    isSessionRestored,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
