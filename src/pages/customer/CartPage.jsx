import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/useCart'
import { ShoppingCart, Glasses, Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

const CartPage = () => {
  const navigate = useNavigate()
  const { data: cartData, isLoading } = useCart()
  const updateCartItem = useUpdateCartItem()
  const removeCartItem = useRemoveCartItem()
  const clearCart = useClearCart()

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    await updateCartItem.mutateAsync({ itemId, quantity: newQuantity })
  }

  const handleRemove = async (itemId) => {
    await removeCartItem.mutateAsync(itemId)
  }

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm?')) {
      await clearCart.mutateAsync()
    }
  }

  const cart = cartData?.data || cartData
  const items = cart?.items || []
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 500000 ? 0 : 30000
  const [voucherCode, setVoucherCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const handleApplyVoucher = () => {
    // Mock voucher logic
    const validVouchers = {
      'WELCOME10': 0.1, // 10%
      'CCLEARLY50': 50000, // 50k
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

  if (isLoading) {
    return (
      <div className="bg-[#ececec] min-h-screen py-10">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#4f5562]">Đang tải giỏ hàng...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#ececec] min-h-screen py-10">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 text-center py-20">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-[#222] mb-4">Giỏ hàng trống</h2>
          <p className="text-[#4f5562] mb-8">Hãy thêm sản phẩm vào giỏ hàng</p>
          <Link to="/products" className="inline-block bg-[#141f36] text-white px-10 py-4 rounded-full font-medium hover:bg-[#0d1322] transition">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ececec] min-h-screen py-10">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#222] tracking-[-0.02em]">Giỏ hàng</h1>
          <p className="text-[#4f5562] mt-2">{items.length} sản phẩm</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-5 flex gap-5">
                {/* Image */}
                <div className="w-28 h-28 bg-[#f3f3f3] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Glasses className="w-10 h-10 text-gray-400" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#222]">{item.name}</h3>
                  <p className="text-[#0f5dd9] font-bold mt-1">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border-2 border-[#e0e0e0] rounded-full">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-4 py-2 hover:bg-[#f3f3f3] rounded-l-full transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-medium text-[#222]">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-4 py-2 hover:bg-[#f3f3f3] rounded-r-full transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#222] text-lg">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-6 sticky top-4">
              <h2 className="text-xl font-bold text-[#222] mb-6">Tổng quan đơn hàng</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#4f5562]">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4f5562]">
                  <span>Phí vận chuyển:</span>
                  <span className={finalShippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {finalShippingFee === 0 ? 'Miễn phí' : formatCurrency(finalShippingFee)}
                  </span>
                </div>

                {/* Voucher Section */}
                <div className="border-t border-b border-gray-100 py-4 my-2">
                  <p className="text-sm font-bold text-[#222] mb-3">Mã giảm giá / Voucher</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã (WELCOME10, FREESHIP)..."
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
                  {discount > 0 && voucherCode.toUpperCase() !== 'FREESHIP' && (
                    <div className="flex justify-between mt-3 text-sm text-green-600 font-medium">
                      <span>Đã giảm:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                </div>

                {subtotal < 500000 && (
                  <p className="text-xs text-[#4f5562] bg-[#f3f3f3] p-3 rounded-xl">
                    Mua thêm {formatCurrency(500000 - subtotal)} để được miễn phí vận chuyển
                  </p>
                )}
                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                  <span className="text-[#222]">Tổng cộng:</span>
                  <span className="text-[#0f5dd9]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#141f36] text-white py-4 rounded-full font-medium hover:bg-[#0d1322] transition"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
