import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, getUserRole, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    if (isAuthenticated()) {
      setUser(getCurrentUser());
      setRole(getUserRole());
    }
    setLoading(false);
  }, []);

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    isAgent: role === 'agent'
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};