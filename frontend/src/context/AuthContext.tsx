'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: {
    role: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>; // No token param
  logout: () => void;
  fetchUser: () => Promise<void>; // To fetch user after initial load or login
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/api/auth/user/');
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (username_param: string, password_param: string) => {
    setIsLoading(true);
    try {
      // First, get a CSRF token (if needed, though often middleware handles it for session auth)
      // For DRF Session Auth, the CSRF token is usually sent in a cookie
      // and needs to be included in subsequent POST requests.
      // Axios with `withCredentials` will handle the cookie, but we still need the token.
      // Let's assume the backend csrf view sets a cookie correctly.
      // We can make a GET request to /api/auth/csrf/ to ensure the cookie is set.
      await api.get('/api/auth/csrf/'); // This will ensure CSRF cookie is set

      const response = await api.post('/api/auth/login/', {
        username: username_param,
        password: password_param,
      });
      
      // If login is successful, refetch user data
      await fetchUser(); // This will update user and isAuthenticated state
      return response.data; // Optionally return login response data
    } catch (error) {
      setIsAuthenticated(false);
      throw error; // Re-throw to be handled by login page
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/api/auth/logout/');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      setIsLoading(false);
      window.location.href = '/login'; // Redirect to login page
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
