const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
};

export const chatApi = {
  /** POST /api/v1/chat */
  sendMessage: ({ message, sessionId = null, queryType = 'general', topK = 5 }) =>
    fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, sessionId, queryType, top_k: topK }),
    }).then(handleResponse),

  /** GET /api/v1/chat/history */
  getHistory: ({ limit = 50, offset = 0 } = {}) =>
    fetch(`${API_BASE}/chat/history?limit=${limit}&offset=${offset}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  /** DELETE /api/v1/chat/:queryId */
  deleteChat: (queryId) =>
    fetch(`${API_BASE}/chat/${queryId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  /** POST /api/v1/chat/feedback */
  submitFeedback: ({ responseId, rating, comment = '' }) =>
    fetch(`${API_BASE}/chat/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ responseId, rating, comment }),
    }).then(handleResponse),
};