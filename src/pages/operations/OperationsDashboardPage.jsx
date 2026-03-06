// Operations Dashboard Page
import { useState } from 'react'
import { orders, returns, getReturnsByStatus } from '@/mocks/data'
import { toast } from 'react-toastify'
import ConfirmModal from '@/components/ui/ConfirmModal'

const OperationsDashboardPage = () => {
  const [tab, setTab] = useState('pending')
  const [trackingModal, setTrackingModal] = useState({ isOpen: false, orderId: null, tracking: '' })

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed')
  const processingOrders = orders.filter(o => o.status === 'processing')
  const shippedOrders = orders.filter(o => o.status === 'shipped')
  const pendingReturns = getReturnsByStatus('pending')

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Đang gia công', class: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Đang giao', class: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800' },
    }
    return map[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  const getReturnStatusBadge = (status) => {
    const map = {
      pending: { label: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Đã duyệt', class: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      rejected: { label: 'Từ chối', class: 'bg-red-100 text-red-800' },
    }
    return map[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  const tabs = [
    { key: 'pending', label: 'Chờ xử lý', count: pendingOrders.length },
    { key: 'processing', label: 'Đang gia công', count: processingOrders.length },
    { key: 'shipping', label: 'Đang giao', count: shippedOrders.length },
    { key: 'returns', label: 'Đổi trả', count: pendingReturns.length },
  ]

  const currentOrders = tab === 'pending' ? pendingOrders : tab === 'processing' ? processingOrders : tab === 'shipping' ? shippedOrders : []

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleConfirmOrder = (orderId) => {
    toast.success(`Đã xác nhận đơn hàng ${orderId}`)
  }

  const handleCompleteOrder = (orderId) => {
    toast.success(`Đã hoàn thành đóng gói đơn hàng ${orderId}`)
  }

  const handleUpdateTracking = (orderId) => {
    setTrackingModal({ isOpen: true, orderId, tracking: '' })
  }

  const confirmUpdateTracking = () => {
    if (trackingModal.tracking) {
      toast.success(`Đã cập nhật mã vận đơn ${trackingModal.tracking} cho đơn hàng ${trackingModal.orderId}`)
      setTrackingModal({ isOpen: false, orderId: null, tracking: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Operations Dashboard</h1>
        <p className="text-[#4f5562]">Bảng điều phối đơn hàng</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#ececec] overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              tab === t.key
                ? 'border-[#0f5dd9] text-[#0f5dd9]'
                : 'border-transparent text-[#4f5562] hover:text-[#222]'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Returns Section */}
      {tab === 'returns' && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(13,22,39,0.06)]">
          <h3 className="text-lg font-semibold text-[#222] mb-4">Yêu cầu đổi trả</h3>
          <div className="space-y-3">
            {pendingReturns.length > 0 ? (
              pendingReturns.map((ret) => {
                const statusBadge = getReturnStatusBadge(ret.status)
                return (
                  <div key={ret.id} className="p-4 bg-[#f9f9f9] rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-[#222]">{ret.id}</p>
                        <p className="text-sm text-[#4f5562]">Order: {ret.orderId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-sm"><span className="font-medium">Khách:</span> {ret.customerName}</p>
                      <p className="text-sm"><span className="font-medium">Lý do:</span> {ret.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toast.success(`Đã duyệt yêu cầu ${ret.id}`)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-full text-sm font-medium hover:bg-green-600"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => toast.info(`Đã từ chối yêu cầu ${ret.id}`)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-full text-sm font-medium hover:bg-red-600"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-[#4f5562] py-8">Không có yêu cầu đổi trả nào</p>
            )}
          </div>
        </div>
      )}

      {/* Orders Board */}
      {tab !== 'returns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentOrders.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#4f5562]">
              Không có đơn hàng nào
            </div>
          ) : (
            currentOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status)
              return (
                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(13,22,39,0.06)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-[#222]">{order.id}</p>
                      <p className="text-sm text-[#4f5562]">{order.shippingAddress?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-[#4f5562]">{item.name}</span>
                        <span className="text-[#222]">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <p className="text-sm font-medium text-[#222]">Tổng: {formatCurrency(order.totalAmount)}</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-[#4f5562]">Mã vận đơn: {order.trackingNumber}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {tab === 'pending' && (
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        className="flex-1 bg-[#0f5dd9] text-white py-2 rounded-full text-sm font-medium hover:bg-[#0b4fc0]"
                      >
                        Xác nhận
                      </button>
                    )}
                    {tab === 'processing' && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="flex-1 bg-[#0f5dd9] text-white py-2 rounded-full text-sm font-medium hover:bg-[#0b4fc0]"
                      >
                        Hoàn thành đóng gói
                      </button>
                    )}
                    {tab === 'shipping' && (
                      <button
                        onClick={() => handleUpdateTracking(order.id)}
                        className="flex-1 bg-[#0f5dd9] text-white py-2 rounded-full text-sm font-medium hover:bg-[#0b4fc0]"
                      >
                        Cập nhật tracking
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default OperationsDashboardPage
