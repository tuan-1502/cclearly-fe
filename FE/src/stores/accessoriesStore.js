import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Mock data for accessories
const MOCK_ACCESSORIES = [
  {
    id: 1,
    name: 'Hộp Da Farello',
    price: 75000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2023/3/Screenshot_17-1680147710000.jpeg',
    category: 'case',
    description: 'Hộp da cao cấp bảo vệ kính an toàn',
  },
  {
    id: 2,
    name: 'Nước Lau Kính CClearly',
    price: 15000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2023/3/z4220474433338_45e75cedc3fcc7c3c08815183f6c9516-1680077994000.jpeg',
    category: 'cleaning',
    description: 'Dung dịch vệ sinh kính chuyên dụng',
  },
  {
    id: 3,
    name: 'Túi Tote CClearly',
    price: 120000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2022/1/tui_tote_lily-1643006266000.jpeg',
    category: 'bag',
    description: 'Túi tote thời trang đựng kính',
  },
  {
    id: 4,
    name: 'Khăn Lau Kính Nano',
    price: 65000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2022/1/khan_nano_lily-1643006430000.jpeg',
    category: 'cleaning',
    description: 'Khăn lau công nghệ nano không để lại vết',
  },
  {
    id: 5,
    name: 'Bao Da Mềm CClearly',
    price: 25000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2022/1/bao_da_lily-1643006053000.jpeg',
    category: 'case',
    description: 'Bao da mềm tiện lợi',
  },
  {
    id: 6,
    name: 'Set Phụ Kiện Vít/Đệm Mũi',
    price: 140000,
    image:
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
    category: 'accessories',
    description: 'Bộ phụ kiện thay thế đầy đủ',
  },
  {
    id: 7,
    name: 'Dây Đeo Kính Thể Thao',
    price: 45000,
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
    category: 'strap',
    description: 'Dây đeo kính cho hoạt động thể thao',
  },
  {
    id: 8,
    name: 'Hộp Kính Cứng Premium',
    price: 95000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2022/10/hop-kinh-lily-1643005152000-1665460230000.jpeg',
    category: 'case',
    description: 'Hộp kính cứng cao cấp',
  },
  {
    id: 9,
    name: 'Dây Đeo Kính Vintage',
    price: 55000,
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
    category: 'strap',
    description: 'Dây đeo kính phong cách vintage',
  },
  {
    id: 10,
    name: 'Bộ Vệ Sinh Kính 3 Món',
    price: 85000,
    image:
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    category: 'cleaning',
    description: 'Bộ vệ sinh kính hoàn chỉnh',
  },
  {
    id: 11,
    name: 'Hộp Kính Gấp Gọn',
    price: 65000,
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    category: 'case',
    description: 'Hộp kính có thể gấp gọn tiện lợi',
  },
  {
    id: 12,
    name: 'Đệm Mũi Silicone',
    price: 35000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2023/2/1%20(2)-1677313131000.jpeg',
    category: 'accessories',
    description: 'Đệm mũi silicone mềm êm ái',
  },
  {
    id: 13,
    name: 'Dây Đeo Kính Kim Loại',
    price: 75000,
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
    category: 'strap',
    description: 'Dây đeo kính kim loại sang trọng',
  },
  {
    id: 14,
    name: 'Khăn Lau Microfiber',
    price: 25000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2023/3/z4221531575202_ea23eae98c93951877a3387a89c10555-1680144541000.jpeg',
    category: 'cleaning',
    description: 'Khăn lau sợi microfiber cao cấp',
  },
  {
    id: 15,
    name: 'Hộp Kính Da PU',
    price: 55000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2023/3/8-1680146122000.jpeg',
    category: 'case',
    description: 'Hộp kính da PU thời trang',
  },
  {
    id: 16,
    name: 'Bộ Vít Thay Thế',
    price: 20000,
    image:
      'https://cdn.kinhmatlily.com/lily01/2023/3/20180912_nGCC5P4HjL9CA2TzyYt7lv00-1680078282000.jpeg',
    category: 'accessories',
    description: 'Bộ vít thay thế đa năng',
  },
];

const CATEGORIES = [
  { id: 'case', label: 'Hộp kính' },
  { id: 'strap', label: 'Dây đeo kính' },
  { id: 'accessories', label: 'Đệm mũi' },
  { id: 'cleaning', label: 'Vệ sinh kính' },
  { id: 'bag', label: 'Túi đựng' },
];

/**
 * Accessories store - manages accessories state and API simulation
 */
export const useAccessoriesStore = create(
  devtools(
    (set, get) => ({
      // State
      accessories: [],
      categories: CATEGORIES,
      isLoading: false,
      error: null,

      // Pagination state
      pagination: {
        currentPage: 1,
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
      },

      // Filter state
      filters: {
        categories: [],
        priceRange: { min: 0, max: 500000 },
        searchQuery: '',
      },

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Set filters
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      // Toggle category filter
      toggleCategory: (categoryId) =>
        set((state) => {
          const categories = state.filters.categories.includes(categoryId)
            ? state.filters.categories.filter((id) => id !== categoryId)
            : [...state.filters.categories, categoryId];
          return {
            filters: { ...state.filters, categories },
          };
        }),

      // Set price range
      setPriceRange: (priceRange) =>
        set((state) => ({
          filters: { ...state.filters, priceRange },
        })),

      // Clear all filters
      clearFilters: () =>
        set({
          filters: {
            categories: [],
            priceRange: { min: 0, max: 500000 },
            searchQuery: '',
          },
        }),

      // Set current page
      setCurrentPage: (page) =>
        set((state) => ({
          pagination: { ...state.pagination, currentPage: page },
        })),

      // Set page size
      setPageSize: (pageSize) =>
        set((state) => ({
          pagination: { ...state.pagination, pageSize, currentPage: 1 },
        })),

      /**
       * Fetch accessories with pagination and filters
       * Simulates API call with delay
       */
      fetchAccessories: async () => {
        const { filters, pagination } = get();
        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Filter data based on filters
          let filteredData = [...MOCK_ACCESSORIES];

          // Filter by categories
          if (filters.categories.length > 0) {
            filteredData = filteredData.filter((item) =>
              filters.categories.includes(item.category)
            );
          }

          // Filter by price range
          filteredData = filteredData.filter(
            (item) =>
              item.price >= filters.priceRange.min &&
              item.price <= filters.priceRange.max
          );

          // Filter by search query
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query)
            );
          }

          // Calculate pagination
          const totalItems = filteredData.length;
          const totalPages = Math.ceil(totalItems / pagination.pageSize);
          const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
          const endIndex = startIndex + pagination.pageSize;
          const paginatedData = filteredData.slice(startIndex, endIndex);

          set({
            accessories: paginatedData,
            pagination: {
              ...pagination,
              totalItems,
              totalPages,
            },
            isLoading: false,
          });

          return { success: true, data: paginatedData };
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch accessories',
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Get accessory by ID
       */
      getAccessoryById: async (id) => {
        set({ isLoading: true });

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300));

          const accessory = MOCK_ACCESSORIES.find((item) => item.id === id);

          set({ isLoading: false });

          if (accessory) {
            return { success: true, data: accessory };
          }
          return { success: false, error: 'Accessory not found' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },
    }),
    { name: 'AccessoriesStore' }
  )
);

export default useAccessoriesStore;
