import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/authService';
import { useAuthStore } from '@stores/authStore';

/**
 * Custom hook to check and initialize authentication
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
  };
};

export default useAuth;
