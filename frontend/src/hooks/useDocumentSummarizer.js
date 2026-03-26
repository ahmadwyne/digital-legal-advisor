import { useState, useCallback } from 'react';
import { summarizeDocument, submitSummaryFeedback } from '../services/summarizerService';
import toast from 'react-hot-toast';

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_EXTS = ['.pdf', '.docx', '.doc', '.txt'];
const MAX_SIZE_MB = 10;

export const useDocumentSummarizer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const validateFile = (file) => {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!ALLOWED_EXTS.includes(ext)) {
      return `Unsupported file type. Please upload a PDF, DOCX, DOC, or TXT file.`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileUpload = useCallback(async (file) => {
    setError(null);
    setSummary(null);
    setFeedbackSubmitted(false);

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      setError(validationError);
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const response = await summarizeDocument(file, setUploadProgress);
      setSummary(response.data ? response.data : response);
      toast.success('Document summarized successfully!');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to summarize document. Please try again.';
      toast.error(message);
      setError(message);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, []);

  const handleFeedback = useCallback((rating) => {
    // Optimistic UI — actual submit happens in modal or inline
    if (!feedbackSubmitted) {
      submitSummaryFeedback({
        rating,
        documentName: uploadedFile?.name,
        summarySnippet: summary?.content?.slice(0, 200),
      }).catch(() => {/* silent fail for inline like/dislike */});
    }
  }, [feedbackSubmitted, uploadedFile, summary]);

  const handleFeedbackModalSubmit = useCallback(async ({ rating, comment }) => {
    try {
      await submitSummaryFeedback({
        rating,
        comment,
        documentName: uploadedFile?.name,
        summarySnippet: summary?.content?.slice(0, 200),
      });
      setFeedbackSubmitted(true);
      setIsFeedbackModalOpen(false);
      toast.success('Thank you for your feedback!');
    } catch {
      toast.error('Could not submit feedback. Please try again.');
    }
  }, [uploadedFile, summary]);

  const handleReset = useCallback(() => {
    setUploadedFile(null);
    setSummary(null);
    setError(null);
    setFeedbackSubmitted(false);
    setUploadProgress(0);
  }, []);

  return {
    uploadedFile,
    summary,
    isProcessing,
    uploadProgress,
    error,
    feedbackSubmitted,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    handleFileUpload,
    handleFeedback,
    handleFeedbackModalSubmit,
    handleReset,
    setSummary,
    setError,
  };
};