/**
 * Accessories Store
 * Manages accessories state with Zustand
 * Structure matches database schema:
 * - products (product_id, name, base_price, category_type='ACCESSORY', is_active)
 * - product_variants (variant_id, color_name, sale_price, sku, is_preorder, expected_availability, product_id)
 * - product_images (image_id, image_url, product_id, variant_id)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Mock data matching database structure
const MOCK_ACCESSORIES = [
  {
    product_id: 'acc-001-58cc-4372-a567-0e02b2c3d479',
    name: 'Hộp Da Farello',
    base_price: 75000,
    category_type: 'ACCESSORY',
    accessory_type: 'CASE',
    is_active: true,
    description: 'Hộp da cao cấp bảo vệ kính an toàn',
    variants: [
      {
        variant_id: 'v-acc-001-001',
        color_name: 'Black',
        sale_price: 75000,
        sku: 'ACC-CASE-FARELLO-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-acc-001-002',
        color_name: 'Brown',
        sale_price: 75000,
        sku: 'ACC-CASE-FARELLO-BRN',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-001',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2023/3/Screenshot_17-1680147710000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-002-58cc-4372-a567-0e02b2c3d479',
    name: 'Nước Lau Kính CClearly',
    base_price: 15000,
    category_type: 'ACCESSORY',
    accessory_type: 'CLEANING',
    is_active: true,
    description: 'Dung dịch vệ sinh kính chuyên dụng',
    variants: [
      {
        variant_id: 'v-acc-002-001',
        color_name: 'Default',
        sale_price: 15000,
        sku: 'ACC-CLN-SPRAY-001',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-002',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2023/3/z4220474433338_45e75cedc3fcc7c3c08815183f6c9516-1680077994000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-003-58cc-4372-a567-0e02b2c3d479',
    name: 'Túi Tote CClearly',
    base_price: 120000,
    category_type: 'ACCESSORY',
    accessory_type: 'BAG',
    is_active: true,
    description: 'Túi tote thời trang đựng kính',
    badge: 'Best Seller',
    variants: [
      {
        variant_id: 'v-acc-003-001',
        color_name: 'Beige',
        sale_price: 120000,
        sku: 'ACC-BAG-TOTE-BGE',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-003',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2022/1/tui_tote_lily-1643006266000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-004-58cc-4372-a567-0e02b2c3d479',
    name: 'Khăn Lau Kính Nano',
    base_price: 65000,
    category_type: 'ACCESSORY',
    accessory_type: 'CLEANING',
    is_active: true,
    description: 'Khăn lau công nghệ nano không để lại vết',
    variants: [
      {
        variant_id: 'v-acc-004-001',
        color_name: 'Blue',
        sale_price: 65000,
        sku: 'ACC-CLN-NANO-BLU',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-004',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2022/1/khan_nano_lily-1643006430000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-005-58cc-4372-a567-0e02b2c3d479',
    name: 'Bao Da Mềm CClearly',
    base_price: 25000,
    category_type: 'ACCESSORY',
    accessory_type: 'CASE',
    is_active: true,
    description: 'Bao da mềm tiện lợi',
    variants: [
      {
        variant_id: 'v-acc-005-001',
        color_name: 'Black',
        sale_price: 25000,
        sku: 'ACC-CASE-SOFT-BLK',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-005',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2022/1/bao_da_lily-1643006053000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-006-58cc-4372-a567-0e02b2c3d479',
    name: 'Set Phụ Kiện Vít/Đệm Mũi',
    base_price: 140000,
    category_type: 'ACCESSORY',
    accessory_type: 'PARTS',
    is_active: true,
    description: 'Bộ phụ kiện thay thế đầy đủ',
    badge: 'Popular',
    variants: [
      {
        variant_id: 'v-acc-006-001',
        color_name: 'Mixed',
        sale_price: 140000,
        sku: 'ACC-PARTS-SET-MIX',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-006',
        image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-007-58cc-4372-a567-0e02b2c3d479',
    name: 'Dây Đeo Kính Thể Thao',
    base_price: 45000,
    category_type: 'ACCESSORY',
    accessory_type: 'STRAP',
    is_active: true,
    description: 'Dây đeo kính cho hoạt động thể thao',
    variants: [
      {
        variant_id: 'v-acc-007-001',
        color_name: 'Black',
        sale_price: 45000,
        sku: 'ACC-STRAP-SPORT-BLK',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-acc-007-002',
        color_name: 'Blue',
        sale_price: 45000,
        sku: 'ACC-STRAP-SPORT-BLU',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-007',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-008-58cc-4372-a567-0e02b2c3d479',
    name: 'Hộp Kính Cứng Premium',
    base_price: 95000,
    category_type: 'ACCESSORY',
    accessory_type: 'CASE',
    is_active: true,
    description: 'Hộp kính cứng cao cấp',
    badge: 'Premium',
    variants: [
      {
        variant_id: 'v-acc-008-001',
        color_name: 'Black',
        sale_price: 95000,
        sku: 'ACC-CASE-HARD-BLK',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-008',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2022/10/hop-kinh-lily-1643005152000-1665460230000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-009-58cc-4372-a567-0e02b2c3d479',
    name: 'Dây Đeo Kính Vintage',
    base_price: 55000,
    category_type: 'ACCESSORY',
    accessory_type: 'STRAP',
    is_active: true,
    description: 'Dây đeo kính phong cách vintage',
    variants: [
      {
        variant_id: 'v-acc-009-001',
        color_name: 'Gold',
        sale_price: 55000,
        sku: 'ACC-STRAP-VTG-GLD',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-009',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-010-58cc-4372-a567-0e02b2c3d479',
    name: 'Bộ Vệ Sinh Kính 3 Món',
    base_price: 85000,
    category_type: 'ACCESSORY',
    accessory_type: 'CLEANING',
    is_active: true,
    description: 'Bộ vệ sinh kính hoàn chỉnh',
    badge: 'New',
    variants: [
      {
        variant_id: 'v-acc-010-001',
        color_name: 'Default',
        sale_price: 85000,
        sku: 'ACC-CLN-SET3-001',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-010',
        image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-011-58cc-4372-a567-0e02b2c3d479',
    name: 'Hộp Kính Gấp Gọn',
    base_price: 65000,
    category_type: 'ACCESSORY',
    accessory_type: 'CASE',
    is_active: true,
    description: 'Hộp kính có thể gấp gọn tiện lợi',
    variants: [
      {
        variant_id: 'v-acc-011-001',
        color_name: 'Gray',
        sale_price: 65000,
        sku: 'ACC-CASE-FOLD-GRY',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-011',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-012-58cc-4372-a567-0e02b2c3d479',
    name: 'Đệm Mũi Silicone',
    base_price: 35000,
    category_type: 'ACCESSORY',
    accessory_type: 'PARTS',
    is_active: true,
    description: 'Đệm mũi silicone mềm êm ái',
    variants: [
      {
        variant_id: 'v-acc-012-001',
        color_name: 'Clear',
        sale_price: 35000,
        sku: 'ACC-PARTS-NOSE-CLR',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-012',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2023/2/1%20(2)-1677313131000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-013-58cc-4372-a567-0e02b2c3d479',
    name: 'Dây Đeo Kính Kim Loại',
    base_price: 75000,
    category_type: 'ACCESSORY',
    accessory_type: 'STRAP',
    is_active: true,
    description: 'Dây đeo kính kim loại sang trọng',
    badge: 'Premium',
    variants: [
      {
        variant_id: 'v-acc-013-001',
        color_name: 'Silver',
        sale_price: 75000,
        sku: 'ACC-STRAP-MTL-SLV',
        is_preorder: false,
        expected_availability: null,
      },
      {
        variant_id: 'v-acc-013-002',
        color_name: 'Gold',
        sale_price: 75000,
        sku: 'ACC-STRAP-MTL-GLD',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-013',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-014-58cc-4372-a567-0e02b2c3d479',
    name: 'Khăn Lau Microfiber',
    base_price: 25000,
    category_type: 'ACCESSORY',
    accessory_type: 'CLEANING',
    is_active: true,
    description: 'Khăn lau sợi microfiber cao cấp',
    variants: [
      {
        variant_id: 'v-acc-014-001',
        color_name: 'Blue',
        sale_price: 25000,
        sku: 'ACC-CLN-MF-BLU',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-014',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2023/3/z4221531575202_ea23eae98c93951877a3387a89c10555-1680144541000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-015-58cc-4372-a567-0e02b2c3d479',
    name: 'Hộp Kính Da PU',
    base_price: 55000,
    category_type: 'ACCESSORY',
    accessory_type: 'CASE',
    is_active: true,
    description: 'Hộp kính da PU thời trang',
    variants: [
      {
        variant_id: 'v-acc-015-001',
        color_name: 'Brown',
        sale_price: 55000,
        sku: 'ACC-CASE-PU-BRN',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-015',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2023/3/8-1680146122000.jpeg',
        variant_id: null,
      },
    ],
  },
  {
    product_id: 'acc-016-58cc-4372-a567-0e02b2c3d479',
    name: 'Bộ Vít Thay Thế',
    base_price: 20000,
    category_type: 'ACCESSORY',
    accessory_type: 'PARTS',
    is_active: true,
    description: 'Bộ vít thay thế đa năng',
    variants: [
      {
        variant_id: 'v-acc-016-001',
        color_name: 'Mixed',
        sale_price: 20000,
        sku: 'ACC-PARTS-SCREW-MIX',
        is_preorder: false,
        expected_availability: null,
      },
    ],
    images: [
      {
        image_id: 'img-acc-016',
        image_url: 'https://cdn.kinhmatlily.com/lily01/2023/3/20180912_nGCC5P4HjL9CA2TzyYt7lv00-1680078282000.jpeg',
        variant_id: null,
      },
    ],
  },
];

// Accessory types (similar to product_accessories.type)
const ACCESSORY_TYPES = [
  { id: 'CASE', label: 'Hộp kính' },
  { id: 'STRAP', label: 'Dây đeo kính' },
  { id: 'PARTS', label: 'Phụ kiện thay thế' },
  { id: 'CLEANING', label: 'Vệ sinh kính' },
  { id: 'BAG', label: 'Túi đựng' },
];

/**
 * Helper function to transform product for display
 */
