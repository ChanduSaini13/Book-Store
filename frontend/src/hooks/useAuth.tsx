import { useContext, createContext, ReactNode, useState, useCallback } from 'react';
import { storage } from '../utils/storage.js';
import type { User } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => storage.getUser());
  const [isLoading] = useState(false);

  const setUser = useCallback((user: User | null) => {
    if (user) {
      storage.setUser(user);
    } else {
      storage.removeUser();
    }
    setUserState(user);
  }, []);

  const logout = useCallback(() => {
    storage.clear();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
