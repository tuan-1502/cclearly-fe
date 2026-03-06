// Operations Board Page - Kanban điều phối đơn hàng
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { orders as initialOrders } from '@/mocks/data'
import { Package, Truck, CheckCircle, Clock, Box, TestTube } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { toast } from 'react-toastify'

const OperationsBoardPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState(initialOrders)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'info', title: '', message: '', orderId: null, newStatus: '' })

  // Lọc đơn theo trạng thái cho từng cột
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed')
  const processingOrders = orders.filter(o => o.status === 'processing')
  const packagingOrders = orders.filter(o => o.status === 'processing')
  const shippedOrders = orders.filter(o => o.status === 'shipped')

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Đang xử lý', class: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Đang giao', class: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
    }
    return map[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  const handleMoveOrder = (orderId, newStatus, statusLabel) => {
    setConfirmModal({
      isOpen: true,
      type: 'info',
      title: 'Cập nhật trạng thái',
      message: `Chuyển đơn ${orderId} sang "${statusLabel}"?`,
      orderId,
      newStatus,
    })
  }

  const confirmMoveOrder = () => {
    if (confirmModal.orderId) {
      setOrders(prev => prev.map(o => o.id === confirmModal.orderId ? { ...o, status: confirmModal.newStatus, updatedAt: new Date().toISOString() } : o))
      toast.success('Cập nhật trạng thái thành công')
    }
  }

  const columns = [
    { id: 'pending', title: 'Chờ xử lý', icon: Clock, orders: pendingOrders, color: 'yellow' },
    { id: 'processing', title: 'Đang gia công', icon: TestTube, orders: processingOrders, color: 'purple' },
    { id: 'packaging', title: 'Đóng gói', icon: Box, orders: packagingOrders, color: 'blue' },
    { id: 'shipping', title: 'Đang giao', icon: Truck, orders: shippedOrders, color: 'orange' },
  ]

  const colorMap = {
    yellow: 'bg-yellow-100 border-yellow-200',
    purple: 'bg-purple-100 border-purple-200',
    blue: 'bg-blue-100 border-blue-200',
    orange: 'bg-orange-100 border-orange-200',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Điều phối đơn hàng</h1>
        <p className="text-[#4f5562]">Xin chào, {user?.name || 'Operations'}!</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
          <p className="text-sm text-[#4f5562]">Chờ xử lý</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-purple-600">{processingOrders.length}</p>
          <p className="text-sm text-[#4f5562]">Đang gia công</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{packagingOrders.length}</p>
          <p className="text-sm text-[#4f5562]">Đóng gói</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-orange-600">{shippedOrders.length}</p>
          <p className="text-sm text-[#4f5562]">Đang giao</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className={`rounded-xl p-4 ${colorMap[column.color]}`}>
            <div className="flex items-center gap-2 mb-4">
              <column.icon className={`w-5 h-5 text-${column.color}-600`} />
              <h3 className="font-bold text-[#222]">{column.title}</h3>
              <span className="ml-auto bg-white px-2 py-1 rounded-full text-sm font-medium">
                {column.orders.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {column.orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#222]">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(order.status).class}`}>
                      {getStatusBadge(order.status).label}
                    </span>
                  </div>
                  <p className="text-sm text-[#4f5562] mb-2">{order.shippingAddress?.name}</p>
                  <div className="text-xs text-[#4f5562] mb-3">
                    {order.items?.map((item, idx) => (
                      <p key={idx} className="truncate">{item.name} x{item.quantity}</p>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium text-sm">{formatCurrency(order.totalAmount)}</span>
                    <span className="text-xs text-[#4f5562]">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    {column.id === 'pending' && (
                      <button
                        onClick={() => handleMoveOrder(order.id, 'processing', 'Đang gia công')}
                        className="w-full bg-purple-500 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-purple-600"
                      >
                        Bắt đầu gia công
                      </button>
                    )}
                    {column.id === 'processing' && (
                      <button
                        onClick={() => handleMoveOrder(order.id, 'processing')}
                        className="w-full bg-blue-500 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600"
                      >
                        Hoàn thành gia công
                      </button>
                    )}
                    {column.id === 'packaging' && (
                      <button
                        onClick={() => handleMoveOrder(order.id, 'shipped', 'Đang giao')}
                        className="w-full bg-orange-500 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600"
                      >
                        Chuyển giao hàng
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {column.orders.length === 0 && (
                <div className="text-center py-8 text-[#4f5562] text-sm">
                  Không có đơn hàng
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmMoveOrder}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  )
}

export default OperationsBoardPage
