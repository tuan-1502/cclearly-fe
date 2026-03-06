import { useAuth, ROLES } from "@/contexts/AuthContext"
import { dashboardStats, orders, getLowStockProducts } from "@/mocks/data"

import {
  Package,
  CheckCircle,
  Users,
  DollarSign,
  AlertTriangle,
} from "lucide-react"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts"

const AdminDashboard = () => {
  const { user, hasRole } = useAuth()

  const stats = dashboardStats
  const lowStockProducts = getLowStockProducts()
  const recentOrders = orders.slice(0, 5)

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)

  const getStatusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }

    return map[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-[1400px] mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222]">Dashboard</h1>
        <p className="text-[#4f5562] mt-1">
          Xin chào {user?.name || "Admin"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

        <StatCard
          icon={<Package className="text-blue-600" />}
          title="Đơn hàng mới"
          value={stats.pendingOrders}
        />

        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          title="Đã hoàn thành"
          value={stats.ordersByStatus.delivered}
        />

        {hasRole([ROLES.MANAGER, ROLES.ADMIN]) && (
          <>
            <StatCard
              icon={<Users className="text-purple-600" />}
              title="Khách hàng"
              value={stats.totalCustomers.toLocaleString()}
            />

            <StatCard
              icon={<DollarSign className="text-orange-600" />}
              title="Doanh thu"
              value={(stats.totalRevenue / 1000000).toFixed(0) + "M"}
            />
          </>
        )}

      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* REVENUE CHART */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="font-semibold mb-4">
            Doanh thu theo tháng
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.revenueByMonth}>
              <XAxis dataKey="month" />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#0f5dd9" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* LOW STOCK */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Sản phẩm tồn kho thấp
          </h3>

          <div className="space-y-3">

            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0,5).map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between bg-[#fff5f5] p-3 rounded-xl"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      SKU: {p.sku}
                    </p>
                  </div>

                  <span className="text-red-600 font-semibold">
                    {p.stock}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Không có sản phẩm tồn kho thấp
              </p>
            )}

          </div>

        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h3 className="font-semibold mb-4">
          Đơn hàng gần đây
        </h3>

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

              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">

                  <td className="py-3 font-medium">
                    {order.id}
                  </td>

                  <td>
                    {order.shippingAddress?.name}
                  </td>

                  <td>
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard


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
  )
}