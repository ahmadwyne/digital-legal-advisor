import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // keep if you also use cookies elsewhere
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const summarizeDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await api.post('/summarizer/summarize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
};

export const submitSummaryFeedback = async (payload) => {
  const response = await api.post('/summarizer/feedback', payload);
  return response.data;
};