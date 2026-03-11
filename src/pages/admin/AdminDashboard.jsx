import {
  Package,
  CheckCircle,
  Users,
  DollarSign,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import { useAdminDashboard } from '@/hooks/useAdmin';
import { useAdminOrders } from '@/hooks/useOrder';

const AdminDashboard = () => {
  const { user, hasRole } = useAuth();

  const { data: stats, isLoading: loadingStats } = useAdminDashboard();
  const { data: ordersData, isLoading: loadingOrders } = useAdminOrders({
    page: 1,
    size: 5,
  });

  const recentOrders = ordersData?.items || [];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      RETURN_REQUESTED: 'bg-pink-100 text-pink-800',
      RETURNED: 'bg-gray-200 text-gray-800',
    };

    return map[s] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const s = status?.toUpperCase();
    const map = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
      RETURN_REQUESTED: 'Yêu cầu đổi trả',
      RETURNED: 'Đã trả hàng',
    };
    return map[s] || status;
  };

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222]">Dashboard</h1>
        <p className="text-[#4f5562] mt-1">Xin chào {user?.name || 'Admin'}</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Package className="text-blue-600" />}
          title="Đơn hàng mới"
          value={stats?.pendingOrders ?? 0}
        />

        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          title="Đã hoàn thành"
          value={stats?.deliveredOrders ?? 0}
        />

        {hasRole([ROLES.MANAGER, ROLES.ADMIN]) && (
          <>
            <StatCard
              icon={<Users className="text-purple-600" />}
              title="Khách hàng"
              value={(stats?.totalCustomers ?? 0).toLocaleString()}
            />

            <StatCard
              icon={<DollarSign className="text-orange-600" />}
              title="Doanh thu"
              value={
                (Number(stats?.totalRevenue ?? 0) / 1000000).toFixed(0) + 'M'
              }
            />
          </>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* REVENUE CHART */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">Doanh thu theo tháng</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats?.revenueByMonth || []}>
              <XAxis dataKey="month" />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#0f5dd9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Sản phẩm bán chạy
          </h3>

          <div className="space-y-3">
            {(stats?.topProducts || []).length > 0 ? (
              stats.topProducts.slice(0, 5).map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-gray-50 p-3 rounded-xl"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.type}</p>
                  </div>

                  <span className="text-blue-600 font-semibold">
                    {p.sold} đã bán
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Không có dữ liệu</p>
            )}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-4">Đơn hàng gần đây</h3>

        {loadingOrders ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left">
                <tr>
                  <th className="py-2">Order</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {(Array.isArray(recentOrders) ? recentOrders : []).map(
                  (order) => (
                    <tr key={order.orderId || order.id} className="border-b">
                      <td className="py-3 font-medium">
                        {order.code || order.orderId}
                      </td>

                      <td>{order.recipientName || 'N/A'}</td>

                      <td>{formatCurrency(order.finalAmount)}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
