import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyB9YZUNkp-k7b6yubU_1MR4XRQktDOt1nA",
  authDomain: "encoded-joy-472514-n7.firebaseapp.com",
  projectId: "encoded-joy-472514-n7",
  storageBucket: "encoded-joy-472514-n7.firebasestorage.app",
  messagingSenderId: "779116345230",
  appId: "1:779116345230:android:35af16ae21fe61236416df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