const transformProductForDisplay = (product) => ({
  id: product.product_id,
  product_id: product.product_id,
  name: product.name,
  price: product.variants[0]?.sale_price || product.base_price,
  base_price: product.base_price,
  image: product.images[0]?.image_url || '',
  images: product.images,
  accessory_type: product.accessory_type,
  variants: product.variants,
  badge: product.badge,
  category_type: product.category_type,
  is_active: product.is_active,
  description: product.description,
});

/**
 * Accessories store with Zustand
 */
export const useAccessoriesStore = create(
  devtools(
    (set, get) => ({
      // State
      accessories: [],
      accessoryTypes: ACCESSORY_TYPES,
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
      },
      filters: {
        accessoryTypes: [],
        priceRange: { min: 0, max: 500000 },
        searchQuery: '',
      },

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, currentPage: 1 },
        })),

      toggleAccessoryType: (accessoryType) =>
        set((state) => {
          const accessoryTypes = state.filters.accessoryTypes.includes(accessoryType)
            ? state.filters.accessoryTypes.filter((t) => t !== accessoryType)
            : [...state.filters.accessoryTypes, accessoryType];
          return {
            filters: { ...state.filters, accessoryTypes },
            pagination: { ...state.pagination, currentPage: 1 },
          };
        }),

      setPriceRange: (priceRange) =>
        set((state) => ({
          filters: { ...state.filters, priceRange },
          pagination: { ...state.pagination, currentPage: 1 },
        })),

      clearFilters: () =>
        set((state) => ({
          filters: {
            accessoryTypes: [],
            priceRange: { min: 0, max: 500000 },
            searchQuery: '',
          },
          pagination: { ...state.pagination, currentPage: 1 },
        })),

      setCurrentPage: (page) =>
        set((state) => ({
          pagination: { ...state.pagination, currentPage: page },
        })),

      setPageSize: (pageSize) =>
        set((state) => ({
          pagination: { ...state.pagination, pageSize, currentPage: 1 },
        })),

      // Async action to fetch accessories (simulates API call)
      fetchAccessories: async () => {
        const { filters, pagination } = get();

        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Filter products based on current filters
          let filteredAccessories = [...MOCK_ACCESSORIES].filter((p) => p.is_active);

          // Filter by accessory_type
          if (filters.accessoryTypes.length > 0) {
            filteredAccessories = filteredAccessories.filter((acc) =>
              filters.accessoryTypes.includes(acc.accessory_type)
            );
          }

          // Filter by price range (using first variant's sale_price)
          filteredAccessories = filteredAccessories.filter((acc) => {
            const price = acc.variants[0]?.sale_price || acc.base_price;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
          });

          // Filter by search query
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filteredAccessories = filteredAccessories.filter(
              (acc) =>
                acc.name.toLowerCase().includes(query) ||
                acc.description?.toLowerCase().includes(query)
            );
          }

          // Calculate pagination
          const totalItems = filteredAccessories.length;
          const totalPages = Math.ceil(totalItems / pagination.pageSize);
          const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
          const endIndex = startIndex + pagination.pageSize;
          const paginatedAccessories = filteredAccessories
            .slice(startIndex, endIndex)
            .map(transformProductForDisplay);

          set({
            accessories: paginatedAccessories,
            pagination: {
              ...pagination,
              totalItems,
              totalPages,
            },
            isLoading: false,
          });

          return { accessories: paginatedAccessories, totalItems, totalPages };
        } catch (error) {
          set({
            error: 'Không thể tải danh sách phụ kiện. Vui lòng thử lại.',
            isLoading: false,
          });
          throw error;
        }
      },

      // Get single accessory by product_id
      getAccessoryById: async (productId) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const accessory = MOCK_ACCESSORIES.find((a) => a.product_id === productId);

          set({ isLoading: false });

          if (!accessory) {
            throw new Error('Không tìm thấy sản phẩm');
          }

          return transformProductForDisplay(accessory);
        } catch (error) {
          set({
            error: error.message || 'Không thể tải thông tin sản phẩm.',
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    { name: 'accessories-store' }
  )
);

export default useAccessoriesStore;
