// Manager Products Page - Quản lý sản phẩm
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PAGE_SIZES } from '@/mocks/data'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProduct'
import { Search, Plus, Edit2, Trash2, Glasses, Scan } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import ProductModal from '@/components/admin/product/ProductModal'
import Pagination from '@/components/ui/Pagination'

const ManagerProductsPage = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    type: '',
    search: '',
  })

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    productId: null
  })

  const { data, isLoading } = useProducts(filters)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [formData, setFormData] = useState({
    name: '',
    type: 'frame',
    price: '',
    description: '',
    material: '',
    shape: '',
    color: '',
    bridgeWidth: '',
    templeLength: '',
    lensWidth: '',
    frameWidth: '',
    origin: '',
    warranty: '',
    index: '',
    lensMaterial: '',
    technology: '',
    coating: '',
    diameter: '',
    lensType: '',
    brand: '',
  })

  const [variants, setVariants] = useState([])

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        type: product.type,
        price: product.price,
        description: product.description,
        material: product.attributes?.material || '',
        shape: product.attributes?.shape || '',
        color: product.attributes?.color || '',
        bridgeWidth: product.attributes?.bridgeWidth || '',
        templeLength: product.attributes?.templeLength || '',
        lensWidth: product.attributes?.lensWidth || '',
        frameWidth: product.attributes?.frameWidth || '',
        origin: product.attributes?.origin || '',
        warranty: product.attributes?.warranty || '',
        index: product.attributes?.index || '',
        lensMaterial: product.attributes?.material || '',
        technology: product.attributes?.technology || '',
        coating: product.attributes?.coating || '',
        diameter: product.attributes?.diameter || '',
        lensType: product.attributes?.type || '',
        brand: product.attributes?.brand || '',
      })
      setVariants(product.variants || [])
    } else {
      setEditingProduct(null)
      setFormData({
        name: '', type: 'frame', price: '', description: '',
        material: '', shape: '', color: '', bridgeWidth: '', templeLength: '',
        lensWidth: '', frameWidth: '', origin: '', warranty: '',
        index: '', lensMaterial: '', technology: '', coating: '',
        diameter: '', lensType: '', brand: '',
      })
      setVariants([])
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const attributes = formData.type === 'frame' ? {
        material: formData.material,
        shape: formData.shape,
        color: formData.color,
        bridgeWidth: formData.bridgeWidth,
        templeLength: formData.templeLength,
        lensWidth: formData.lensWidth,
        frameWidth: formData.frameWidth,
        origin: formData.origin,
        warranty: formData.warranty,
      } : {
        index: formData.index,
        material: formData.lensMaterial,
        technology: formData.technology,
        coating: formData.coating,
        diameter: formData.diameter,
        type: formData.lensType,
        brand: formData.brand,
      }

      const productData = {
        ...formData,
        attributes,
        variants: variants.length > 0 ? variants : undefined,
      }

      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, data: productData })
      } else {
        await createProduct.mutateAsync(productData)
      }
      handleCloseModal()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddVariant = () => {
    const newVariant = formData.type === 'frame'
      ? { id: 'v' + Date.now(), color: '', colorCode: '#000000', sku: '', price: formData.price }
      : { id: 'lv' + Date.now(), technology: '', sku: '', price: formData.price }
    setVariants([...variants, newVariant])
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const handleDeleteVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const products = data?.items || []
  const totalPages = data?.meta?.totalPages || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222]">Quản lý sản phẩm</h1>
        <p className="text-[#4f5562]">Xin chào, {user?.name || 'Manager'}!</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
          />
        </div>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9] bg-white"
        >
          <option value="">Tất cả loại</option>
          <option value="frame">Gọng kính</option>
          <option value="lens">Tròng kính</option>
        </select>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0f5dd9] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#0b4fc0] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Thêm sản phẩm
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#4f5562]">Đang tải...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-[#4f5562]">Không có sản phẩm nào</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f3f3f3]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loại</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Giá</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tồn</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececec]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                            {product.type === 'frame' ? <Glasses className="w-5 h-5 text-gray-400" /> : <Scan className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#222] truncate group-hover:text-[#0f5dd9] transition-colors">{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{product.sku}</p>
                            {product.variants?.length > 0 && <p className="text-[10px] text-blue-500">{product.variants.length} biến thể</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md uppercase">
                          {product.type === 'frame' ? 'Gọng' : 'Tròng'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm font-bold text-[#222]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-center font-medium text-gray-600">{product.stock}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${product.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {product.isActive ? 'BẬT' : 'TẮT'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-[#0f5dd9] hover:bg-blue-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setConfirmModal({ isOpen: true, productId: product.id })} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-[#ececec] flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#4f5562]">Hiển thị:</span>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
                  className="px-3 py-1.5 border border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#0f5dd9] bg-white cursor-pointer"
                >
                  {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <span className="text-sm text-[#4f5562]">sản phẩm</span>
              </div>
              <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(page) => setFilters({ ...filters, page })} />
            </div>
          </>
        )}
      </div>

      {/* Product Modal - Sử dụng chung component với Admin */}
      <ProductModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        variants={variants}
        handleAddVariant={handleAddVariant}
        handleVariantChange={handleVariantChange}
        handleDeleteVariant={handleDeleteVariant}
        isPending={createProduct.isPending || updateProduct.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={async () => { await deleteProduct.mutateAsync(confirmModal.productId); setConfirmModal({ ...confirmModal, isOpen: false }); }}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa sản phẩm"
        type="danger"
      />
    </div>
  )
}

export default ManagerProductsPage
