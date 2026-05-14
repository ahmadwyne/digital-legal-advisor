/**
 * precedentsApi.js  —  Frontend API service for legal precedents
 */
import { getAccessToken } from '@/utils/tokenManager';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server error ${res.status}`);
  }
  return res.json();
}

export const precedentsApi = {
  /**
   * Search precedents.
   * @param {{ query: string, topK?: number }} params
   */
  search: async ({ query, topK = 10 }) => {
    const res = await fetch(`${API_BASE}/precedents/search`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query, topK }),
    });
    return handleResponse(res);
    // Returns: { status, data: { searchId, query, results: [...] } }
  },

  /**
   * Get full precedent detail.
   * @param {string} id
   */
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/precedents/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
    // Returns: { status, data: { precedent } }
  },

  /**
   * Get user's search history.
   * @param {{ limit?: number, offset?: number }} params
   */
  getHistory: async ({ limit = 20, offset = 0 } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    const res = await fetch(`${API_BASE}/precedents/history?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
    // Returns: { status, data: { total, items: [...] } }
  },

  getHistoryById: async (searchId) => {
    const res = await api.get(`/precedents/history/${searchId}`);
    return res.data;
  },

  /**
   * Delete a search from history.
   * @param {string} searchId
   */
  deleteSearch: async (searchId) => {
    const res = await fetch(`${API_BASE}/precedents/history/${searchId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Submit feedback for a search.
   * @param {{ searchId: string, rating: 'helpful'|'not_helpful', comment?: string }} params
   */
  submitFeedback: async ({ searchId, rating, comment }) => {
    const res = await fetch(`${API_BASE}/precedents/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ searchId, rating, comment }),
    });
    return handleResponse(res);
  },

  /**
   * Download a judgment as plain text.
   * Triggers browser download.
   * @param {string} precedentId
   * @param {string} filename - suggested filename
   */
  download: async (precedentId, filename = 'judgment.txt') => {
    const res = await fetch(`${API_BASE}/precedents/${precedentId}/download`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};