import { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/utils/tokenManager';
import { getSummaryHistoryItem, deleteSummaryHistoryItem } from '@/services/summarizerService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const useSummarizerHistory = ({ limit = 50 } = {}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      withCredentials: true,
    });

    instance.interceptors.request.use((config) => {
      const token = getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return instance;
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/summarizer/history?limit=${limit}&offset=0`);
      const items = res?.data?.data?.items || [];
      setHistory(items);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load summary history.');
    } finally {
      setLoading(false);
    }
  }, [api, limit]);

  const getHistoryItemSummary = useCallback(async (id) => {
    const res = await getSummaryHistoryItem(id);
    return res?.data;
  }, []);

  const deleteHistoryItem = useCallback(async (id) => {
    await deleteSummaryHistoryItem(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    refetchHistory: fetchHistory,
    getHistoryItemSummary,
    deleteHistoryItem,
  };
};

export default useSummarizerHistory;