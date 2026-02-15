import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const datasetService = {
    /**
     * Get all datasets with filters and pagination
     */
    getAllDatasets: async (params) => {
        const response = await api.get('/datasets', { params });
        return response.data;
    },

    /**
     * Get single dataset by ID
     */
    getDatasetById: async (id) => {
        const response = await api.get(`/datasets/${id}`);
        return response.data;
    },

    /**
     * Create new dataset (upload)
     */
    createDataset: async (formData) => {
        const response = await api.post('/datasets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Update dataset
     */
    updateDataset: async (id, formData) => {
        const response = await api.put(`/datasets/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Delete dataset (soft delete)
     */
    deleteDataset: async (id, permanent = false) => {
        const response = await api.delete(`/datasets/${id}`, {
            params: { permanent: permanent.toString() }
        });
        return response.data;
    },

    /**
     * Archive dataset
     */
    archiveDataset: async (id) => {
        const response = await api.patch(`/datasets/${id}/archive`);
        return response.data;
    },

    /**
     * Restore archived dataset
     */
    restoreDataset: async (id) => {
        const response = await api.patch(`/datasets/${id}/restore`);
        return response.data;
    },

    /**
     * Download dataset (get signed URL)
     */
    downloadDataset: async (id) => {
        const response = await api.get(`/datasets/${id}/download`);
        return response.data;
    },

    /**
     * Get dataset statistics
     */
    getStats: async () => {
        const response = await api.get('/datasets/stats');
        return response.data;
    },

    /**
     * Get dataset analytics
     */
    getAnalytics: async (timeRange = '30days') => {
        const response = await api.get('/datasets/analytics', {
            params: { timeRange }
        });
        return response.data;
    },

    /**
     * Get recent activities
     */
    getRecentActivities: async (limit = 20) => {
        const response = await api.get('/datasets/recent-activities', {
            params: { limit }
        });
        return response.data;
    },

    /**
     * Verify dataset integrity
     */
    verifyIntegrity: async (id) => {
        const response = await api.get(`/datasets/${id}/verify`);
        return response.data;
    },

    /**
     * Bulk operations
     */
    bulkOperation: async (operation, datasetIds) => {
        const response = await api.post('/datasets/bulk', {
            operation,
            datasetIds
        });
        return response.data;
    },
};