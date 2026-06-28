import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Request interceptor to automatically add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const processUserData = (profileData) => {
    if (!profileData) return null;
    const userModelFields = profileData.user && typeof profileData.user === 'object' ? profileData.user : {};
    return {
      ...profileData,
      ...userModelFields,
      id: userModelFields._id || userModelFields.id || profileData.user,
    };
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data?.success) {
        const userObj = response.data.data.user;
        
        // Try to fetch completed profile details
        try {
          const profileResponse = await api.get('/profile/me');
          if (profileResponse.data?.profile) {
            setUser(processUserData(profileResponse.data.profile));
          } else {
            setUser(userObj);
          }
        } catch (profileErr) {
          // Profile may not be created yet, use raw user object
          setUser(userObj);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Check auth failed:', err.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run checkAuth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Real Register
  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  // Real Verify Email OTP
  const verifyEmail = async (email, otp) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    return response.data;
  };

  // Real Login (Credentials Step)
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  };

  // Real Verify Login OTP (Second Factor Step)
  const verifyLoginOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-login-otp', { email, otp });
    if (response.data?.success) {
      const userObj = response.data.data.user;
      const token = response.data.data.token;
      localStorage.setItem('token', token);
      
      // Fetch profile details
      try {
        const profileResponse = await api.get('/profile/me');
        if (profileResponse.data?.profile) {
          setUser(processUserData(profileResponse.data.profile));
        } else {
          setUser(userObj);
        }
      } catch (profileErr) {
        setUser(userObj);
      }
      return { success: true, user: userObj };
    }
    return { success: false, message: response.data?.message || 'Verification failed.' };
  };

  // Real Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API failed:', err.message);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Sync profile data
  const syncProfile = async () => {
    try {
      const response = await api.get('/profile/me');
      setUser(processUserData(response.data.profile));
    } catch (err) {
      console.error('Profile sync failed:', err.message);
      // Fallback: fetch raw user
      try {
        const userResponse = await api.get('/auth/me');
        if (userResponse.data?.success) {
          setUser(userResponse.data.data.user);
        }
      } catch (userErr) {
        console.error('User sync fallback failed:', userErr.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verifyLoginOtp,
        register,
        verifyEmail,
        logout,
        syncProfile,
        setUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
