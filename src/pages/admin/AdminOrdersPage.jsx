import {
  Search,
  Eye,
  Edit2,
  Package,
  CheckCircle,
  TrendingUp,
  Filter,
  Truck,
  XCircle,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmModal } from '@/components/ui';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/contexts/AuthContext';
import {
  useAdminOrders,
  useSavePrescription,
  useUpdateOrderStatus,
} from '@/hooks/useOrder';
import OrderDetailModal from '../../components/sale/OrderDetailModal';
import PrescriptionModal from '../../components/sale/PrescriptionModal';

const PAGE_SIZES = [5, 10, 15, 20, 30, 50];

const SHIPPING_CARRIERS = [
  { value: 'Giao hàng tiết kiệm', label: 'Giao hàng tiết kiệm' },
  { value: 'Giao hàng nhanh', label: 'Giao hàng nhanh' },
];

const AdminOrdersPage = () => {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: ordersData } = useAdminOrders({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: currentPage,
    size: pageSize,
  });
  const orders = ordersData?.items || ordersData || [];
  const totalItems = ordersData?.meta?.totalElements || orders.length;
  const totalPages =
    ordersData?.meta?.totalPages || Math.ceil(totalItems / pageSize);

  const savePrescriptionMutation = useSavePrescription();
  const updateStatusMutation = useUpdateOrderStatus();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const [prescriptionForm, setPrescriptionForm] = useState({
    rightEye: { sph: '', cyl: '', axis: '', add: '' },
    leftEye: { sph: '', cyl: '', axis: '', add: '' },
    pd: '',
    prescriptionImage: null,
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const [trackingModal, setTrackingModal] = useState({
    open: false,
    id: null,
    tracking: '',
    carrier: '',
  });

  const SPH_VALUES = Array.from({ length: 81 }, (_, i) =>
    (i * 0.25 - 10).toFixed(2)
  );
  const CYL_VALUES = Array.from({ length: 25 }, (_, i) =>
    (i * 0.25 - 3).toFixed(2)
  );
  const AXS_VALUES = Array.from({ length: 181 }, (_, i) => i.toString());

  /* ---------- Derived data ---------- */

  const filteredOrders = orders.filter((order) => {
    const orderId = order.code || order.orderId || order.id || '';
    const customerName =
      order.recipientName || order.shippingAddress?.name || '';
    const customerPhone =
      order.shippingPhone || order.shippingAddress?.phone || '';
    return (
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerPhone.includes(searchTerm)
    );
  });

  const paginatedOrders = filteredOrders;

  /* ---------- Helpers ---------- */

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);

  const STATUS_MAP = {
    PENDING: { label: 'Chờ xác nhận', css: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED: { label: 'Đã xác nhận', css: 'bg-blue-100 text-blue-700' },
    PROCESSING: { label: 'Đang xử lý', css: 'bg-purple-100 text-purple-700' },
    SHIPPED: { label: 'Đang giao hàng', css: 'bg-orange-100 text-orange-700' },
    DELIVERED: { label: 'Đã giao', css: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Đã hủy', css: 'bg-red-100 text-red-700' },
    RETURN_REQUESTED: {
      label: 'Yêu cầu trả hàng',
      css: 'bg-pink-100 text-pink-700',
    },
    RETURNED: { label: 'Đã trả hàng', css: 'bg-gray-100 text-gray-700' },
  };

  const TYPE_MAP = {
    standard: { label: 'Thường', css: 'bg-green-100 text-green-700' },
    prescription: { label: 'Có toa', css: 'bg-blue-100 text-blue-700' },
  };

  const getStatusBadge = (status) =>
    STATUS_MAP[status] || { label: status, css: 'bg-gray-100 text-gray-700' };
  const getTypeBadge = (type) =>
    TYPE_MAP[type] || {
      label: type || 'Thường',
      css: 'bg-gray-100 text-gray-700',
    };

  /* ---------- Actions ---------- */

  // Sales actions
  const handleConfirmOrder = (order) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận đơn hàng',
      message: `Xác nhận đơn hàng #${order.code || order.orderId}?`,
      onConfirm: () => {
        updateStatusMutation.mutate(
          { id: order.orderId, status: 'CONFIRMED' },
          {
            onSettled: () =>
              setConfirmModal((prev) => ({ ...prev, isOpen: false })),
          }
        );
      },
    });
  };

  const handleCancelOrder = (order) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hủy đơn hàng',
      message: `Bạn có chắc chắn muốn hủy đơn hàng #${order.code || order.orderId}?`,
      onConfirm: () => {
        updateStatusMutation.mutate(
          { id: order.orderId, status: 'CANCELLED' },
          {
            onSettled: () =>
              setConfirmModal((prev) => ({ ...prev, isOpen: false })),
          }
        );
      },
    });
  };

  const handleEditPrescription = (order) => {
    setOrderToEdit(order);
    if (order.prescription) {
      const rx = order.prescription;
      setPrescriptionForm({
        rightEye: {
          sph: rx.sphOd?.toString() || '',
          cyl: rx.cylOd?.toString() || '',
          axis: rx.axisOd?.toString() || '',
          add: rx.addOd?.toString() || '',
        },
        leftEye: {
          sph: rx.sphOs?.toString() || '',
          cyl: rx.cylOs?.toString() || '',
          axis: rx.axisOs?.toString() || '',
          add: rx.addOs?.toString() || '',
        },
        pd: rx.pd?.toString() || '',
        prescriptionImage: rx.imageUrl || null,
      });
    }
  };

  // Operations actions
  const handleProcess = (order) => {
    setConfirmModal({
      isOpen: true,
      title: 'Lấy hàng',
      message: `Xác nhận lấy hàng đơn #${order.code || order.orderId}?`,
      onConfirm: () => {
        updateStatusMutation.mutate(
          { id: order.orderId, status: 'PROCESSING' },
          {
            onSettled: () =>
              setConfirmModal((prev) => ({ ...prev, isOpen: false })),
          }
        );
      },
    });
  };

  const handleShip = (order) => {
    setTrackingModal({
      open: true,
      id: order.orderId,
      tracking: '',
      carrier: '',
    });
  };

  const handleDeliver = (order) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận giao hàng',
      message: `Xác nhận đã giao đơn #${order.code || order.orderId}?`,
      onConfirm: () => {
        updateStatusMutation.mutate(
          { id: order.orderId, status: 'DELIVERED' },
          {
            onSettled: () =>
              setConfirmModal((prev) => ({ ...prev, isOpen: false })),
          }
        );
      },
    });
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-500 text-sm">
          Xin chào, {user?.fullName || user?.name || 'Admin'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: 'Chờ xác nhận',
            val: orders.filter((o) => o.status === 'PENDING').length,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
          },
          {
            label: 'Đã xác nhận',
            val: orders.filter((o) => o.status === 'CONFIRMED').length,
            icon: CheckCircle,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Đang giao',
            val: orders.filter((o) => o.status === 'SHIPPED').length,
            icon: Truck,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
          {
            label: 'Đã giao',
            val: orders.filter((o) => o.status === 'DELIVERED').length,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Tổng đơn',
            val: totalItems,
            icon: Package,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800">{item.val}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm mã đơn, khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="outline-none bg-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đang giao hàng</option>
            <option value="DELIVERED">Đã giao</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="RETURN_REQUESTED">Yêu cầu trả hàng</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-3 text-left">Mã đơn</th>
              <th className="px-5 py-3 text-left">Khách hàng</th>
              <th className="px-5 py-3 text-left">Loại</th>
              <th className="px-5 py-3 text-center">Trạng thái</th>
              <th className="px-5 py-3 text-right">Tổng tiền</th>
              <th className="px-5 py-3 text-center">Ngày đặt</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  Không tìm thấy đơn hàng
                </td>
              </tr>
            )}
            {paginatedOrders.map((order) => {
              const s = (order.status || '').toUpperCase();
              return (
                <tr
                  key={order.orderId || order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-5 py-3 text-[#0f5dd9] font-medium">
                    #{order.code || order.orderId || order.id}
                  </td>

                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">
                      {order.recipientName || '—'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.shippingPhone || ''}
                    </p>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(order.type).css}`}
                    >
                      {getTypeBadge(order.type).label}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(s).css}`}
                    >
                      {getStatusBadge(s).label}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-right font-medium">
                    {formatCurrency(order.finalAmount)}
                  </td>

                  <td className="px-5 py-3 text-center text-xs text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>

                  <td className="px-5 py-3 text-right">
                    <div
                      className="flex justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* View detail */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Sales: Confirm + Cancel (PENDING) */}
                      {s === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleConfirmOrder(order)}
                            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Xác nhận"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Hủy đơn"
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}

                      {/* Operations: Lấy hàng (CONFIRMED) */}
                      {s === 'CONFIRMED' && (
                        <button
                          onClick={() => handleProcess(order)}
                          className="px-2 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium flex items-center gap-1"
                          title="Lấy hàng"
                        >
                          <Package size={13} /> Lấy hàng
                        </button>
                      )}

                      {/* Operations: Giao hàng / tracking (PROCESSING) */}
                      {s === 'PROCESSING' && (
                        <button
                          onClick={() => handleShip(order)}
                          className="px-2 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium flex items-center gap-1"
                          title="Giao hàng"
                        >
                          <Truck size={13} /> Giao hàng
                        </button>
                      )}

                      {/* Operations: Xác nhận giao (SHIPPED) */}
                      {s === 'SHIPPED' && (
                        <button
                          onClick={() => handleDeliver(order)}
                          className="px-2 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-medium flex items-center gap-1"
                          title="Xác nhận giao"
                        >
                          <Truck size={13} /> Đã giao
                        </button>
                      )}

                      {/* Prescription edit */}
                      {order.type === 'prescription' && (
                        <button
                          onClick={() => handleEditPrescription(order)}
                          className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                          title="Sửa toa kính"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          Hiển thị
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          / {totalItems} đơn
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Tracking Modal (from Operations) */}
      {trackingModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setTrackingModal({
                open: false,
                id: null,
                tracking: '',
                carrier: '',
              })
            }
          />
          <div className="relative bg-white p-6 rounded-xl w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-lg">Tạo vận đơn</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn vị giao hàng <span className="text-red-500">*</span>
              </label>
              <select
                value={trackingModal.carrier}
                onChange={(e) =>
                  setTrackingModal({
                    ...trackingModal,
                    carrier: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              >
                <option value="">-- Chọn đơn vị --</option>
                {SHIPPING_CARRIERS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã vận đơn <span className="text-red-500">*</span>
              </label>
              <input
                value={trackingModal.tracking}
                onChange={(e) =>
                  setTrackingModal({
                    ...trackingModal,
                    tracking: e.target.value,
                  })
                }
                placeholder="Nhập mã vận đơn"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setTrackingModal({
                    open: false,
                    id: null,
                    tracking: '',
                    carrier: '',
                  })
                }
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!trackingModal.carrier) {
                    toast.error('Vui lòng chọn đơn vị giao hàng');
                    return;
                  }
                  if (!trackingModal.tracking.trim()) {
                    toast.error('Vui lòng nhập mã vận đơn');
                    return;
                  }
                  updateStatusMutation.mutate({
                    id: trackingModal.id,
                    status: 'SHIPPED',
                    note: `[${trackingModal.carrier}] ${trackingModal.tracking.trim()}`,
                  });
                  setTrackingModal({
                    open: false,
                    id: null,
                    tracking: '',
                    carrier: '',
                  });
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onConfirm={(orderId) => {
          updateStatusMutation.mutate(
            { id: orderId, status: 'CONFIRMED' },
            { onSettled: () => setSelectedOrder(null) }
          );
        }}
        onCancel={(orderId) => {
          updateStatusMutation.mutate(
            { id: orderId, status: 'CANCELLED' },
            { onSettled: () => setSelectedOrder(null) }
          );
        }}
      />

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={!!orderToEdit}
        order={orderToEdit}
        onClose={() => setOrderToEdit(null)}
        onSave={() => {
          const orderId = orderToEdit?.orderId || orderToEdit?.id;
          const data = {
            sphOd: prescriptionForm.rightEye.sph || null,
            cylOd: prescriptionForm.rightEye.cyl || null,
            axisOd: prescriptionForm.rightEye.axis
              ? Number(prescriptionForm.rightEye.axis)
              : null,
            addOd: prescriptionForm.rightEye.add || null,
            sphOs: prescriptionForm.leftEye.sph || null,
            cylOs: prescriptionForm.leftEye.cyl || null,
            axisOs: prescriptionForm.leftEye.axis
              ? Number(prescriptionForm.leftEye.axis)
              : null,
            addOs: prescriptionForm.leftEye.add || null,
            pd: prescriptionForm.pd || null,
            imageUrl: prescriptionForm.prescriptionImage || null,
          };
          savePrescriptionMutation.mutate(
            { orderId, data },
            { onSuccess: () => setOrderToEdit(null) }
          );
        }}
        form={prescriptionForm}
        setForm={setPrescriptionForm}
        options={{ SPH: SPH_VALUES, CYL: CYL_VALUES, AXIS: AXS_VALUES }}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
};

export default AdminOrdersPage;
