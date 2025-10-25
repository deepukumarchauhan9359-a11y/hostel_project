import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, setAuthToken, clearAuthToken } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Warden' | 'Admin';
  hostelBlock?: string;
  room?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      // Fetch user data with the existing token
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      console.log('🔄 Fetching user data with token...');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api/v1'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Auth response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User data received:', userData.user);
        setUser(userData.user);
        setIsAuthenticated(true);
        console.log('User session restored:', userData.user);
      } else {
        const errorText = await response.text();
        console.log('❌ Auth failed:', errorText);
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        clearAuthToken();
        console.log('Invalid token, cleared from storage');
      }
    } catch (error) {
      console.error('💥 Error fetching user data:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      clearAuthToken();
    }
  };

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    const res = await apiRequest<{ token: string; user: User }>(
      'POST',
      '/auth/login',
      { email, password }
    );
    setAuthToken(res.token);
    localStorage.setItem('authToken', res.token); // Persist token
    setUser(res.user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearAuthToken();
    localStorage.removeItem('authToken'); // Clear persisted token
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      hostelBlock: userData.hostelBlock,
      room: (userData as any).roomNumber ?? (userData as any).room,
    };
    const response = await apiRequest<{ message: string; user: User }>(
      'POST',
      '/auth/signup',
      payload
    );
    // Don't automatically log in - user needs admin verification
    return true;
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};