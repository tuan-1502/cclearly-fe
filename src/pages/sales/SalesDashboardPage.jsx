// Sales Dashboard Page
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { orders } from '@/mocks/data'
import { Clock, Wrench, CheckCircle, Package, Search, Filter } from 'lucide-react'

const SalesDashboardPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const processingOrders = orders.filter(o => o.status === 'processing')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Đang xử lý', class: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Đang giao', class: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800' },
    }
    return map[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Sales Dashboard</h1>
          <p className="text-[#4f5562]">Xin chào, {user?.name || 'Sales'}!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#222]">{pendingOrders.length}</p>
              <p className="text-[#4f5562]">Đơn chờ xác nhận</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Wrench className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#222]">{processingOrders.length}</p>
              <p className="text-[#4f5562]">Đơn đang xử lý</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#222]">{orders.filter(o => o.status === 'delivered').length}</p>
              <p className="text-[#4f5562]">Đơn hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang giao</option>
              <option value="delivered">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)]">
        <h3 className="text-lg font-semibold text-[#222] mb-4">Danh sách đơn hàng ({filteredOrders.length})</h3>
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status)
            return (
              <div key={order.id} className="flex items-center justify-between p-4 bg-[#f9f9f9] rounded-xl hover:bg-gray-100 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ececec] rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-[#222]">{order.id}</p>
                    <p className="text-sm text-[#4f5562]">{order.shippingAddress?.name}</p>
                    <p className="text-xs text-[#4f5562]">{order.items?.length} sản phẩm</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#222]">{formatCurrency(order.totalAmount)}</p>
                  <span className={`px-3 py-1 rounded-full text-xs ${statusBadge.class}`}>
                    {statusBadge.label}
                  </span>
                  <p className="text-xs text-[#4f5562] mt-1">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            )
          })}
          {filteredOrders.length === 0 && (
            <p className="text-center text-[#4f5562] py-8">Không tìm thấy đơn hàng nào</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalesDashboardPage
