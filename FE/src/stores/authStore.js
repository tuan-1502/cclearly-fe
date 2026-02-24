import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Auth store - manages user authentication state
 * User schema matches database:
 * - user_id: UUID
 * - email: string
 * - full_name: string
 * - phone_number: string
 * - is_email_verified: boolean
 * - status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
 * - role_id: UUID (references roles table)
 * - created_at: datetime
 * - last_login: datetime
 */
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            error: null,
          }),

        setToken: (token) =>
          set({
            token,
          }),

        setLoading: (isLoading) =>
          set({
            isLoading,
          }),

        setError: (error) =>
          set({
            error,
          }),

        login: (user, token) =>
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          }),

        logout: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          }),

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),

        // Check if user email is verified
        isEmailVerified: () => {
          const { user } = get();
          return user?.isEmailVerified ?? false;
        },

        // Check if user has specific role
        hasRole: (roleName) => {
          const { user } = get();
          return user?.role?.name === roleName;
        },

        // Clear error
        clearError: () =>
          set({
            error: null,
          }),
      }),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

export default useAuthStore;
