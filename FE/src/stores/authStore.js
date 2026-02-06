import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Auth store - manages user authentication state
 */
export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        isAuthenticated: false,

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),
      }),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

export default useAuthStore;
