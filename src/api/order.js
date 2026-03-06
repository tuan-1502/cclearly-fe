import http from '@/lib/http/client';
import { ENDPOINT } from '@/utils/endpoints';

export const orderRequest = {
  // Get all orders (with filters for admin/staff)
  getOrders: async (params) => {
    const res = await http.get(ENDPOINT.ORDERS, { query: params });
    return res.data;
  },

  // Get single order detail
  getOrderDetail: async (id) => {
    const res = await http.get(ENDPOINT.ORDER_DETAIL(id));
    return res.data;
  },

  // Create new order (regular order - in stock)
  createOrder: async (data) => {
    const res = await http.post(ENDPOINT.CREATE_ORDER, data);
    return res.data;
  },

  // Create prescription order (order with lens customization)
  createPrescriptionOrder: async (data) => {
    const res = await http.post(ENDPOINT.CREATE_PRESCRIPTION_ORDER, data);
    return res.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const res = await http.post(ENDPOINT.CANCEL_ORDER(id));
    return res.data;
  },

  // Update order status (Admin/Staff only)
  updateOrderStatus: async (id, status) => {
    const res = await http.patch(ENDPOINT.UPDATE_ORDER_STATUS(id), { status });
    return res.data;
  },

  // Get user's order history
  getUserOrders: async () => {
    const res = await http.get(ENDPOINT.USER_ORDERS);
    return res.data;
  },

  // Request return/refund
  requestReturn: async (orderId, data) => {
    const res = await http.post(ENDPOINT.REQUEST_RETURN(orderId), data);
    return res.data;
  },
};
