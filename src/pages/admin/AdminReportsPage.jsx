// Admin Reports Page - Báo cáo cho System Admin
import { useAuth } from '@/contexts/AuthContext'
import { dashboardStats, products, revenueByDay } from '@/mocks/data'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  ChevronRight,
  Filter,
  Calendar
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts'

const AdminReportsPage = () => {
  const { user } = useAuth()
  const stats = dashboardStats

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  const COLORS = ['#0f5dd9', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b']

  const statusData = Object.entries(stats.ordersByStatus).map(([name, value]) => ({
    name: name === 'pending' ? 'Chờ xử lý' :
      name === 'confirmed' ? 'Đã xác nhận' :
        name === 'processing' ? 'Đang gia công' :
          name === 'shipped' ? 'Đang giao' :
            name === 'delivered' ? 'Hoàn thành' : 'Đã hủy',
    value
  }))

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#222]">Báo cáo & Phân tích</h1>
          <p className="text-[#4f5562] mt-1">Dữ liệu kinh doanh chi tiết của CClearly</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e0e0e0] rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <Filter size={16} />
            7 ngày qua
          </button>
          <button className="px-5 py-2.5 bg-[#141f36] text-white rounded-xl text-sm font-medium hover:bg-[#0d1322] transition shadow-lg shadow-black/10">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={<DollarSign className="text-green-600" />}
          title="Doanh thu tháng này"
          value={formatCurrency(stats.totalRevenue)}
          trend="+12.5%"
          isUp={true}
          bgColor="bg-green-50"
        />
        <KPICard
          icon={<ShoppingCart className="text-blue-600" />}
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          trend="+5.2%"
          isUp={true}
          bgColor="bg-blue-50"
        />
        <KPICard
          icon={<Users className="text-purple-600" />}
          title="Khách hàng mới"
          value={stats.totalCustomers.toLocaleString()}
          trend="+8.3%"
          isUp={true}
          bgColor="bg-purple-50"
        />
        <KPICard
          icon={<Package className="text-orange-600" />}
          title="Sản phẩm đang bán"
          value={stats.totalProducts}
          trend="-2.1%"
          isUp={false}
          bgColor="bg-orange-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Daily Revenue Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)] border border-[#f0f0f0]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#222] flex items-center gap-2">
              <Calendar size={20} className="text-[#0f5dd9]" />
              Doanh thu 7 ngày qua
            </h3>
            <div className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Tăng trưởng ổn định
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...revenueByDay].reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [formatCurrency(val), 'Doanh thu']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f5dd9"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0f5dd9', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Line */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)] border border-[#f0f0f0]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#222]">Xu hướng doanh thu</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#0f5dd9] rounded-full"></span>
                <span className="text-[#4f5562]">Doanh thu</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueByMonth}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f5dd9" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0f5dd9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                  tickFormatter={(val) => `Tháng ${val}`}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [formatCurrency(val), 'Doanh thu']}
                  labelFormatter={(val) => `Tháng ${val}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f5dd9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)] border border-[#f0f0f0]">
          <h3 className="text-lg font-bold text-[#222] mb-8">Tỷ lệ đơn hàng</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-[#4f5562] flex items-center justify-between">
              <span>Năng suất trung bình:</span>
              <span className="font-semibold text-green-600">85%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)] border border-[#f0f0f0]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#222]">Sản phẩm bán chạy</h3>
            <button className="text-[#0f5dd9] text-sm font-medium hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {stats.topProducts.map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition">
                <div className="w-10 h-10 bg-[#f3f3f3] rounded-lg flex items-center justify-center font-bold text-[#0f5dd9]">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#222] group-hover:text-[#0f5dd9] transition">{item.name}</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5">
                    <div
                      className="h-full bg-[#0f5dd9] rounded-full transition-all duration-1000"
                      style={{ width: `${(item.sold / stats.topProducts[0].sold) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#222]">{item.sold}</p>
                  <p className="text-[10px] text-[#4f5562] uppercase tracking-wider">Đã bán</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)] border border-[#f0f0f0]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#222]">Cảnh báo tồn kho</h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
              {products.filter(p => p.stock < 20).length} Cảnh báo
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 px-2">Sản phẩm</th>
                  <th className="pb-3 px-2">SKU</th>
                  <th className="pb-3 px-2 text-right">Tồn kho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.filter(p => p.stock < 20).slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-2">
                      <p className="text-sm font-medium text-[#222] truncate max-w-[180px]">{product.name}</p>
                    </td>
                    <td className="py-4 px-2 text-sm text-[#4f5562] uppercase">{product.sku}</td>
                    <td className="py-4 px-2 text-right">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${product.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const KPICard = ({ icon, title, value, trend, isUp, bgColor }) => (
  <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)] border border-[#f0f0f0] transition-transform hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {trend}
      </div>
    </div>
    <p className="text-2xl font-bold text-[#222]">{value}</p>
    <p className="text-sm text-[#94a3b8] font-medium mt-1">{title}</p>
  </div>
)

export default AdminReportsPage
