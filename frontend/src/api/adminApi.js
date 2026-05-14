import axiosInstance from './axios';

export const adminApi = {
  // Get full dashboard data
  getDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard', { timeout: 30000 });
    return response.data;
  },

  // Get stats only
  getStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },

  // Get activity chart data
  getActivityChart:  async (period = 'month') => {
    const response = await axiosInstance.get(`/admin/activity?period=${period}`);
    return response.data;
  },

  // Get system alerts
  getAlerts: async (limit = 10) => {
    const response = await axiosInstance.get(`/admin/alerts?limit=${limit}`);
    return response.data;
  },

  // Get feedback monitoring overview
  getFeedbackOverview: async (limit = 10) => {
    const response = await axiosInstance.get(`/admin/feedback/overview?limit=${limit}`);
    return response.data;
  }
};