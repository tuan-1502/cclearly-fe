// Sales Returns Page - Xử lý đổi trả & khiếu nại
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { returns as initialReturns } from '@/mocks/data'
import { Search, Eye, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { toast } from 'react-toastify'

const SalesReturnsPage = () => {
  const { user } = useAuth()
  const [returns, setReturns] = useState(initialReturns)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null, itemId: null })

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ret.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Đã duyệt', class: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      rejected: { label: 'Từ chối', class: 'bg-red-100 text-red-800' },
    }
    return map[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
  }

  const getTypeBadge = (type) => {
    return type === 'return'
      ? { label: 'Hoàn tiền', class: 'bg-orange-100 text-orange-800' }
      : { label: 'Đổi hàng', class: 'bg-purple-100 text-purple-800' }
  }

  const handleApprove = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'success',
      title: 'Duyệt yêu cầu',
      message: `Bạn có muốn duyệt yêu cầu ${id} không?`,
      itemId: id,
      onConfirm: () => {
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', processedDate: new Date().toISOString() } : r))
        toast.success(`Đã duyệt yêu cầu ${id}`)
      }
    })
  }

  const handleReject = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Từ chối yêu cầu',
      message: `Bạn có chắc chắn muốn từ chối yêu cầu ${id}?`,
      itemId: id,
      onConfirm: () => {
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', processedDate: new Date().toISOString() } : r))
        toast.error(`Đã từ chối yêu cầu ${id}`)
      }
    })
  }

  const handleComplete = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'success',
      title: 'Hoàn thành xử lý',
      message: `Đánh dấu yêu cầu ${id} đã hoàn thành?`,
      itemId: id,
      onConfirm: () => {
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status: 'completed', processedDate: new Date().toISOString() } : r))
        toast.success(`Đã hoàn thành xử lý yêu cầu ${id}`)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Đổi trả & Khiếu nại</h1>
        <p className="text-[#4f5562]">Xin chào, {user?.name || 'Sales'}!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#222]">{returns.filter(r => r.status === 'pending').length}</p>
          <p className="text-sm text-[#4f5562]">Chờ xử lý</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#222]">{returns.filter(r => r.status === 'approved').length}</p>
          <p className="text-sm text-[#4f5562]">Đã duyệt</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#222]">{returns.filter(r => r.status === 'completed').length}</p>
          <p className="text-sm text-[#4f5562]">Hoàn thành</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#222]">{returns.length}</p>
          <p className="text-sm text-[#4f5562]">Tổng yêu cầu</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm: mã yêu cầu, mã đơn, tên khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="approved">Đã duyệt</option>
            <option value="completed">Hoàn thành</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReturns.map((ret) => {
          const statusBadge = getStatusBadge(ret.status)
          const typeBadge = getTypeBadge(ret.type)
          return (
            <div key={ret.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#222]">{ret.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${typeBadge.class}`}>{typeBadge.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge.class}`}>{statusBadge.label}</span>
                    </div>
                    <p className="text-sm text-[#4f5562]">Order: {ret.orderId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#222]">{formatCurrency(ret.refundAmount)}</p>
                  <p className="text-xs text-[#4f5562]">
                    {new Date(ret.requestDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-[#222]">Thông tin khách hàng</p>
                  <p className="text-sm text-[#4f5562]">{ret.customerName}</p>
                  <p className="text-sm text-[#4f5562]">{ret.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#222]">Lý do</p>
                  <p className="text-sm text-[#4f5562]">{ret.reason}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-[#222] mb-2">Sản phẩm</p>
                {ret.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span className="text-[#4f5562]">{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {ret.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(ret.id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(ret.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Từ chối
                  </button>
                </div>
              )}
              {ret.status === 'approved' && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleComplete(ret.id)}
                    className="w-full bg-[#0f5dd9] text-white py-2 rounded-xl font-medium hover:bg-[#0b4fc0]"
                  >
                    Hoàn thành xử lý
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {filteredReturns.length === 0 && (
          <div className="text-center py-12 text-[#4f5562] bg-white rounded-xl">
            Không tìm thấy yêu cầu nào
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.type === 'danger' ? 'Từ chối' : 'Xác nhận'}
      />
    </div>
  )
}

export default SalesReturnsPage
