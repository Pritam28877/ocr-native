import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration from google-services.json
// const firebaseConfig = {
//   apiKey: "AIzaSyB9YZUNkp-k7b6yubU_1MR4XRQktDOt1nA",
//   authDomain: "encoded-joy-472514-n7.firebaseapp.com",
//   projectId: "encoded-joy-472514-n7",
//   storageBucket: "encoded-joy-472514-n7.firebasestorage.app",
//   messagingSenderId: "779116345230",
//   appId: "1:779116345230:android:35af16ae21fe61236416df"
// };

const firebaseConfig = {
  apiKey: 'AIzaSyCBB_21uuDVfAXXNySvWQYmTuXoVgzAWTE',
  authDomain: 'oceanic-depth-473615-v3.firebaseapp.com',
  projectId: 'oceanic-depth-473615-v3',
  storageBucket: 'oceanic-depth-473615-v3.firebasestorage.app',
  messagingSenderId: '329174454207',
  appId: '1:329174454207:android:a0630ede850430e1dd1b0a',
  measurementId: 'G-5XCPXW85YS',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
// Check if auth is already initialized to prevent re-initialization error
let auth;
try {
  // Try to get existing auth instance
  auth = getAuth(app);
} catch {
  // If not initialized, initialize with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
