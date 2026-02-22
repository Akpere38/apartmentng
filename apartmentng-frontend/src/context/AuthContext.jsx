import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Compute derived state from user
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';

useEffect(() => {
    // Load user from localStorage on mount
    const token = localStorage.getItem('apartmentng_token');
    const userDataString = localStorage.getItem('apartmentng_user');
    
    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        
        // Validate that userData is a proper object with required fields
        if (userData && typeof userData === 'object' && userData.role) {
          console.log('Loaded user from localStorage:', userData);
          setUser(userData);
        } else {
          // Invalid user data - clear corrupted localStorage
          console.warn('Invalid user data in localStorage, clearing:', userData);
          localStorage.removeItem('apartmentng_token');
          localStorage.removeItem('apartmentng_user');
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('apartmentng_token');
        localStorage.removeItem('apartmentng_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    console.log('Login called with userData:', userData);
    
    // Validate userData has required fields
    if (!userData || !userData.role) {
      console.error('Invalid userData passed to login:', userData);
      return;
    }
    
    console.log('User role:', userData.role);
    
    // Save to localStorage
    localStorage.setItem('apartmentng_token', token);
    localStorage.setItem('apartmentng_user', JSON.stringify(userData));
    
    // Update state - this triggers re-render
    setUser(userData);

    // Navigate after state update
    setTimeout(() => {
      console.log('About to navigate, user role is:', userData.role);
      if (userData.role === 'admin') {
        console.log('Navigating to /admin/dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else if (userData.role === 'agent') {
        console.log('Navigating to /agent/dashboard');
        navigate('/agent/dashboard', { replace: true });
      } else {
        navigate('/');
      }
    }, 100);
  };

  const logout = () => {
    localStorage.removeItem('apartmentng_token');
    localStorage.removeItem('apartmentng_user');
    setUser(null);
    navigate('/');
  };

  // Log current state for debugging
  useEffect(() => {
    if (user) {
      console.log('Auth state updated:', {
        user,
        isAuthenticated,
        isAdmin,
        isAgent
      });
    }
  }, [user, isAuthenticated, isAdmin, isAgent]);

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isAgent,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};