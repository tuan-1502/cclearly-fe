import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Ticket,
  CheckCircle,
  XCircle,
  Filter,
  Package,
  X,
} from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
  useTogglePromotion,
} from '@/hooks/useAdmin';

const PromotionPage = () => {
  const { data: coupons = [], isLoading } = usePromotions();
  const createPromotionMutation = useCreatePromotion();
  const updatePromotionMutation = useUpdatePromotion();
  const deletePromotionMutation = useDeletePromotion();
  const togglePromotionMutation = useTogglePromotion();

  const [couponSearch, setCouponSearch] = useState('');
  const [couponFilter, setCouponFilter] = useState('all');

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discountType: 'PERCENT',
    value: 0,
    minOrder: 0,
    maxDiscount: 0,
    usageLimit: null,
    description: '',
    isActive: true,
  });

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
  });

  // ─── Handlers ────────────────────────────────────────────

  const handleCouponSubmit = (e) => {
    e.preventDefault();

    const payload = {
      code: couponFormData.code,
      discountType: couponFormData.discountType,
      value: Number(couponFormData.value),
      minOrder: Number(couponFormData.minOrder) || 0,
      maxDiscount: Number(couponFormData.maxDiscount) || 0,
      usageLimit: couponFormData.usageLimit
        ? Number(couponFormData.usageLimit)
        : null,
      description: couponFormData.description,
      isActive: couponFormData.isActive,
    };

    if (editingCoupon) {
      updatePromotionMutation.mutate(
        { id: editingCoupon.promotionId, data: payload },
        {
          onSuccess: () => {
            setShowCouponModal(false);
            setEditingCoupon(null);
          },
        }
      );
    } else {
      createPromotionMutation.mutate(payload, {
        onSuccess: () => {
          setShowCouponModal(false);
          setEditingCoupon(null);
        },
      });
    }
  };

  const toggleCouponStatus = (coupon) => {
    togglePromotionMutation.mutate(coupon.promotionId);
  };

  const openEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minOrder: coupon.minOrder || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit,
      description: coupon.description || '',
      isActive: coupon.isActive,
    });
    setShowCouponModal(true);
  };

  const openAddCoupon = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: '',
      discountType: 'PERCENT',
      value: 0,
      minOrder: 0,
      maxDiscount: 0,
      usageLimit: null,
      description: '',
      isActive: true,
    });
    setShowCouponModal(true);
  };

  const handleDeleteRequest = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const onConfirmDelete = () => {
    deletePromotionMutation.mutate(confirmDelete.id);
    setConfirmDelete({ isOpen: false, id: null });
  };

  // ─── Derived data ────────────────────────────────────────

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code
      .toLowerCase()
      .includes(couponSearch.toLowerCase());

    if (couponFilter === 'active') return matchesSearch && c.isActive;
    if (couponFilter === 'disabled') return matchesSearch && !c.isActive;
    return matchesSearch;
  });

  const isPercent = (type) => type === 'PERCENT' || type === 'PERCENTAGE';

  const formatDiscount = (coupon) => {
    if (isPercent(coupon.discountType)) return `${coupon.value}%`;
    return Number(coupon.value).toLocaleString() + '₫';
  };

  const formatCurrency = (val) => {
    if (!val || Number(val) === 0) return '—';
    return Number(val).toLocaleString() + '₫';
  };

  // ─── Stats ───────────────────────────────────────────────

  const totalVouchers = coupons.length;
  const activeVouchers = coupons.filter((c) => c.isActive).length;
  const disabledVouchers = totalVouchers - activeVouchers;
  const totalUsage = coupons.reduce((s, c) => s + (c.usageCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản lý Voucher
          </h1>
          <p className="text-gray-500 text-sm">Tạo và quản lý mã giảm giá</p>
        </div>

        <button
          onClick={openAddCoupon}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Tạo Voucher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Tổng voucher',
            val: totalVouchers,
            icon: Ticket,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
          },
          {
            label: 'Đang hoạt động',
            val: activeVouchers,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Đã tắt',
            val: disabledVouchers,
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
          },
          {
            label: 'Lượt sử dụng',
            val: totalUsage,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
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
            placeholder="Tìm theo mã voucher..."
            value={couponSearch}
            onChange={(e) => setCouponSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
          <Filter size={16} />
          <select
            value={couponFilter}
            onChange={(e) => setCouponFilter(e.target.value)}
            className="outline-none bg-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="disabled">Đã tắt</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Đang tải...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Ticket className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            {couponSearch || couponFilter !== 'all'
              ? 'Không tìm thấy voucher nào'
              : 'Chưa có voucher nào. Nhấn "Tạo Voucher" để bắt đầu.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 text-left">Mã</th>
                <th className="px-5 py-3 text-left">Loại</th>
                <th className="px-5 py-3 text-left">Giảm giá</th>
                <th className="px-5 py-3 text-left">Đơn tối thiểu</th>
                <th className="px-5 py-3 text-left">Giảm tối đa</th>
                <th className="px-5 py-3 text-left">Sử dụng</th>
                <th className="px-5 py-3 text-left">Mô tả</th>
                <th className="px-5 py-3 text-center">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon.promotionId || coupon.code}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-3">
                    <span className="font-mono font-semibold bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {coupon.code}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isPercent(coupon.discountType)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isPercent(coupon.discountType) ? 'Phần trăm' : 'Cố định'}
                    </span>
                  </td>

                  <td className="px-5 py-3 font-medium text-[#0f5dd9]">
                    {formatDiscount(coupon)}
                  </td>

                  <td className="px-5 py-3 text-gray-600">
                    {formatCurrency(coupon.minOrder)}
                  </td>

                  <td className="px-5 py-3 text-gray-600">
                    {formatCurrency(coupon.maxDiscount)}
                  </td>

                  <td className="px-5 py-3">
                    <span className="text-gray-700 font-medium">
                      {coupon.usageCount || 0}
                    </span>
                    <span className="text-gray-400">
                      /{coupon.usageLimit || '∞'}
                    </span>
                  </td>

                  <td
                    className="px-5 py-3 text-gray-500 max-w-[200px] truncate"
                    title={coupon.description}
                  >
                    {coupon.description || '—'}
                  </td>

                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggleCouponStatus(coupon)}
                      disabled={togglePromotionMutation.isPending}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors
                      ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditCoupon(coupon)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Sửa"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => handleDeleteRequest(coupon.promotionId)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* VOUCHER MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white rounded-t-xl">
              <h3 className="font-semibold text-lg">
                {editingCoupon ? 'Sửa Voucher' : 'Tạo Voucher mới'}
              </h3>
              <button
                onClick={() => {
                  setShowCouponModal(false);
                  setEditingCoupon(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCouponSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã voucher
                </label>
                <input
                  type="text"
                  value={couponFormData.code}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VD: SUMMER20"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                  disabled={!!editingCoupon}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    value={couponFormData.discountType}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        discountType: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (₫)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá trị{' '}
                    {isPercent(couponFormData.discountType) ? '(%)' : '(₫)'}
                  </label>
                  <input
                    type="number"
                    value={couponFormData.value}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        value: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn tối thiểu (₫)
                  </label>
                  <input
                    type="number"
                    value={couponFormData.minOrder}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        minOrder: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảm tối đa (₫)
                  </label>
                  <input
                    type="number"
                    value={couponFormData.maxDiscount}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        maxDiscount: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn sử dụng
                </label>
                <input
                  type="number"
                  value={couponFormData.usageLimit || ''}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      usageLimit: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  placeholder="Để trống = không giới hạn"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={couponFormData.description}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Mô tả khuyến mãi..."
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={couponFormData.isActive}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      isActive: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="couponActive" className="text-sm text-gray-700">
                  Kích hoạt ngay
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCouponModal(false);
                    setEditingCoupon(null);
                  }}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={
                    createPromotionMutation.isPending ||
                    updatePromotionMutation.isPending
                  }
                  className="px-5 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {createPromotionMutation.isPending ||
                  updatePromotionMutation.isPending
                    ? 'Đang lưu...'
                    : editingCoupon
                      ? 'Cập nhật'
                      : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn chắc chắn muốn xóa voucher này?"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
        type="danger"
      />
    </div>
  );
};

export default PromotionPage;
