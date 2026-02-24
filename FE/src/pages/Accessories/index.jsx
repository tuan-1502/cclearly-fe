import { useEffect, useCallback } from 'react';
import ProductCard from '@components/ProductCard';
import { useAccessoriesStore } from '@stores';

/**
 * Accessories page component
 * Uses Zustand store for state management with simulated API calls
 */
const AccessoriesPage = () => {
  // Get state and actions from Zustand store
  const {
    accessories,
    accessoryTypes,
    isLoading,
    error,
    pagination,
    filters,
    fetchAccessories,
    toggleAccessoryType,
    setPriceRange,
    clearFilters,
    setCurrentPage,
  } = useAccessoriesStore();

  // Fetch accessories on mount and when filters/pagination changes
  useEffect(() => {
    fetchAccessories();
  }, [
    fetchAccessories,
    filters.accessoryTypes,
    filters.priceRange,
    filters.searchQuery,
    pagination.currentPage,
    pagination.pageSize,
  ]);

  const handleAccessoryTypeChange = useCallback(
    (accessoryType) => {
      toggleAccessoryType(accessoryType);
    },
    [toggleAccessoryType]
  );

  const handlePriceRangeChange = useCallback(
    (e) => {
      setPriceRange({ min: 0, max: parseInt(e.target.value) });
    },
    [setPriceRange]
  );

  const handleAddToCart = useCallback((productId) => {
    console.log('Add to cart:', productId);
    // TODO: Implement add to cart logic with cart store
  }, []);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      // Scroll to top of products
      window.scrollTo({ top: 400, behavior: 'smooth' });
    },
    [setCurrentPage]
  );

  // Generate page numbers array for pagination
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Hero Banner */}
      <section className="relative bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              alt="Eyewear Accessories Banner"
              className="max-w-md rounded-lg shadow-xl"
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600"
            />
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-4">
              PHỤ KIỆN
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto md:mx-0">
              Nâng tầm phong cách và bảo vệ kính của bạn với bộ sưu tập phụ kiện
              cao cấp từ CClearly.
            </p>
          </div>
        </div>
        <div className="absolute top-10 right-10 text-primary opacity-20">
          <span className="material-icons text-8xl">auto_awesome</span>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="flex items-center space-x-2 text-sm font-bold uppercase border-b pb-2 mb-6">
                <span className="material-icons text-sm">tune</span>
                <span>BỘ LỌC</span>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">
                  Loại phụ kiện
                </h3>
                <div className="space-y-2">
                  {accessoryTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.accessoryTypes.includes(type.id)}
                        onChange={() => handleAccessoryTypeChange(type.id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span
                        className={`ml-3 text-sm transition-colors ${
                          filters.accessoryTypes.includes(type.id)
                            ? 'font-medium text-primary'
                            : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'
                        }`}
                      >
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">
                  Giá từ
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={filters.priceRange.max}
                    onChange={handlePriceRangeChange}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-4">
                    <div className="relative">
                      <span className="absolute left-2 top-1 text-[10px] text-slate-400">
                        Từ
                      </span>
                      <input
                        type="text"
                        value={filters.priceRange.min.toLocaleString('vi-VN')}
                        readOnly
                        className="w-24 text-xs pt-4 pb-1 px-2 border rounded border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-1 text-[10px] text-slate-400">
                        Đến
                      </span>
                      <input
                        type="text"
                        value={filters.priceRange.max.toLocaleString('vi-VN')}
                        readOnly
                        className="w-24 text-xs pt-4 pb-1 px-2 border rounded border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={handleClearFilters}
                className="w-full py-2 px-4 border border-slate-300 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest flex items-center justify-center"
              >
                Xoá bộ lọc
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-grow">
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hiển thị{' '}
                <span className="font-medium text-slate-900 dark:text-white">
                  {accessories.length}
                </span>{' '}
                / {pagination.totalItems} sản phẩm
              </p>
              {isLoading && (
                <div className="flex items-center space-x-2 text-sm text-primary">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Đang tải...</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Products */}
            {!isLoading && accessories.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4">
                  inventory_2
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Không tìm thấy sản phẩm phù hợp
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-primary hover:underline"
                >
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {accessories.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center space-y-4">
                {/* Page Info */}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Trang {pagination.currentPage} / {pagination.totalPages}
                </p>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-1">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center transition-colors ${
                      pagination.currentPage === 1
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Trang đầu"
                  >
                    <span className="material-icons text-sm">first_page</span>
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() =>
                      handlePageChange(pagination.currentPage - 1)
                    }
                    disabled={pagination.currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center transition-colors ${
                      pagination.currentPage === 1
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Trang trước"
                  >
                    <span className="material-icons text-sm">chevron_left</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-slate-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-medium transition-colors ${
                          pagination.currentPage === page
                            ? 'bg-primary text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Page */}
                  <button
                    onClick={() =>
                      handlePageChange(pagination.currentPage + 1)
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`w-8 h-8 flex items-center justify-center transition-colors ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Trang sau"
                  >
                    <span className="material-icons text-sm">
                      chevron_right
                    </span>
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`w-8 h-8 flex items-center justify-center transition-colors ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Trang cuối"
                  >
                    <span className="material-icons text-sm">last_page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessoriesPage;
