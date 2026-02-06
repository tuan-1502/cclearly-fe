import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * App store - manages global application state
 */
export const useAppStore = create(
  devtools(
    (set) => ({
      // State
      isLoading: false,
      sidebarOpen: true,
      theme: 'light',

      // Actions
      setLoading: (isLoading) => set({ isLoading }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'AppStore' }
  )
);

export default useAppStore;
