import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isGuest: false,
  isLoggedIn: false,
  login: async () => {},
  loginAsGuest: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const login = useCallback(async (_email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(CURRENT_USER);
    setIsGuest(false);
  }, []);

  const loginAsGuest = useCallback(() => {
    setUser(null);
    setIsGuest(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsGuest(false);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      isLoggedIn: user !== null,
      login,
      loginAsGuest,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
