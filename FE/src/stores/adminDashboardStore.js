/**
 * Admin Dashboard Store
 * Manages admin dashboard state with Zustand
 * Mock data for development - ready for API integration
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Mock data for system stats
const MOCK_SYSTEM_STATS = {
  serverStatus: 'Hoạt động tốt',
  serverStatusChange: '+0.01%',
  onlineStaff: 12,
  onlineStaffChange: -2,
  logStorage: {
    used: 7.5,
    total: 10,
  },
  logStorageChange: '+5%',
  isMaintenanceMode: false,
};

// Mock data for recent activities
const MOCK_RECENT_ACTIVITIES = [
  {
    id: 'act-001',
    time: '14:25, 24/02/2026',
    user: 'Admin Quân',
    action: 'Thêm mới nhân viên',
    status: 'success',
  },
  {
    id: 'act-002',
    time: '13:10, 24/02/2026',
    user: 'Manager Hùng',
    action: 'Cập nhật quyền RBAC',
    status: 'success',
  },
  {
    id: 'act-003',
    time: '11:45, 24/02/2026',
    user: 'System',
    action: 'Sao lưu database tự động',
    status: 'success',
  },
  {
    id: 'act-004',
    time: '10:30, 24/02/2026',
    user: 'Admin Quân',
    action: 'Đổi banner trang chủ',
    status: 'success',
  },
  {
    id: 'act-005',
    time: '09:15, 24/02/2026',
    user: 'System',
    action: 'Dọn dẹp log file',
    status: 'warning',
  },
];

/**
 * Admin Dashboard Store
 */
export const useAdminDashboardStore = create(
  devtools(
    (set, get) => ({
      // State
      systemStats: null,
      recentActivities: [],
      isLoading: false,
      error: null,

      // Actions
      fetchSystemStats: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with API call
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({ systemStats: MOCK_SYSTEM_STATS, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchRecentActivities: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with API call
          await new Promise((resolve) => setTimeout(resolve, 200));
          set({ recentActivities: MOCK_RECENT_ACTIVITIES, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Toggle maintenance mode
      toggleMaintenanceMode: async () => {
        const { systemStats } = get();
        if (!systemStats) return;

        set({ isLoading: true });
        try {
          // TODO: Replace with API call
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({
            systemStats: {
              ...systemStats,
              isMaintenanceMode: !systemStats.isMaintenanceMode,
            },
            isLoading: false,
          });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () =>
        set({
          systemStats: null,
          recentActivities: [],
          isLoading: false,
          error: null,
        }),
    }),
    { name: 'AdminDashboardStore' }
  )
);

export default useAdminDashboardStore;
