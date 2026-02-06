/**
 * Accessories service
 * Simulates API calls for accessories
 * In production, replace with actual API calls
 */

import { useAccessoriesStore } from '@stores/accessoriesStore';

export const accessoriesService = {
  /**
   * Fetch accessories with pagination and filters
   * @param {Object} params
   * @param {number} params.page - Current page
   * @param {number} params.pageSize - Items per page
   * @param {string[]} params.categories - Category filters
   * @param {Object} params.priceRange - Price range filter
   * @param {string} params.searchQuery - Search query
   * @returns {Promise<Object>}
   */
  getAccessories: async (params = {}) => {
    const store = useAccessoriesStore.getState();

    // Update filters if provided
    if (params.categories !== undefined) {
      store.setFilters({ categories: params.categories });
    }
    if (params.priceRange !== undefined) {
      store.setPriceRange(params.priceRange);
    }
    if (params.searchQuery !== undefined) {
      store.setFilters({ searchQuery: params.searchQuery });
    }
    if (params.page !== undefined) {
      store.setCurrentPage(params.page);
    }
    if (params.pageSize !== undefined) {
      store.setPageSize(params.pageSize);
    }

    // Fetch with current state
    return store.fetchAccessories();
  },

  /**
   * Get single accessory by ID
   * @param {number} id - Accessory ID
   * @returns {Promise<Object>}
   */
  getAccessoryById: async (id) => {
    const store = useAccessoriesStore.getState();
    return store.getAccessoryById(id);
  },

  /**
   * Add accessory to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>}
   */
  addToCart: async (productId, quantity = 1) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`Added product ${productId} (qty: ${quantity}) to cart`);

    // In production, call actual cart API
    return {
      success: true,
      message: 'Đã thêm vào giỏ hàng',
    };
  },
};

export default accessoriesService;
