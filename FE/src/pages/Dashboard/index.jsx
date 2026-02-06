/**
 * Dashboard page component
 * Protected route - requires authentication
 */
const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p>Chào mừng bạn đến với trang quản lý!</p>

      <div className="dashboard-stats">
        {/* Add dashboard widgets/stats here */}
      </div>
    </div>
  );
};

export default DashboardPage;
