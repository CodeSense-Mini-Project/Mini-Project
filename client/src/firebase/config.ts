import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBe6M35Ir1tqI2W-g76Uva5oaA7YMSdVH0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mini-fef00.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mini-fef00',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mini-fef00.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '249036330440',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:249036330440:web:bdbc66952efcb91af75cfd',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-FVS5V7YMZZ'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

