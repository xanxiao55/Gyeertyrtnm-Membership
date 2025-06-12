import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // API base URL - will be configured for production
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get Firebase ID token
          const idToken = await user.getIdToken();
          
          // Exchange for JWT token
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            idToken,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL
          });
          
          const jwtToken = response.data.token;
          localStorage.setItem('token', jwtToken);
          setToken(jwtToken);
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
          
          setCurrentUser(user);
        } catch (error) {
          console.error('Error getting JWT token:', error);
          toast.error('Authentication error occurred');
        }
      } else {
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name, photoURL) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL
      });
      toast.success('Account created successfully!');
      return user;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      return result.user;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast.success('Logged in with Google successfully!');
      return result.user;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Error logging out');
      throw error;
    }
  };

  const handleAuthError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        toast.error('No account found with this email');
        break;
      case 'auth/wrong-password':
        toast.error('Incorrect password');
        break;
      case 'auth/email-already-in-use':
        toast.error('Email already registered');
        break;
      case 'auth/weak-password':
        toast.error('Password should be at least 6 characters');
        break;
      case 'auth/invalid-email':
        toast.error('Invalid email address');
        break;
      default:
        toast.error('Authentication error occurred');
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}