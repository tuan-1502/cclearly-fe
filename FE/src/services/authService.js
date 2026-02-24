import apiClient from './apiClient';

/**
 * Authentication service
 * Handles all auth-related API calls
 */
export const authService = {
  /**
   * Login with credentials
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<Object>}
   */
  login: async (credentials) => {
    const response = await apiClient.post('/v1/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  register: async (userData) => {
    const response = await apiClient.post('/v1/auth/register', userData);
    return response.data;
  },

  /**
   * Get current user info
   * @returns {Promise<Object>}
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/v1/auth/me');
    return response.data;
  },

  /**
   * Logout current user
   * @returns {Promise<Object>}
   */
  logout: async () => {
    const response = await apiClient.post('/v1/auth/logout');
    return response.data;
  },

  /**
   * Refresh access token
   * @returns {Promise<Object>}
   */
  refreshToken: async () => {
    const response = await apiClient.post('/v1/auth/refresh');
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise<Object>}
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post('/v1/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} data
   * @param {string} data.token
   * @param {string} data.password
   * @returns {Promise<Object>}
   */
  resetPassword: async (data) => {
    const response = await apiClient.post('/v1/auth/reset-password', data);
    return response.data;
  },

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<Object>}
   */
  verifyEmail: async (token) => {
    const response = await apiClient.post('/v1/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<Object>}
   */
  resendVerificationEmail: async (email) => {
    const response = await apiClient.post('/v1/auth/resend-verification', {
      email,
    });
    return response.data;
  },

  /**
   * Login with Google OAuth
   * @param {string} idToken - Google ID Token
   * @returns {Promise<Object>}
   */
  loginWithGoogle: async (idToken) => {
    const response = await apiClient.post('/v1/auth/google', { idToken });
    return response.data;
  },
};

export default authService;
