import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get the ID token
        const idToken = await firebaseUser.getIdToken();
        
        // Create user object
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        };

        setUser(userData);
        setToken(idToken);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        
        // Store in localStorage
        localStorage.setItem('firebaseUser', JSON.stringify(userData));
      } else {
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('firebaseUser');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      const userData: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User'
      };

      setUser(userData);
      setToken(idToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
      localStorage.setItem('firebaseUser', JSON.stringify(userData));

      toast.success('Login successful!');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'User not found'
        : error.code === 'auth/wrong-password'
        ? 'Wrong password'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email'
        : error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      const idToken = await userCredential.user.getIdToken();
      
      const userData: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: name
      };

      setUser(userData);
      setToken(idToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
      localStorage.setItem('firebaseUser', JSON.stringify(userData));

      toast.success('Registration successful!');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('firebaseUser');
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
