import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminDashboardStore } from '@stores/adminDashboardStore';

/**
 * Admin Dashboard page component
 * Shows system overview, stats, and recent activities
 */
const AdminDashboard = () => {
  const {
    systemStats,
    recentActivities,
    isLoading,
    fetchSystemStats,
    fetchRecentActivities,
    toggleMaintenanceMode,
  } = useAdminDashboardStore();

  // Fetch data on mount
  useEffect(() => {
    fetchSystemStats();
    fetchRecentActivities();
  }, [fetchSystemStats, fetchRecentActivities]);

  return (
    <div className="space-y-8">
      {/* Maintenance Mode Toggle */}
      <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
            <span className="material-icons text-3xl">construction</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
              Chế độ Bảo trì Hệ thống
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
              Khi kích hoạt, khách hàng sẽ không thể truy cập website CClearly.{' '}
              <span className="font-medium text-primary cursor-pointer hover:underline">
                Tìm hiểu thêm.
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`text-sm font-bold uppercase tracking-wider ${
              !systemStats?.isMaintenanceMode ? 'text-primary' : 'text-slate-400'
            }`}
          >
            Tắt
          </span>
          <button
            onClick={toggleMaintenanceMode}
            disabled={isLoading}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              systemStats?.isMaintenanceMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                systemStats?.isMaintenanceMode ? 'left-7' : 'left-1'
              }`}
            ></div>
          </button>
          <span
            className={`text-sm font-bold uppercase tracking-wider ${
              systemStats?.isMaintenanceMode ? 'text-primary' : 'text-slate-400'
            }`}
          >
            Bật
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Server Status Card */}
        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
              <span className="material-icons">dns</span>
            </div>
            <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-bold">
              {systemStats?.serverStatusChange || '+0.01%'}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-tight">
              Trạng thái Server
            </p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold">
              {systemStats?.serverStatus || 'Hoạt động tốt'}
            </p>
          </div>
        </div>

        {/* Online Staff Card */}
        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
              <span className="material-icons">groups</span>
            </div>
            <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs font-bold">
              {systemStats?.onlineStaffChange || -2}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-tight">
              Nhân viên Online
            </p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold">
              {systemStats?.onlineStaff || 12} nhân viên
            </p>
          </div>
        </div>

        {/* Log Storage Card */}
        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
              <span className="material-icons">storage</span>
            </div>
            <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-bold">
              {systemStats?.logStorageChange || '+5%'}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-tight">
              Dung lượng Log
            </p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold">
              {systemStats?.logStorage?.used || 7.5} GB / {systemStats?.logStorage?.total || 10} GB
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{
                  width: `${
                    systemStats?.logStorage
                      ? (systemStats.logStorage.used / systemStats.logStorage.total) * 100
                      : 75
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons">person_add</span>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Thêm nhân viên
          </span>
        </Link>
        <Link
          to="/admin/roles"
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons">shield</span>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Phân quyền
          </span>
        </Link>
        <Link
          to="/admin/config"
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons">settings</span>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Cấu hình hệ thống
          </span>
        </Link>
        <Link
          to="/admin/banners"
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons">image</span>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Quản lý Banner
          </span>
        </Link>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-lg dark:text-white">Nhật ký hoạt động gần đây</h3>
          <Link
            to="/admin/logs"
            className="text-primary text-sm font-bold hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Nhân viên</th>
                <th className="px-6 py-4">Hành động</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4 text-sm dark:text-white">{activity.time}</td>
                  <td className="px-6 py-4 text-sm dark:text-white font-medium">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 text-sm dark:text-white">{activity.action}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        activity.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                          : activity.status === 'warning'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                      }`}
                    >
                      {activity.status === 'success'
                        ? 'Thành công'
                        : activity.status === 'warning'
                        ? 'Cảnh báo'
                        : 'Lỗi'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
