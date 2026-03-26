const { summarizeDocument } = require('../services/summarizerService');
const { createFeedback } = require('../services/feedbackService');
const { saveSummaryRecord, getUserSummaryHistory } = require('../services/documentSummaryService');
const { ActivityLog } = require('../models');

/**
 * POST /api/v1/summarizer/summarize
 * Accepts multipart/form-data with a 'document' file field
 */
const summarize = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No document uploaded. Please attach a PDF, DOCX, or TXT file.',
      });
    }

    const { buffer, mimetype, originalname } = req.file;

    // File size check: 10MB max
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum allowed size is 10MB.',
      });
    }

    const result = await summarizeDocument(buffer, mimetype, originalname);
    
    const userId = req.user?.id;
    const ext = (originalname.split('.').pop() || '').toLowerCase();

    const savedRow = await saveSummaryRecord({
    userId,
    fileName: originalname,
    fileType: ext || mimetype,
    summaryResult: result,
    isValid: true
    });

    return res.status(200).json({
        status: 'success',
        data: {
            ...result,
            historyId: savedRow.id,
            documentId: savedRow.documentId
        },
    });
  } catch (error) {
    console.error('[SummarizerController] Error:', error.message);
    next(error);
  }
};

/**
 * POST /api/v1/summarizer/feedback
 * Save user feedback (like/dislike + optional comment) for a summary
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment, documentName, summarySnippet } = req.body;
    const userId = req.user?.id;

    if (!rating || !['like', 'dislike'].includes(rating)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rating. Must be "like" or "dislike".',
      });
    }

    const feedback = await createFeedback({
      userId,
      feature: 'document_summarizer',
      rating,
      comment: comment || null,
      metadata: { documentName, summarySnippet },
    });

    await ActivityLog.create({
    userId,
    eventType: 'Document Summary Feedback Submitted',
    severity: 'info',
    details: `Feedback submitted (${rating}) for summarizer`
    });

    return res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully.',
      data: feedback,
    });
  } catch (error) {
    console.error('[SummarizerController] Feedback error:', error.message);
    next(error);
  }
};

const getSummaryHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const limit = Number(req.query.limit || 20);
    const offset = Number(req.query.offset || 0);

    const data = await getUserSummaryHistory({ userId, limit, offset });

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { summarize, submitFeedback, getSummaryHistory };