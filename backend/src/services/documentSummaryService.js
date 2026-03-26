const crypto = require('crypto');
const { DocumentSummary, DocumentSummaryHistory, ActivityLog, sequelize } = require('../models');

const saveSummaryRecord = async ({ userId, fileName, fileType, summaryResult, isValid = true }) => {
  return sequelize.transaction(async (t) => {
    const documentId = crypto.randomUUID();

    const row = await DocumentSummary.create({
      documentId,
      userId,
      fileName,
      fileType,
      uploadDate: new Date(),
      isValid,
      summaryContent: summaryResult?.content || null,
      docType: summaryResult?.type || null,
      docYear: summaryResult?.year || null,
      wordCount: summaryResult?.wordCount || null,
      method: summaryResult?.method || null,
      usedAI: !!summaryResult?.usedAI
    }, { transaction: t });

    await DocumentSummaryHistory.create({
      userId,
      documentSummaryId: row.id,
      entryTime: new Date()
    }, { transaction: t });

    await ActivityLog.create({
      userId,
      eventType: 'Document Summarized',
      severity: 'info',
      details: `Document summarized: ${fileName}`
    }, { transaction: t });

    return row;
  });
};

const getUserSummaryHistory = async ({ userId, limit = 20, offset = 0 }) => {
  const rows = await DocumentSummary.findAndCountAll({
    where: { userId },
    order: [['uploadDate', 'DESC']],
    limit,
    offset
  });

  return {
    total: rows.count,
    items: rows.rows.map((r) => ({
      id: r.id,
      documentId: r.documentId,
      fileName: r.fileName,
      fileType: r.fileType,
      uploadDate: r.uploadDate,
      isValid: r.isValid,
      docType: r.docType,
      docYear: r.docYear,
      wordCount: r.wordCount,
      method: r.method,
      usedAI: r.usedAI
    }))
  };
};

const getSummaryByIdForUser = async ({ userId, id }) => {
  const row = await DocumentSummary.findOne({
    where: { id, userId }
  });

  if (!row) return null;

  return {
    id: row.id,
    documentId: row.documentId,
    type: row.docType,
    year: row.docYear,
    source: row.fileName,
    content: row.summaryContent,
    wordCount: row.wordCount,
    usedAI: row.usedAI,
    method: row.method,
    fileType: row.fileType,
    uploadDate: row.uploadDate,
    isValid: row.isValid
  };
};

const deleteSummaryForUser = async ({ userId, id }) => {
  return sequelize.transaction(async (t) => {
    const row = await DocumentSummary.findOne({
      where: { id, userId },
      transaction: t
    });

    if (!row) return { deleted: false };

    await DocumentSummaryHistory.destroy({
      where: { userId, documentSummaryId: id },
      transaction: t
    });

    await row.destroy({ transaction: t });

    await ActivityLog.create({
      userId,
      eventType: 'Document Summary Deleted',
      severity: 'warning',
      details: `Document summary deleted: ${row.fileName}`
    }, { transaction: t });

    return { deleted: true };
  });
};

module.exports = {
  saveSummaryRecord,
  getUserSummaryHistory,
  getSummaryByIdForUser,
  deleteSummaryForUser
};