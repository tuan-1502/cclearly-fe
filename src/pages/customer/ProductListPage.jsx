import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products as mockProducts, categories as mockCategories } from '@/mocks/data'
import Pagination from '@/components/ui/Pagination'
import { Glasses, Scan, Search, SlidersHorizontal } from 'lucide-react'

const pageSizeOptions = [4, 8, 12]
const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

const ProductListPage = ({ type }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    search: searchParams.get('search') || '',
    type: type || searchParams.get('type') || '',
    categoryId: searchParams.get('categoryId') || '',
  })

  // Update filters when type prop changes
  useEffect(() => {
    if (type) {
      setFilters(prev => ({ ...prev, type, page: 1 }))
    }
  }, [type])

  // Use mock data
  const allProducts = mockProducts
  const categories = mockCategories

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Filter by type
    if (filters.type) {
      result = result.filter(p => p.type === filters.type)
    }

    // Filter by category
    if (filters.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId)
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [allProducts, filters.type, filters.categoryId, filters.search])

  // Stats
  const summaryStats = useMemo(() => {
    return {
      total: filteredProducts.length,
      saleCount: filteredProducts.filter(p => p.isSale).length,
    }
  }, [filteredProducts])

  // Category options based on type
  const categoryOptions = useMemo(() => {
    const baseOptions = [{ value: '', label: 'Tất cả', count: summaryStats.total }]

    if (filters.type === 'frame') {
      const frameCategories = categories.filter(c => ['1', '2', '5'].includes(c.id))
      return baseOptions.concat(frameCategories.map(c => ({
        value: c.id,
        label: c.name,
        count: filteredProducts.filter(p => p.categoryId === c.id).length
      })))
    }

    if (filters.type === 'lens') {
      const lensCategories = categories.filter(c => ['3', '4'].includes(c.id))
      return baseOptions.concat(lensCategories.map(c => ({
        value: c.id,
        label: c.name,
        count: filteredProducts.filter(p => p.categoryId === c.id).length
      })))
    }

    return baseOptions.concat(categories.map(c => ({
      value: c.id,
      label: c.name,
      count: filteredProducts.filter(p => p.categoryId === c.id).length
    })))
  }, [categories, filters.type, filteredProducts, summaryStats.total])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / filters.limit))
  const normalizedCurrentPage = Math.min(filters.page, totalPages)

  const paginatedProducts = useMemo(() => {
    const start = (normalizedCurrentPage - 1) * filters.limit
    return filteredProducts.slice(start, start + filters.limit)
  }, [filteredProducts, normalizedCurrentPage, filters.limit])

  const shownFrom = filteredProducts.length === 0 ? 0 : (normalizedCurrentPage - 1) * filters.limit + 1
  const shownTo = Math.min(normalizedCurrentPage * filters.limit, filteredProducts.length)

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
    if (key === 'search') {
      setSearchParams(prev => {
        if (value) prev.set('search', value)
        else prev.delete('search')
        return prev
      })
    }
  }

  const handlePageSizeChange = (event) => {
    setFilters(prev => ({ ...prev, limit: Number(event.target.value), page: 1 }))
  }

  const handlePageChange = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    setFilters(prev => ({ ...prev, page: nextPage }))
  }

  const getTitle = () => {
    if (type === 'frame') return 'Gọng kính'
    if (type === 'lens') return 'Tròng kính'
    if (type === 'accessory') return 'Phụ kiện'
    return 'Tất cả sản phẩm'
  }

  const getTypeLabel = (productType) => {
    if (productType === 'frame') return 'Gọng kính'
    if (productType === 'lens') return 'Tròng kính'
    if (productType === 'accessory') return 'Phụ kiện'
    return productType
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <section className="border-b border-[#dbe4f4] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-[#606b7f]">
            <Link to="/" className="hover:text-[#0f5dd9]">Trang chủ</Link>
            <span>/</span>
            <span className="font-medium text-[#1d2433]">{getTitle()}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-tight text-[#1d2433]">{getTitle()}</h1>
          <p className="mt-2 text-[#606b7f]">
            Khám phá bộ sưu tập kính mắt chất lượng cao
          </p>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-[#dbe4f4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7b8494]" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-2xl border border-[#d8e2f2] bg-[#f8fbff] py-3 pl-12 pr-4 text-sm text-[#1f2937] outline-none transition focus:border-[#0f5dd9] focus:ring-2 focus:ring-[#0f5dd9]/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#d8e2f2] bg-white px-3 py-2 text-sm text-[#4f5562]">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Hiển thị</span>
                <select
                  value={filters.limit}
                  onChange={handlePageSizeChange}
                  className="bg-transparent font-semibold text-[#0f5dd9] outline-none"
                >
                  {pageSizeOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}/trang
                    </option>
                  ))}
                </select>
              </div>
              <p className="rounded-xl bg-[#eff4ff] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f5dd9]">
                {shownFrom}-{shownTo} / {filteredProducts.length} sản phẩm
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((option) => {
              const isActive = filters.categoryId === option.value
              return (
                <button
                  key={option.value || 'all'}
                  onClick={() => handleFilterChange('categoryId', option.value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-[#0f5dd9] bg-[#0f5dd9] text-white shadow-[0_8px_20px_rgba(15,93,217,0.3)]'
                      : 'border-[#d8e2f2] bg-white text-[#4f5562] hover:border-[#0f5dd9]/35 hover:text-[#0f5dd9]'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20' : 'bg-[#eff4ff] text-[#0f5dd9]'}`}>
                    {option.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1180px] px-4">
          {paginatedProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#cad7ed] bg-white px-6 py-20 text-center">
              <p className="text-lg font-semibold text-[#1d2433]">Không tìm thấy sản phẩm phù hợp</p>
              <p className="mt-2 text-sm text-[#606b7f]">Thử đổi từ khóa hoặc chọn lại danh mục để xem thêm gợi ý.</p>
              <button
                onClick={() => {
                  setFilters({ page: 1, limit: 8, search: '', type: type || '', categoryId: '' })
                }}
                className="mt-6 rounded-full bg-[#0f5dd9] px-6 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#0b4caf]"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => {
                  const hasDiscount = product.originalPrice && product.originalPrice > product.price
                  const discountPercent = hasDiscount
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0

                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group overflow-hidden rounded-3xl border border-[#e4eaf6] bg-white shadow-[0_12px_30px_rgba(15,35,95,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_35px_rgba(15,35,95,0.14)]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(145deg,#f7f9ff,#edf2ff)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,93,217,0.12),transparent_50%)]" />
                        <div className="relative flex h-full items-center justify-center">
                          {product.type === 'frame' ? (
                            <Glasses className="h-24 w-24 text-[#7b8494] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#0f5dd9]" />
                          ) : (
                            <Scan className="h-24 w-24 text-[#7b8494] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#0f5dd9]" />
                          )}
                        </div>

                        <div className="absolute left-3 top-3 flex flex-col gap-2">
                          {product.isSale && (
                            <span className="rounded-full bg-[#f7c948] px-3 py-1 text-xs font-bold text-[#222]">
                              Sale
                            </span>
                          )}
                          {product.isPreorder && (
                            <span className="rounded-full bg-[#0f5dd9] px-3 py-1 text-xs font-bold text-white">
                              Pre-order
                            </span>
                          )}
                        </div>

                        {hasDiscount && (
                          <div className="absolute right-3 top-3 rounded-full bg-[#ef4444] px-3 py-1 text-xs font-bold text-white">
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <span className="mb-3 inline-flex rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-semibold text-[#0f5dd9]">
                          {getTypeLabel(product.type)}
                        </span>
                        <h3 className="line-clamp-1 text-lg font-semibold text-[#1d2433]">{product.name}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[#606b7f]">{product.description}</p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[#f7b500]">
                            {[...Array(5)].map((_, index) => (
                              <svg
                                key={index}
                                className={`h-4 w-4 ${index < Math.round(product.rating || 0) ? 'fill-current' : 'text-[#d3d9e6]'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 2.2l2.3 4.66 5.15.75-3.72 3.63.88 5.13L10 13.96 5.4 16.37l.88-5.13-3.72-3.63 5.15-.75L10 2.2z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-[#606b7f]">({product.reviewCount || 0} đánh giá)</span>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-xl font-bold text-[#1d2433]">
                            {currencyFormatter.format(product.price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-[#7b8494] line-through">
                              {currencyFormatter.format(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 space-y-3">
                  <p className="text-center text-sm text-[#606b7f]">
                    Trang {normalizedCurrentPage} / {totalPages}
                  </p>
                  <Pagination
                    currentPage={normalizedCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="justify-center"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductListPage
