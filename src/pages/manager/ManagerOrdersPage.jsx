// Manager Orders Page
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { orders } from '@/mocks/data'
import { Search, Filter, Eye } from 'lucide-react'
import Pagination from '@/components/ui/Pagination'

const PAGE_SIZES = [5, 10, 15, 20, 30, 50]

const ManagerOrdersPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalItems = filteredOrders.length
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(totalItems / pageSize)
  const startIndex = pageSize === 'all' ? 0 : (currentPage - 1) * pageSize
  const endIndex = pageSize === 'all' ? totalItems : startIndex + pageSize
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (e) => {
    const newSize = e.target.value === 'all' ? 'all' : parseInt(e.target.value)
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

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
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Quản lý đơn hàng</h1>
        <p className="text-[#4f5562]">Xin chào, {user?.name || 'Manager'}!</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status)
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#222]">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#222]">{order.shippingAddress?.name}</p>
                    <p className="text-xs text-[#4f5562]">{order.shippingAddress?.phone}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusBadge.class}`}>{statusBadge.label}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#222]">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4f5562]">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {paginatedOrders.length === 0 && (
          <div className="text-center py-12 text-[#4f5562]">Không tìm thấy đơn hàng nào</div>
        )}
      </div>

      {/* Pagination with Page Size */}
      {totalItems > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#4f5562]">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
            >
              {PAGE_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
              <option value="all">Tất cả</option>
            </select>
            <span className="text-sm text-[#4f5562]">/ {totalItems} kết quả</span>
          </div>

          {pageSize !== 'all' && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ManagerOrdersPage
