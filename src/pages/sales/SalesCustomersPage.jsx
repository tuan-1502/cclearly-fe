// Sales Customers Page - Quản lý khách hàng
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { customers, orders } from '@/mocks/data'
import { Search, User, Phone, Mail, ShoppingBag, DollarSign, MessageCircle } from 'lucide-react'

const SalesCustomersPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const filteredCustomers = customers.filter(cust => {
    return cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm)
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getCustomerOrders = (customerId) => {
    return orders.filter(o => o.userId === customerId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Khách hàng</h1>
        <p className="text-[#4f5562]">Xin chào, {user?.name || 'Sales'}!</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm: tên, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomer(cust)}
              className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition ${
                selectedCustomer?.id === cust.id ? 'ring-2 ring-[#0f5dd9]' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0f5dd9] rounded-full flex items-center justify-center text-white font-bold">
                  {cust.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#222]">{cust.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cust.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cust.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                  <p className="text-sm text-[#4f5562] flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" /> {cust.email}
                  </p>
                  <p className="text-sm text-[#4f5562] flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {cust.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-xl font-bold text-[#222]">{cust.totalOrders}</p>
                  <p className="text-xs text-[#4f5562]">Đơn hàng</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-[#222]">{formatCurrency(cust.totalSpent)}</p>
                  <p className="text-xs text-[#4f5562]">Tổng chi tiêu</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-[#222]">
                    {cust.totalOrders > 0 ? formatCurrency(cust.totalSpent / cust.totalOrders) : 0}
                  </p>
                  <p className="text-xs text-[#4f5562]">Giá trị TB</p>
                </div>
              </div>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-[#4f5562] bg-white rounded-xl">
              Không tìm thấy khách hàng nào
            </div>
          )}
        </div>

        {/* Customer Detail */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-6">
          {selectedCustomer ? (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#0f5dd9] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#222]">{selectedCustomer.name}</h3>
                  <p className="text-sm text-[#4f5562]">Khách hàng từ {new Date(selectedCustomer.joinDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#4f5562]" />
                  <span className="text-[#222]">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#4f5562]" />
                  <span className="text-[#222]">{selectedCustomer.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto text-[#0f5dd9] mb-2" />
                  <p className="text-xl font-bold text-[#222]">{selectedCustomer.totalOrders}</p>
                  <p className="text-xs text-[#4f5562]">Đơn hàng</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto text-[#0f5dd9] mb-2" />
                  <p className="text-xl font-bold text-[#222]">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  <p className="text-xs text-[#4f5562]">Tổng chi tiêu</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-[#222] mb-3">Lịch sử đơn hàng</h4>
                <div className="space-y-2">
                  {getCustomerOrders(selectedCustomer.id).map((order) => (
                    <div key={order.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                      <span className="font-medium">{order.id}</span>
                      <span className="text-[#4f5562]">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  ))}
                  {getCustomerOrders(selectedCustomer.id).length === 0 && (
                    <p className="text-sm text-[#4f5562] text-center py-4">Chưa có đơn hàng</p>
                  )}
                </div>
              </div>

              <button className="w-full mt-4 bg-[#0f5dd9] text-white py-2 rounded-xl font-medium hover:bg-[#0b4fc0] flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Liên hệ khách
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-[#4f5562]">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Chọn khách hàng để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalesCustomersPage
