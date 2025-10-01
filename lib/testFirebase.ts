import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Test Firebase connection
export const testFirebaseConnection = () => {
  console.log('Testing Firebase connection...');
  
  // Test auth state listener
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✅ Firebase Auth working - User logged in:', user.phoneNumber);
    } else {
      console.log('✅ Firebase Auth working - No user logged in');
    }
  });

  // Clean up listener after 5 seconds
  setTimeout(() => {
    unsubscribe();
    console.log('✅ Firebase connection test completed');
  }, 5000);
};
