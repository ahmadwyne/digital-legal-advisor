const { DocumentSummaryFeedback } = require('../models');

const createFeedback = async ({
  userId,
  rating,
  comment,
  documentName,
  summarySnippet,
  documentId,
  documentSummaryId,
  metadata
}) => {
  return DocumentSummaryFeedback.create({
    userId,
    rating,
    comment: comment || null,
    documentName: documentName || metadata?.documentName || null,
    summarySnippet: summarySnippet || metadata?.summarySnippet || null,
    documentId: documentId || metadata?.documentId || null,
    documentSummaryId: documentSummaryId || metadata?.documentSummaryId || null
  });
};

const getFeedbacks = async ({ page = 1, limit = 20 } = {}) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 20;

  return DocumentSummaryFeedback.findAndCountAll({
    order: [['createdAt', 'DESC']],
    offset: (safePage - 1) * safeLimit,
    limit: safeLimit
  });
};

module.exports = { createFeedback, getFeedbacks };