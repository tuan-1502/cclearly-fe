// Operations Shipping Page - Giao vận & Tracking
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { orders as initialOrders } from '@/mocks/data'
import { Search, Truck, MapPin, CheckCircle, AlertCircle, Package } from 'lucide-react'
import { toast } from 'react-toastify'
import ConfirmModal from '@/components/ui/ConfirmModal'

const OperationsShippingPage = () => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'info', title: '', message: '', orderId: null, action: null })
  const [trackingModal, setTrackingModal] = useState({ isOpen: false, orderId: null, tracking: '' })
  const { user } = useAuth()
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')

  const shippedOrders = orders.filter(o => o.status === 'shipped')

  const filteredOrders = shippedOrders.filter(order => {
    return order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleUpdateStatus = (orderId) => {
    setConfirmModal({
      isOpen: true,
      type: 'info',
      title: 'Xác nhận giao hàng',
      message: `Xác nhận rằng đơn hàng ${orderId} đã được giao thành công cho khách hàng?`,
      onConfirm: () => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'delivered', updatedAt: new Date().toISOString() } : o))
        toast.success(`Đã cập nhật đơn ${orderId} thành đã giao`)
      }
    })
  }

  const handleGenerateLabel = (orderId) => {
    toast.info(`Đang tạo mã vận đơn từ đơn vị vận chuyển cho đơn ${orderId}...`)
    setTimeout(() => {
      const carriers = ['GHN', 'GHTK', 'Viettel Post']
      const carrier = carriers[Math.floor(Math.random() * carriers.length)]
      const tracking = (carrier === 'GHN' ? 'GHN-' : carrier === 'GHTK' ? 'S' : 'VT-') + Math.random().toString(36).substring(2, 10).toUpperCase()

      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        trackingNumber: tracking,
        carrier: carrier,
        updatedAt: new Date().toISOString()
      } : o))
      toast.success(`Đã tạo vận đơn ${carrier}: ${tracking}`)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Giao vận & Tracking</h1>
        <p className="text-[#4f5562]">Quản lý hành trình đơn hàng và đơn vị vận chuyển</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl font-bold text-orange-600">{shippedOrders.length}</p>
              <p className="text-sm text-[#4f5562] font-medium">Đang giao hàng</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-sm text-[#4f5562] font-medium">Đã giao thành công</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl font-bold text-[#0f5dd9]">{orders.filter(o => o.trackingNumber).length}</p>
              <p className="text-sm text-[#4f5562] font-medium">Tổng vận đơn</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <MapPin className="w-6 h-6 text-[#0f5dd9]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, mã vận đơn (GHN, GHTK)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#f9f9f9] border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0f5dd9] text-sm"
            />
          </div>
          <select className="bg-[#f9f9f9] border border-gray-200 rounded-full px-6 py-3 text-sm focus:outline-none">
            <option>Tất cả đơn vị</option>
            <option>GHN (Giao Hàng Nhanh)</option>
            <option>GHTK (Giao Hàng Tiết Kiệm)</option>
            <option>Viettel Post</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-[#222]">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {order.status === 'delivered' ? 'Đã giao' : 'Đang giao'}
                    </span>
                  </div>
                  <p className="text-sm text-[#4f5562] mt-0.5">{order.shippingAddress?.name} • {order.shippingAddress?.phone}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold text-[#222]">{formatCurrency(order.totalAmount)}</p>
                <p className="text-xs text-[#4f5562]">{new Date(order.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="bg-[#fcfcfc] rounded-2xl p-5 border border-gray-50 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-[#0f5dd9]" />
                    <p className="text-sm font-bold text-[#222]">Hành trình vận chuyển</p>
                  </div>

                  {/* Custom Timeline */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      <p className="text-xs font-bold text-[#222]">Đã lấy hàng thành công</p>
                      <p className="text-[10px] text-[#4f5562]">Kho tổng CClearly • 09:30, 05/03/2026</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      <p className="text-xs font-bold text-[#222]">Rời kho trung chuyển phía Bắc</p>
                      <p className="text-[10px] text-[#4f5562]">Hub Hà Nội • 14:20, 05/03/2026</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                      <p className="text-xs font-bold text-[#222]">{order.status === 'delivered' ? 'Giao hàng thành công' : 'Đang đến trạm giao hàng'}</p>
                      <p className="text-[10px] text-[#4f5562]">Cập nhật lần cuối • {new Date(order.updatedAt).toLocaleTimeString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-[#fcfcfc] rounded-2xl p-5 border border-gray-50 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-4 h-4 text-[#0f5dd9]" />
                    <p className="text-sm font-bold text-[#222]">Thông tin vận đơn</p>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-[10px] text-[#4f5562] uppercase font-bold tracking-wider">Đơn vị vận chuyển</p>
                      <p className="text-sm font-medium text-[#222]">{order.carrier || 'Chưa chỉ định'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#4f5562] uppercase font-bold tracking-wider">Mã vận đơn</p>
                      {order.trackingNumber ? (
                        <p className="text-sm font-mono font-bold text-[#0f5dd9] bg-blue-50 px-2 py-1 rounded inline-block mt-1">{order.trackingNumber}</p>
                      ) : (
                        <p className="text-sm text-red-500 italic mt-1">Chưa cập nhật</p>
                      )}
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <button className="mt-4 w-full text-[11px] font-bold text-[#0f5dd9] flex items-center justify-center gap-1 hover:underline">
                      Xem hành trình thực tế trên {order.carrier}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 mt-6 font-bold">
              {!order.trackingNumber ? (
                <button
                  onClick={() => handleGenerateLabel(order.id)}
                  className="bg-[#141f36] text-white px-6 py-3 rounded-full text-sm hover:bg-black transition flex items-center gap-2"
                >
                  <Package className="w-4 h-4" /> Lấy mã vận đơn (GHN/GHTK)
                </button>
              ) : (
                <button
                  className="bg-gray-100 text-gray-500 px-6 py-3 rounded-full text-sm cursor-not-allowed flex items-center gap-2"
                  disabled
                >
                  <CheckCircle className="w-4 h-4" /> Đã lấy vận đơn
                </button>
              )}

              {order.status !== 'delivered' && (
                <button
                  onClick={() => handleUpdateStatus(order.id)}
                  className="bg-[#0f5dd9] text-white px-6 py-3 rounded-full text-sm hover:bg-[#0b4fc0] transition"
                >
                  Xác nhận giao thành công
                </button>
              )}

              <button className="ml-auto text-sm text-[#4f5562] hover:text-[#222] transition">
                In nhãn dán
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-[#4f5562] font-medium">Không tìm thấy đơn hàng nào khớp với tìm kiếm</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.onConfirm()
          setConfirmModal({ ...confirmModal, isOpen: false })
        }}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  )
}

export default OperationsShippingPage
