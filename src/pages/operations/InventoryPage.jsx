// Operations Inventory Page - Quản lý kho
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { products, stores } from '@/mocks/data'
import { Search, Plus, Package, Warehouse, AlertTriangle, X, Upload, Filter } from 'lucide-react'
import { toast } from 'react-toastify'
import Pagination from '@/components/ui/Pagination'

const PAGE_SIZES = [10, 20, 50, 100]

const InventoryPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [storeFilter, setStoreFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Modal states
  const [showImportModal, setShowImportModal] = useState(false)
  const [importForm, setImportForm] = useState({
    productId: '',
    variantId: '',
    quantity: '',
    note: '',
    storeId: 'store1'
  })

  // Stats
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockProducts = products.filter(p => p.stock < 10).length
  const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0)

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || product.type === typeFilter
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && product.stock < 10) ||
      (stockFilter === 'out' && product.stock === 0) ||
      (stockFilter === 'available' && product.stock > 0)
    return matchesSearch && matchesType && matchesStock
  })

  // Pagination
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  const handleImport = () => {
    if (!importForm.productId || !importForm.quantity) {
      toast.error('Vui lòng chọn sản phẩm và nhập số lượng')
      return
    }

    // Mock import
    toast.success(`Đã nhập kho ${importForm.quantity} sản phẩm!`)
    setShowImportModal(false)
    setImportForm({
      productId: '',
      variantId: '',
      quantity: '',
      note: '',
      storeId: 'store1'
    })
  }

  const selectedProduct = products.find(p => p.id === importForm.productId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Quản lý kho</h1>
          <p className="text-[#4f5562]">Xin chào, {user?.name || 'Operations'}!</p>
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5dd9] text-white rounded-xl font-medium hover:bg-[#0b4fc0]"
        >
          <Upload size={18} />
          Nhập kho
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-[#0f5dd9]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#222]">{products.length}</p>
              <p className="text-sm text-[#4f5562]">Tổng sản phẩm</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Warehouse className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#222]">{totalStock}</p>
              <p className="text-sm text-[#4f5562]">Tổng tồn kho</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#222]">{totalVariants}</p>
              <p className="text-sm text-[#4f5562]">Tổng biến thể</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#222]">{lowStockProducts}</p>
              <p className="text-sm text-[#4f5562]">Sắp hết hàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
            />
          </div>
          <select
            value={storeFilter}
            onChange={(e) => { setStoreFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
          >
            <option value="all">Tất cả cửa hàng</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
          >
            <option value="all">Tất cả loại</option>
            <option value="frame">Gọng kính</option>
            <option value="lens">Tròng kính</option>
            <option value="accessory">Phụ kiện</option>
          </select>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
          >
            <option value="all">Tất cả tồn kho</option>
            <option value="available">Còn hàng</option>
            <option value="low">Sắp hết (&lt;10)</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#222]">{product.name}</p>
                        {product.variants && product.variants.length > 0 && (
                          <p className="text-xs text-gray-400">{product.variants.length} biến thể</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#4f5562]">{product.sku}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {product.type === 'frame' ? 'Gọng' : product.type === 'lens' ? 'Tròng' : 'Phụ kiện'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock < 10 ? 'text-orange-600' : 'text-[#222]'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#222]">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    {product.stock === 0 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">Hết hàng</span>
                    ) : product.stock < 10 ? (
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">Sắp hết</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Còn hàng</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setImportForm({ ...importForm, productId: product.id })
                        setShowImportModal(true)
                      }}
                      className="text-[#0f5dd9] hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      Nhập kho
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginatedProducts.length === 0 && (
          <div className="text-center py-12 text-[#4f5562]">
            Không tìm thấy sản phẩm nào
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#4f5562]">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
            >
              {PAGE_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-[#4f5562]">/ {totalItems} sản phẩm</span>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-[#222]">Nhập kho</h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#222] mb-1">Sản phẩm</label>
                <select
                  value={importForm.productId}
                  onChange={(e) => setImportForm({ ...importForm, productId: e.target.value, variantId: '' })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.sku}</option>
                  ))}
                </select>
              </div>

              {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[#222] mb-1">Biến thể (tuỳ chọn)</label>
                  <select
                    value={importForm.variantId}
                    onChange={(e) => setImportForm({ ...importForm, variantId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
                  >
                    <option value="">Không chọn biến thể</option>
                    {selectedProduct.variants.map(v => (
                      <option key={v.id} value={v.id}>{v.color || v.technology} - SKU: {v.sku}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#222] mb-1">Số lượng</label>
                <input
                  type="number"
                  min="1"
                  value={importForm.quantity}
                  onChange={(e) => setImportForm({ ...importForm, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
                  placeholder="Nhập số lượng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222] mb-1">Cửa hàng</label>
                <select
                  value={importForm.storeId}
                  onChange={(e) => setImportForm({ ...importForm, storeId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
                >
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222] mb-1">Ghi chú</label>
                <textarea
                  value={importForm.note}
                  onChange={(e) => setImportForm({ ...importForm, note: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]"
                  placeholder="Nhập ghi chú..."
                />
              </div>
            </div>
            <div className="p-5 border-t flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleImport}
                className="flex-1 px-5 py-2.5 bg-[#0f5dd9] text-white rounded-xl hover:bg-[#0b4fc0] font-medium"
              >
                Nhập kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPage
