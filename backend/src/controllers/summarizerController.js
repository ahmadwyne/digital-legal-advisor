const { summarizeDocument } = require('../services/summarizerService');
const { createFeedback } = require('../services/feedbackService');

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

    return res.status(200).json({
      status: 'success',
      data: result,
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

module.exports = { summarize, submitFeedback };