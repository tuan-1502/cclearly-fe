import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

/**
 * Admin Layout component with sidebar navigation
 */
const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.fullName) return 'A';
    const names = user.fullName.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  const sidebarLinks = [
    { to: '/admin', icon: 'dashboard', label: 'Tổng quan', end: true },
    { to: '/admin/users', icon: 'badge', label: 'Quản lý Nhân sự' },
    { to: '/admin/roles', icon: 'admin_panel_settings', label: 'Phân quyền (RBAC)' },
    { to: '/admin/config', icon: 'settings_suggest', label: 'Cấu hình Hệ thống' },
    { to: '/admin/banners', icon: 'view_carousel', label: 'Nội dung (Banner)' },
    { to: '/admin/logs', icon: 'history_edu', label: 'Nhật ký (Logs)' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar Navigation */}
      <aside
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } bg-primary dark:bg-[#081a1a] flex flex-col h-full border-r border-white/10 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white rounded-full p-1.5 flex items-center justify-center flex-shrink-0">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">CC</span>
            </div>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold leading-tight">CClearly</h1>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                Admin System
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="material-icons">{link.icon}</span>
              {!isSidebarCollapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Toggle & Support */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all font-medium text-sm"
          >
            <span className="material-icons text-lg">
              {isSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
            {!isSidebarCollapsed && 'Thu gọn'}
          </button>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all font-medium text-sm"
          >
            <span className="material-icons text-lg">storefront</span>
            {!isSidebarCollapsed && 'Về trang chủ'}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold dark:text-white">Bảng điều khiển Admin</h2>
            <div className="relative w-64 hidden md:block">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary"
                placeholder="Tìm kiếm hệ thống..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Status */}
            <div className="flex items-center gap-2 mr-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hidden lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-500">Hệ thống ổn định</span>
            </div>

            {/* Notifications */}
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-icons">notifications</span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

            {/* User Info */}
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-white">{user?.fullName || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                  {user?.role?.name || user?.role || 'Administrator'}
                </p>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm cursor-pointer border-2 border-primary/20">
                  {getUserInitials()}
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 rounded-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="material-icons text-lg">person</span>
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                  >
                    <span className="material-icons text-lg">logout</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
