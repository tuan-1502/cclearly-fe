import http from '@/lib/http/client';
import { ENDPOINT } from '@/utils/endpoints';

export const userRequest = {
  // Get user profile
  getProfile: async () => {
    const res = await http.get(ENDPOINT.USER_PROFILE);
    return res.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const res = await http.patch(ENDPOINT.USER_PROFILE, data);
    return res.data;
  },

  // Get order history
  getOrderHistory: async (params) => {
    const res = await http.get(ENDPOINT.USER_ORDERS, { query: params });
    return res.data;
  },

  // Request return/refund for an order
  requestReturn: async (orderId, data) => {
    const res = await http.post(ENDPOINT.REQUEST_RETURN(orderId), data);
    return res.data;
  },
};
