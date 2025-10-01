import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenRefreshTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

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
          } catch (error) {
            console.error('❌ Token refresh failed:', error);
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
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut: handleSignOut,
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
