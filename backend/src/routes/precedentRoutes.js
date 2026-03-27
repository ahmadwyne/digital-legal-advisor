const express = require('express');
const router  = express.Router();

const ctrl = require('../controllers/precedentController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const v = require('../validators/precedentValidator');

// All routes require authentication
router.use(protect);

// ── Search ───────────────────────────────────────────────────────────────────
// POST /api/v1/precedents/search
router.post('/search', v.searchValidator, validate, ctrl.search);

// ── History ──────────────────────────────────────────────────────────────────
// GET  /api/v1/precedents/history
router.get('/history', v.historyValidator, validate, ctrl.getHistory);

// GET /api/v1/precedents/history/:searchId
router.get('/history/:searchId', v.searchIdParamValidator, validate, ctrl.getHistoryById);

// DELETE /api/v1/precedents/history/:searchId
router.delete('/history/:searchId', v.searchIdParamValidator, validate, ctrl.deleteSearch);

// ── Feedback ─────────────────────────────────────────────────────────────────
// POST /api/v1/precedents/feedback
router.post('/feedback', v.feedbackValidator, validate, ctrl.submitFeedback);

// ── Single precedent ─────────────────────────────────────────────────────────
// GET  /api/v1/precedents/:id
router.get('/:id', v.idParamValidator, validate, ctrl.getById);

// GET  /api/v1/precedents/:id/download
router.get('/:id/download', v.idParamValidator, validate, ctrl.download);

module.exports = router;