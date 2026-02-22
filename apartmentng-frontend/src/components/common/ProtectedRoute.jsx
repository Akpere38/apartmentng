import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, isAgent, loading } = useAuth();

  console.log('ProtectedRoute check:', { isAuthenticated, isAdmin, isAgent, loading, requiredRole });

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // Not authenticated - redirect to home
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (requiredRole === 'admin' && !isAdmin) {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'agent' && !isAgent) {
    console.log('Not agent, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Auth check passed, rendering children');
  // All checks passed - render children
  return children;
};

export default ProtectedRoute;