import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Only set user if both the user data and token exist
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        logout(); // Clean up if data is corrupt
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // 1. Call the updated API that returns the JWT
      const response = await api.auth.login(username, password);
      
      // 2. Map the FastAPI response to our Frontend User type
      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        role: response.user.role as UserRole,
      };

      // 3. PERSIST BOTH: Token for Axios, User for UI
      localStorage.setItem('token', response.access_token); 
      localStorage.setItem('user', JSON.stringify(userData));
      
      // 4. Update state
      setUser(userData);
      
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error; 
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // CRITICAL: Clear token on logout
    window.location.href = '/login'; // Optional: force redirect
  };

  // ... rest of the component (isLoading check and Provider) remains the same

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}