import { useState, useCallback, useRef } from 'react';
import { precedentsApi } from '@/api/precedentsApi';

/**
 * useLegalPrecedents — manages search, history, feedback, and downloads
 * for the Legal Precedents feature.
 */
export const useLegalPrecedents = () => {
  // ─── Search state ────────────────────────────────────────────────────────
  const [results,     setResults]     = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearchId, setCurrentSearchId] = useState(null);
  const [currentQuery,    setCurrentQuery]    = useState('');

  // ─── History state ───────────────────────────────────────────────────────
  const [history,        setHistory]        = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError,   setHistoryError]   = useState(null);
  const [historyTotal,   setHistoryTotal]   = useState(0);

  // ─── Detail modal state ──────────────────────────────────────────────────
  const [detailPrecedent, setDetailPrecedent] = useState(null);
  const [detailLoading,   setDetailLoading]   = useState(false);

  // ─── Feedback state ──────────────────────────────────────────────────────
  const [feedbackState, setFeedbackState] = useState({}); // { [searchId]: 'helpful'|'not_helpful' }

  // ─── Download state ──────────────────────────────────────────────────────
  const [downloading, setDownloading] = useState({}); // { [precedentId]: boolean }

  // ─── Abort ref ───────────────────────────────────────────────────────────
  const abortRef = useRef(null);

  // ────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ────────────────────────────────────────────────────────────────────────
  const searchPrecedents = useCallback(async (query) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);
    setCurrentQuery(query);
    setResults([]);

    try {
      const res = await precedentsApi.search({ query, topK: 10 });
      setResults(res.data.results || []);
      setCurrentSearchId(res.data.searchId);
    } catch (err) {
      setSearchError(err.message || 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setHasSearched(false);
    setSearchError(null);
    setCurrentSearchId(null);
    setCurrentQuery('');
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // HISTORY
  // ────────────────────────────────────────────────────────────────────────
  const loadHistory = useCallback(async ({ limit = 20, offset = 0 } = {}) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await precedentsApi.getHistory({ limit, offset });
      setHistory(res.data.items || []);
      setHistoryTotal(res.data.total || 0);
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const deleteSearch = useCallback(async (searchId) => {
    try {
      await precedentsApi.deleteSearch(searchId);
      setHistory(prev => prev.filter(s => s.id !== searchId));
      setHistoryTotal(prev => Math.max(0, prev - 1));
      // If viewing deleted search's results, clear them
      if (currentSearchId === searchId) clearResults();
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, [currentSearchId, clearResults]);

  const replaySearch = useCallback(async (searchId) => {
    if (!searchId) return;
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const res = await precedentsApi.getHistoryById(searchId); // new API call
      const payload = res.data || {};

      setCurrentSearchId(payload.id || searchId);
      setCurrentQuery(payload.query || '');
      setResults(payload.results || []);
    } catch (err) {
      setSearchError(err.message || 'Failed to load previous search.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // DETAIL MODAL
  // ────────────────────────────────────────────────────────────────────────
  const openDetail = useCallback(async (precedentId) => {
    setDetailLoading(true);
    setDetailPrecedent(null);
    try {
      const res = await precedentsApi.getById(precedentId);
      setDetailPrecedent(res.data.precedent);
    } catch (err) {
      console.error('Detail load error:', err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailPrecedent(null);
    setDetailLoading(false);
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // FEEDBACK
  // ────────────────────────────────────────────────────────────────────────
  const submitFeedback = useCallback(async ({ searchId, rating, comment }) => {
    try {
      await precedentsApi.submitFeedback({ searchId, rating, comment });
      setFeedbackState(prev => ({ ...prev, [searchId]: rating }));
    } catch (err) {
      console.error('Feedback error:', err);
    }
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // DOWNLOAD
  // ────────────────────────────────────────────────────────────────────────
  const downloadJudgment = useCallback(async (precedentId, citation) => {
    if (downloading[precedentId]) return;
    setDownloading(prev => ({ ...prev, [precedentId]: true }));
    try {
      const filename = `${(citation || 'judgment').replace(/[/\\:*?"<>|]/g, '_')}.txt`;
      await precedentsApi.download(precedentId, filename);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(prev => ({ ...prev, [precedentId]: false }));
    }
  }, [downloading]);

  return {
    // Search
    results, isSearching, searchError, hasSearched,
    currentSearchId, currentQuery,
    searchPrecedents, clearResults,

    // History
    history, historyLoading, historyError, historyTotal,
    loadHistory, deleteSearch, replaySearch,

    // Detail
    detailPrecedent, detailLoading, openDetail, closeDetail,

    // Feedback
    feedbackState, submitFeedback,

    // Download
    downloading, downloadJudgment,
  };
};

export default useLegalPrecedents;