import axios from 'axios';
import { config } from '@/config/config';

/**
 * Axios instance configured for API requests
 */
const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (requestConfig) => {
    // Cookies are sent automatically with withCredentials: true
    // Add any request modifications here
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh automatically
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if this is the refresh endpoint itself to prevent loop
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Clear cookies by calling logout endpoint
        try {
          await axios.post(
            `${config.apiUrl}/v1/auth/logout`,
            {},
            { withCredentials: true }
          );
        } catch {
          // Ignore logout errors, just redirect
        }
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${config.apiUrl}/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          // New access token is set as HTTP-only cookie automatically
          // Retry original request
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        try {
          await axios.post(
            `${config.apiUrl}/v1/auth/logout`,
            {},
            { withCredentials: true }
          );
        } catch {
          // Ignore logout errors
        }
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
