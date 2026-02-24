import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

/**
 * ProtectedRoute component - wraps routes that require authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} [props.allowedRoles] - Optional array of allowed roles
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if roles are specified)
  if (allowedRoles.length > 0) {
    const userRole = user?.role?.name || user?.role;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
