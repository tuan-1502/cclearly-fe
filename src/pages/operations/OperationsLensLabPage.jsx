// Operations Lens Lab Page - Gia công tròng kính
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { orders as initialOrders } from '@/mocks/data'
import { TestTube, CheckCircle, XCircle, Eye, Package } from 'lucide-react'
import { toast } from 'react-toastify'
import ConfirmModal from '@/components/ui/ConfirmModal'

const OperationsLensLabPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState(initialOrders)
  const [qcFailModal, setQcFailModal] = useState({ isOpen: false, orderId: null, reason: '' })

  // Lọc đơn prescription
  const prescriptionOrders = orders.filter(o => o.type === 'prescription' && (o.status === 'confirmed' || o.status === 'processing'))

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Đang gia công', class: 'bg-purple-100 text-purple-800' },
      qc: { label: 'Chờ QC', class: 'bg-orange-100 text-orange-800' },
      completed: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
    }
    return map[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  const handleStartWork = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'processing', updatedAt: new Date().toISOString() } : o))
    toast.success(`Đã bắt đầu gia công cho đơn ${orderId}`)
  }

  const handleQC = (orderId, pass) => {
    if (pass) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed', updatedAt: new Date().toISOString() } : o))
      toast.success(`Đơn ${orderId} đã qua QC - sẵn sàng đóng gói`)
    } else {
      setQcFailModal({ isOpen: true, orderId, reason: '' })
    }
  }

  const confirmQCFail = () => {
    if (qcFailModal.reason) {
      toast.error(`Đơn ${qcFailModal.orderId} fail QC - ${qcFailModal.reason}. Yêu cầu làm lại.`)
      setQcFailModal({ isOpen: false, orderId: null, reason: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Gia công tròng kính</h1>
        <p className="text-[#4f5562]">Xin chào, {user?.name || 'Operations'}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{prescriptionOrders.filter(o => o.status === 'confirmed').length}</p>
          <p className="text-sm text-[#4f5562]">Chờ gia công</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-purple-600">{prescriptionOrders.filter(o => o.status === 'processing').length}</p>
          <p className="text-sm text-[#4f5562]">Đang gia công</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{prescriptionOrders.filter(o => o.status === 'completed').length}</p>
          <p className="text-sm text-[#4f5562]">Hoàn thành</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {prescriptionOrders.map((order) => {
          const statusBadge = getStatusBadge(order.status)
          return (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#222]">{order.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">Theo đơn kính</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge.class}`}>{statusBadge.label}</span>
                    </div>
                    <p className="text-sm text-[#4f5562]">{order.shippingAddress?.name} - {order.shippingAddress?.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#222]">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-xs text-[#4f5562]">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* Rx Info */}
              {order.prescription && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="font-medium text-[#222] mb-2">Thông số đơn kính (Rx):</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#4f5562]">Mắt phải (OD):</p>
                      <p className="font-medium">SPH: {order.prescription.rightEye.sph} | CYL: {order.prescription.rightEye.cyl} | AXIS: {order.prescription.rightEye.axis}</p>
                    </div>
                    <div>
                      <p className="text-[#4f5562]">Mắt trái (OS):</p>
                      <p className="font-medium">SPH: {order.prescription.leftEye.sph} | CYL: {order.prescription.leftEye.cyl} | AXIS: {order.prescription.leftEye.axis}</p>
                    </div>
                    <div>
                      <p className="text-[#4f5562]">Khoảng cách đồng tử (PD):</p>
                      <p className="font-medium">{order.prescription.pd}mm</p>
                    </div>
                    {order.prescription.add && (
                      <div>
                        <p className="text-[#4f5562]">ADD:</p>
                        <p className="font-medium">+{order.prescription.add}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm font-medium text-[#222] mb-2">Sản phẩm:</p>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span className="text-[#4f5562]">{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {order.status === 'confirmed' && (
                <button
                  onClick={() => handleStartWork(order.id)}
                  className="w-full bg-purple-500 text-white py-2 rounded-xl font-medium hover:bg-purple-600"
                >
                  Bắt đầu gia công
                </button>
              )}
              {order.status === 'processing' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQC(order.id, true)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> QC Pass
                  </button>
                  <button
                    onClick={() => handleQC(order.id, false)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> QC Fail
                  </button>
                </div>
              )}
              {order.status === 'completed' && (
                <div className="bg-green-50 text-green-700 py-2 rounded-xl text-center font-medium">
                  ✓ Gia công hoàn tất - Chuyển sang đóng gói
                </div>
              )}
            </div>
          )
        })}

        {prescriptionOrders.length === 0 && (
          <div className="text-center py-12 text-[#4f5562] bg-white rounded-xl">
            Không có đơn Rx nào cần xử lý
          </div>
        )}
      </div>

      {/* QC Fail Modal */}
      {qcFailModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setQcFailModal({ isOpen: false, orderId: null, reason: '' })} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#222] mb-4">QC Fail - Nhập lý do</h3>
            <textarea
              placeholder="Nhập lý do fail QC..."
              value={qcFailModal.reason}
              onChange={(e) => setQcFailModal({ ...qcFailModal, reason: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4 h-24 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setQcFailModal({ isOpen: false, orderId: null, reason: '' })}
                className="flex-1 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={confirmQCFail}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Xác nhận Fail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OperationsLensLabPage
