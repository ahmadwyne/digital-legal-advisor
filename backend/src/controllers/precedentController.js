const precedentSearchService = require('../services/precedentSearchService');

/**
 * POST /api/v1/precedents/search
 * Body: { query, topK? }
 */
exports.search = async (req, res, next) => {
  try {
    const { query, topK = 10 } = req.body;
    const userId = req.user.id;

    if (!query || !query.trim()) {
      return res.status(400).json({ status: 'error', message: 'Query is required' });
    }

    const data = await precedentSearchService.searchPrecedents({
      userId,
      query: query.trim(),
      topK: Math.min(parseInt(topK, 10) || 10, 20),
    });

    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/precedents/:id
 * Returns full precedent content (for view modal).
 */
exports.getById = async (req, res, next) => {
  try {
    const precedent = await precedentSearchService.getPrecedentById(req.params.id);
    res.status(200).json({ status: 'success', data: { precedent } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/precedents/history
 * Query: limit, offset
 */
exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit  = parseInt(req.query.limit,  10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const data = await precedentSearchService.getSearchHistory({ userId, limit, offset });
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getHistoryById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { searchId } = req.params;

    const data = await precedentSearchService.getHistoryById({ userId, searchId });

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/precedents/history/:searchId
 */
exports.deleteSearch = async (req, res, next) => {
  try {
    await precedentSearchService.deleteSearch({
      userId:   req.user.id,
      searchId: req.params.searchId,
    });
    res.status(200).json({ status: 'success', message: 'Search deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/precedents/feedback
 * Body: { searchId, rating: 'helpful'|'not_helpful', comment? }
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const { searchId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!searchId || !rating) {
      return res.status(400).json({ status: 'error', message: 'searchId and rating are required' });
    }
    if (!['helpful', 'not_helpful'].includes(rating)) {
      return res.status(400).json({ status: 'error', message: 'rating must be helpful or not_helpful' });
    }

    const feedback = await precedentSearchService.submitFeedback({ userId, searchId, rating, comment });
    res.status(200).json({ status: 'success', data: { feedback } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/precedents/:id/download
 * Returns plain-text judgment content as a downloadable file.
 */
exports.download = async (req, res, next) => {
  try {
    const { text, filename } = await precedentSearchService.generateDownloadContent(req.params.id);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(text);
  } catch (err) {
    next(err);
  }
};