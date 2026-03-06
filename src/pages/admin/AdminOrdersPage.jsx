import { useState } from 'react'
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrder'
import { Scan } from 'lucide-react'
import { toast } from 'react-toastify'
import Pagination from '@/components/ui/Pagination'
import ConfirmModal from '@/components/ui/ConfirmModal'

const PAGE_SIZES = [5, 10, 20, 30, 50]

const AdminOrdersPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    type: '',
  })

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    newStatus: null
  })

  const { data, isLoading, error } = useOrders(filters)
  const updateStatus = useUpdateOrderStatus()

  const handleStatusChangeClick = (orderId, newStatus) => {
    setConfirmModal({
      isOpen: true,
      orderId,
      newStatus
    })
  }

  const handleConfirmStatusChange = async () => {
    const { orderId, newStatus } = confirmModal
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus })
    } catch (err) {
      // Error handled by hook
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Đang xử lý', class: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Đang giao', class: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800' },
    }
    const info = statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${info.class}`}>{info.label}</span>
  }

  const getTypeLabel = (type) => {
    const typeMap = {
      regular: 'Mua hàng',
      preorder: 'Pre-order',
      prescription: 'Kính theo đơn',
    }
    return typeMap[type] || type
  }

  const orders = data?.items || []
  const totalPages = data?.meta?.totalPages || 1

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222]">Quản lý đơn hàng</h1>
        <p className="text-[#4f5562] mt-1">Theo dõi và xử lý đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-white min-w-[180px]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="delivered">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-white min-w-[180px]"
          >
            <option value="">Tất cả loại đơn</option>
            <option value="regular">Mua hàng</option>
            <option value="preorder">Pre-order</option>
            <option value="prescription">Kính theo đơn</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#4f5562]">Đang tải...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-[#4f5562]">Không có đơn hàng nào</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f3f3f3]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loại</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececec]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-2.5 font-bold text-sm text-[#222]">{order.id}</td>
                      <td className="px-4 py-2.5 text-xs text-[#4f5562]">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                          {order.type === 'prescription' && <Scan className="w-3 h-3 text-[#0f5dd9]" />}
                          {getTypeLabel(order.type)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-[#222] font-medium">{order.shippingAddress?.name || 'N/A'}</td>
                      <td className="px-4 py-2.5 text-sm font-bold text-[#222]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                      </td>
                      <td className="px-4 py-2.5">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(order.status === 'confirmed' || order.status === 'processing') && (
                            <button
                              onClick={() => {
                                toast.success('Đang khởi tạo vận đơn GHN...');
                                setTimeout(() => toast.info('Vận đơn #GHN123456 đã được tạo!'), 1000);
                              }}
                              className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-orange-100 transition whitespace-nowrap"
                            >
                              Tạo vận đơn
                            </button>
                          )}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChangeClick(order.id, e.target.value)}
                            className="text-[11px] font-bold border border-[#e0e0e0] rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#0f5dd9] transition-colors cursor-pointer"
                            disabled={updateStatus.isPending}
                          >
                            <option value="pending">CHỜ</option>
                            <option value="confirmed">XÁC NHẬN</option>
                            <option value="processing">XỬ LÝ</option>
                            <option value="shipped">GIAO</option>
                            <option value="delivered">XONG</option>
                            <option value="cancelled">HỦY</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination & Limit */}
            <div className="p-6 border-t border-[#ececec] flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#4f5562]">Hiển thị:</span>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
                  className="px-3 py-1.5 border border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#0f5dd9] bg-white cursor-pointer"
                >
                  {PAGE_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-sm text-[#4f5562]">đơn hàng</span>
              </div>

              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmStatusChange}
        title="Xác nhận cập nhật"
        message={`Bạn có chắc muốn cập nhật trạng thái đơn hàng này?`}
        confirmText="Cập nhật"
        type="info"
      />
    </div>
  )
}

export default AdminOrdersPage
