import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useClearCart } from '@/hooks/useCart'
import { useCreateOrder } from '@/hooks/useOrder'
import { useAuth } from '@/contexts/AuthContext'
import { Glasses, Tag, FileText, Check } from 'lucide-react'
import { toast } from 'react-toastify'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { data: cartData } = useCart()
  const createOrder = useCreateOrder()
  const clearCart = useClearCart()

  const cart = cartData?.data || cartData
  const items = cart?.items || []
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 500000 ? 0 : 30000

  // Get prescriptions from sessionStorage (passed from CartPage)
  const [prescriptions, setPrescriptions] = useState({})

  useEffect(() => {
    const savedPrescriptions = sessionStorage.getItem('cartPrescriptions')
    if (savedPrescriptions) {
      try {
        setPrescriptions(JSON.parse(savedPrescriptions))
      } catch (e) {
        console.error('Failed to parse prescriptions', e)
      }
    }
  }, [])

  // Check if all lens products have prescription
  const hasLensProduct = items.some(item => item.type === 'lens')
  const lensItemsWithoutPrescription = items.filter(item =>
    item.type === 'lens' && !prescriptions[item.id]
  )
  const canCheckout = !hasLensProduct || lensItemsWithoutPrescription.length === 0

  const [voucherCode, setVoucherCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cod'
  })

  const handleApplyVoucher = () => {
    const validVouchers = {
      'WELCOME10': 0.1,
      'CCLEARLY50': 50000,
      'FREESHIP': 'freeship'
    }

    const code = voucherCode.toUpperCase()
    if (validVouchers[code]) {
      if (code === 'FREESHIP') {
        setDiscount(shippingFee)
        toast.success('Đã áp dụng mã miễn phí vận chuyển')
      } else if (validVouchers[code] < 1) {
        setDiscount(Math.round(subtotal * validVouchers[code]))
        toast.success(`Đã áp dụng mã giảm giá ${validVouchers[code] * 100}%`)
      } else {
        setDiscount(validVouchers[code])
        toast.success(`Đã áp dụng mã giảm giá ${formatCurrency(validVouchers[code])}`)
      }
    } else {
      toast.error('Mã giảm giá không hợp lệ')
      setDiscount(0)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
  }

  const finalShippingFee = discount === shippingFee && voucherCode.toUpperCase() === 'FREESHIP' ? 0 : shippingFee
  const totalAmount = subtotal + finalShippingFee - (discount !== shippingFee ? discount : 0)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    if (!canCheckout) {
      toast.error('Vui lòng tải lên đơn thuốc cho các sản phẩm tròng kính')
      return
    }

    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        ...(item.type === 'lens' && prescriptions[item.id] && {
          prescriptionImage: prescriptions[item.id].name
        })
      }))

      await createOrder.mutateAsync({
        items: orderItems,
        totalAmount,
        discount: discount !== shippingFee ? discount : 0,
        shippingFee: finalShippingFee,
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        voucherCode: discount > 0 ? voucherCode : null
      })

      sessionStorage.removeItem('cartPrescriptions')
      await clearCart.mutateAsync()
      navigate('/orders')
    } catch (error) {
      // Error handled by hook
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#ececec] min-h-screen py-10">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 text-center py-20">
          <h2 className="text-3xl font-bold text-[#222] mb-4">Giỏ hàng trống</h2>
          <button onClick={() => navigate('/products')} className="text-[#0f5dd9] hover:underline font-medium">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ececec] min-h-screen py-10">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#222] tracking-[-0.02em]">Thanh toán</h1>
          <p className="text-[#4f5562] mt-2">Hoàn tất đơn hàng của bạn</p>
        </div>

        {hasLensProduct && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Đơn thuốc</span>
              {canCheckout ? (
                <span className="flex items-center gap-1 text-green-600 text-sm ml-auto">
                  <Check size={14} /> Đã tải đủ
                </span>
              ) : (
                <span className="text-orange-600 text-sm ml-auto">Chưa tải đủ</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {items.filter(item => item.type === 'lens').map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                    prescriptions[item.id] ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {prescriptions[item.id] ? <Check size={12} /> : <FileText size={12} />}
                  {item.name.substring(0, 20)}...
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="font-semibold text-[#222] mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#222] mb-2">Họ tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#222] mb-2">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
                      placeholder="0912 345 678"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#222] mb-4">Địa chỉ giao hàng</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#222] mb-2">Địa chỉ *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
                      placeholder="123 Đường Nguyễn Trãi, Quận 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#222] mb-2">Tỉnh/TP *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
                      placeholder="TP.HCM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#222] mb-2">Ghi chú</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-5 py-3 border border-[#e0e0e0] rounded-2xl focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
                      placeholder="Ghi chú thêm..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#222] mb-4">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-[#0f5dd9] bg-[#f0f7ff]' : 'border-[#e0e0e0] hover:border-[#bbb]'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-5 h-5 text-[#0f5dd9]" />
                    <div>
                      <span className="font-medium text-[#222]">Thanh toán khi nhận hàng (COD)</span>
                      <p className="text-sm text-[#4f5562]">Trả tiền mặt khi nhận được hàng</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'banking' ? 'border-[#0f5dd9] bg-[#f0f7ff]' : 'border-[#e0e0e0] hover:border-[#bbb]'}`}>
                    <input type="radio" name="paymentMethod" value="banking" checked={formData.paymentMethod === 'banking'} onChange={handleChange} className="w-5 h-5 text-[#0f5dd9]" />
                    <div>
                      <span className="font-medium text-[#222]">Chuyển khoản ngân hàng</span>
                      <p className="text-sm text-[#4f5562]">Chuyển khoản trước qua QR Code</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'momo' ? 'border-[#0f5dd9] bg-[#f0f7ff]' : 'border-[#e0e0e0] hover:border-[#bbb]'}`}>
                    <input type="radio" name="paymentMethod" value="momo" checked={formData.paymentMethod === 'momo'} onChange={handleChange} className="w-5 h-5 text-[#0f5dd9]" />
                    <div>
                      <span className="font-medium text-[#222]">Ví MoMo</span>
                      <p className="text-sm text-[#4f5562]">Thanh toán qua ví điện tử MoMo</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={createOrder.isPending || !canCheckout}
                className="w-full py-4 rounded-full font-medium transition disabled:bg-gray-300 disabled:text-gray-500 bg-[#141f36] text-white hover:bg-[#0d1322]"
              >
                {createOrder.isPending ? 'Đang xử lý...' : !canCheckout ? 'Cần tải lên đơn thuốc' : 'Đặt hàng'}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-6 sticky top-4">
              <h2 className="text-xl font-bold text-[#222] mb-6">Đơn hàng ({items.length} sản phẩm)</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#f3f3f3] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Glasses className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#222] text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-[#4f5562]">x{item.quantity}</p>
                      {item.type === 'lens' && prescriptions[item.id] && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <FileText size={10} /> Có đơn thuốc
                        </p>
                      )}
                    </div>
                    <p className="font-medium text-[#222] text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-b border-gray-100 py-4 my-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#222]" />
                  <p className="text-sm font-bold text-[#222]">Mã giảm giá</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã..."
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 bg-[#f9f9f9] border border-[#e0e0e0] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#0f5dd9]"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="bg-[#141f36] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#0d1322] transition"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-[#4f5562] text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4f5562] text-sm">
                  <span>Phí vận chuyển:</span>
                  <span className={finalShippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {finalShippingFee === 0 ? 'Miễn phí' : formatCurrency(finalShippingFee)}
                  </span>
                </div>
                {discount > 0 && voucherCode.toUpperCase() !== 'FREESHIP' && (
                  <div className="flex justify-between text-green-600 text-sm font-medium">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl pt-3 border-t">
                  <span className="text-[#222]">Tổng cộng:</span>
                  <span className="text-[#0f5dd9]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
