import { X, Package, User, Phone, MapPin, CreditCard, FileText, CheckCircle, XCircle, MessageSquare, Mail } from 'lucide-react'

const OrderDetailModal = ({ order, onClose, onConfirm, onCancel, onSendSMS, onSendEmail, getTypeBadge, getStatusBadge, formatCurrency }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-[#222]">Chi tiết đơn hàng</h2>
            <p className="text-sm text-[#4f5562]">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-[#0f5dd9] rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getTypeBadge(order.type).class}`}>
                  {getTypeBadge(order.type).label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(order.status).class}`}>
                  {getStatusBadge(order.status).label}
                </span>
              </div>
              <p className="text-sm text-[#4f5562] mt-1">
                Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#222] mb-3">
              <User className="w-4 h-4" /> Thông tin khách hàng
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-sm"><span className="font-medium">Tên:</span> {order.shippingAddress?.name}</p>
              <p className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {order.shippingAddress?.phone}
              </p>
              <p className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {order.shippingAddress?.address}, {order.shippingAddress?.district}, {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#222] mb-3">
              <Package className="w-4 h-4" /> Sản phẩm ({order.items?.length || 0})
            </h3>
            <div className="border rounded-xl overflow-hidden">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#222]">{item.name}</p>
                      <p className="text-xs text-[#4f5562]">SL: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[#222]">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#222] mb-3">
              <CreditCard className="w-4 h-4" /> Thanh toán
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#4f5562]">Tạm tính:</span>
                <span className="font-medium">{formatCurrency((order.totalAmount || 0) - (order.shippingFee || 30000) - (order.discount || 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4f5562]">Phí vận chuyển:</span>
                <span className="font-medium">{formatCurrency(order.shippingFee || 30000)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="text-[#0f5dd9]">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Prescription Info */}
          {order.prescription && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#222] mb-3">
                <FileText className="w-4 h-4" /> Thông tin đơn kính
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#4f5562]">Mắt phải (OD):</p>
                    <p className="font-medium">SPH: {order.prescription.rightEye?.sph} | CYL: {order.prescription.rightEye?.cyl} | AXIS: {order.prescription.rightEye?.axis}</p>
                  </div>
                  <div>
                    <p className="text-[#4f5562]">Mắt trái (OS):</p>
                    <p className="font-medium">SPH: {order.prescription.leftEye?.sph} | CYL: {order.prescription.leftEye?.cyl} | AXIS: {order.prescription.leftEye?.axis}</p>
                  </div>
                  <div>
                    <p className="text-[#4f5562]">PD:</p>
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
            </div>
          )}
        </div>
        <div className="p-6 border-t flex gap-3">
          {order.status === 'pending' && (
            <>
              <button onClick={() => onConfirm(order.id)} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Xác nhận đơn
              </button>
              <button onClick={() => onCancel(order.id)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" /> Hủy đơn
              </button>
            </>
          )}
          <button onClick={() => onSendSMS(order.id)} className="flex-1 border border-indigo-200 text-indigo-600 py-3 rounded-xl font-medium hover:bg-indigo-50 flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" /> SMS
          </button>
          <button onClick={() => onSendEmail(order.id)} className="flex-1 border border-blue-200 text-[#0f5dd9] py-3 rounded-xl font-medium hover:bg-blue-50 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" /> Email
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-[#222] py-3 rounded-xl font-medium hover:bg-gray-200">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;