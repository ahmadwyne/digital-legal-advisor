import api from '@/api/axios';

// Remove empty/null/undefined values from params so express-validator
// treats them as absent (truly optional) rather than invalid empty strings.
const cleanParams = (params) => {
    const cleaned = {};
    for (const [key, value] of Object.entries(params)) {
        if (value !== '' && value !== null && value !== undefined) {
            cleaned[key] = value;
        }
    }
    return cleaned;
};

export const datasetService = {
    /**
     * Get all datasets with filters and pagination
     */
    getAllDatasets: async (params) => {
        const response = await api.get('/datasets', { params: cleanParams(params) });
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
                'Content-Type': undefined, // Let axios set multipart/form-data with correct boundary
            },
            timeout: 120000, // 2 min timeout for file uploads
        });
        return response.data;
    },

    /**
     * Update dataset
     */
    updateDataset: async (id, formData) => {
        const response = await api.put(`/datasets/${id}`, formData, {
            headers: {
                'Content-Type': undefined, // Let axios set multipart/form-data with correct boundary
            },
            timeout: 120000, // 2 min timeout for file uploads
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