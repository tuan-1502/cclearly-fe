import { Glasses, Scan, Minus, Plus, Truck, ShieldCheck, Package } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAddToCart } from '@/hooks/useCart';
import { useProductDetail } from '@/hooks/useProduct';

// Vietnamese labels for frame specs
const FRAME_SPEC_LABELS = {
  material: 'Chất liệu',
  shape: 'Dáng kính',
  lensWidthMm: 'Chiều rộng mắt kính (mm)',
  bridgeWidthMm: 'Chiều rộng cầu kính (mm)',
  templeLengthMm: 'Chiều dài càng kính (mm)',
};

// Vietnamese labels for lens specs
const LENS_SPEC_LABELS = {
  lensType: 'Loại tròng',
  material: 'Chất liệu',
  technologies: 'Công nghệ',
};

const TYPE_LABELS = {
  frame: 'Gọng kính',
  lens: 'Tròng kính',
  accessory: 'Phụ kiện',
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: product, isLoading, error } = useProductDetail(id);
  const addToCart = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('regular');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Determine the selected variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    if (selectedVariantId) {
      return product.variants.find((v) => v.variantId === selectedVariantId) || product.variants[0];
    }
    return product.variants[0];
  }, [product, selectedVariantId]);

  // Get display price based on selected variant
  const displayPrice = useMemo(() => {
    if (selectedVariant?.salePrice) return selectedVariant.salePrice;
    return product?.basePrice;
  }, [selectedVariant, product]);

  // Get images to display
  const displayImages = useMemo(() => {
    if (selectedVariant?.images?.length) return selectedVariant.images;
    if (product?.images?.length) return product.images;
    return [];
  }, [selectedVariant, product]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      await addToCart.mutateAsync({
        variantId: selectedVariant.variantId,
        quantity,
      });
    } catch (err) {}
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    try {
      await addToCart.mutateAsync({
        variantId: selectedVariant.variantId,
        quantity,
      });
      navigate('/checkout');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="bg-[#ececec] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-6 animate-pulse">
          <div className="h-[500px] bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#ececec] min-h-screen py-10 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          Sản phẩm không tồn tại
        </h2>
      </div>
    );
  }

  // Build specs data for display
  const specsData = [];
  if (product.type === 'frame' && product.frame) {
    Object.entries(product.frame).forEach(([key, value]) => {
      if (value != null) {
        specsData.push({
          label: FRAME_SPEC_LABELS[key] || key,
          value: String(value),
        });
      }
    });
  } else if (product.type === 'lens' && product.lens) {
    Object.entries(product.lens).forEach(([key, value]) => {
      if (value != null) {
        const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
        specsData.push({
          label: LENS_SPEC_LABELS[key] || key,
          value: displayValue,
        });
      }
    });
  }

  const hasSpecs = specsData.length > 0;

  return (
    <div className="bg-[#ececec] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-[#4f5562]">
          <Link to="/">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to="/products">Sản phẩm</Link>
          <span className="mx-2">/</span>
          <span className="text-[#222]">{product.name}</span>
        </div>

        {/* PRODUCT HERO */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* IMAGE */}
          <div className="bg-white rounded-3xl shadow p-10 flex items-center justify-center">
            {product.type === 'frame' ? (
              <Glasses className="w-40 h-40 text-gray-300" />
            ) : (
              <Scan className="w-40 h-40 text-gray-300" />
            )}
          </div>

          {/* PRODUCT INFO */}
          <div>
            {/* BADGES */}
            <div className="flex gap-2 mb-4">
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                {product.type === 'frame' ? 'Gọng kính' : 'Tròng kính'}
              </span>

              {product.isSale && (
                <span className="bg-yellow-400 text-xs px-3 py-1 rounded-full">
                  Sale
                </span>
              )}

              {product.isPreorder && (
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Pre-order
                </span>
              )}
            </div>

            {/* NAME */}
            <h1 className="text-3xl font-bold text-[#222] mb-4">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-[#0f5dd9]">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(product.basePrice)}
              </span>

              {product.originalPrice &&
                product.originalPrice > product.basePrice && (
                  <span className="text-lg line-through text-gray-400">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.originalPrice)}
                  </span>
                )}
            </div>

            {/* SHORT DESCRIPTION */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* ORDER TYPE */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setOrderType('regular')}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${
                  orderType === 'regular'
                    ? 'bg-black text-white'
                    : 'bg-gray-100'
                }`}
              >
                Mua ngay
              </button>

              <button
                onClick={() => setOrderType('preorder')}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${
                  orderType === 'preorder'
                    ? 'bg-black text-white'
                    : 'bg-gray-100'
                }`}
              >
                Pre-order
              </button>

              <button
                onClick={() => setOrderType('prescription')}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${
                  orderType === 'prescription'
                    ? 'bg-black text-white'
                    : 'bg-gray-100'
                }`}
              >
                Theo đơn kính
              </button>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>

                <div className="px-6 flex items-center font-semibold">
                  {quantity}
                </div>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ACTION BUTTON */}
            {orderType === 'prescription' ? (
              <button
                onClick={() =>
                  navigate(
                    `/prescription-form?productId=${product.id}&quantity=${quantity}`
                  )
                }
                className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold hover:bg-blue-700"
              >
                Nhập đơn kính
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-black text-black py-4 rounded-full font-semibold hover:bg-gray-50 transition"
                >
                  {orderType === 'preorder' ? 'Đặt trước' : 'Thêm vào giỏ'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-900 transition"
                >
                  Mua ngay
                </button>
              </div>
            )}

            {/* BENEFITS */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <Truck size={18} />
                <span className="text-sm">Free ship toàn quốc</span>
              </div>

              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <ShieldCheck size={18} />
                <span className="text-sm">Bảo hành 12 tháng</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXTRA INFO TABS */}
        <div className="bg-white rounded-3xl shadow p-10">
          {/* TAB HEADER */}
          <div className="flex gap-8 border-b mb-8 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 ${
                activeTab === 'description'
                  ? 'border-b-2 border-black'
                  : 'text-gray-400'
              }`}
            >
              Mô tả chi tiết
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 ${
                activeTab === 'specs'
                  ? 'border-b-2 border-black'
                  : 'text-gray-400'
              }`}
            >
              Thông số kỹ thuật
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`pb-3 ${
                activeTab === 'warranty'
                  ? 'border-b-2 border-black'
                  : 'text-gray-400'
              }`}
            >
              Bảo hành
            </button>
          </div>

          {/* TAB CONTENT */}

          {activeTab === 'description' && (
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>{product.description}</p>

              <p>
                Gọng kính được thiết kế với chất liệu cao cấp, mang lại cảm giác
                thoải mái khi đeo trong thời gian dài.
              </p>

              <p>Phù hợp cho cả nam và nữ với phong cách hiện đại.</p>
            </div>
          )}

          {activeTab === 'specs' && (product.frame || product.lens) && (
            <div className="border rounded-xl overflow-hidden">
              {Object.entries(product.frame || product.lens || {}).map(([key, value], index) => (
                <div
                  key={key}
                  className={`grid grid-cols-2 px-6 py-3 text-sm ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <span className="text-gray-500 capitalize">{key}</span>

                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="text-gray-600 space-y-3">
              <p>✔ Bảo hành gọng kính 12 tháng.</p>

              <p>✔ Hỗ trợ chỉnh gọng miễn phí tại cửa hàng.</p>

              <p>✔ Đổi mới trong 7 ngày nếu lỗi sản xuất.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
