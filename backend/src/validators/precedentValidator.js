const { body, param, query } = require('express-validator');

exports.searchValidator = [
  body('query')
    .trim()
    .notEmpty().withMessage('Search query is required')
    .isLength({ min: 3, max: 500 }).withMessage('Query must be between 3 and 500 characters'),

  body('topK')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('topK must be an integer between 1 and 20'),
];

exports.feedbackValidator = [
  body('searchId')
    .notEmpty().withMessage('searchId is required')
    .isUUID().withMessage('searchId must be a valid UUID'),

  body('rating')
    .notEmpty().withMessage('rating is required')
    .isIn(['helpful', 'not_helpful']).withMessage('rating must be helpful or not_helpful'),

  body('comment')
    .optional()
    .isLength({ max: 1000 }).withMessage('Comment must be under 1000 characters'),
];

exports.historyValidator = [
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('offset').optional().isInt({ min: 0 }),
];

exports.idParamValidator = [
  param('id').isUUID().withMessage('Invalid precedent ID'),
];

exports.searchIdParamValidator = [
  param('searchId').isUUID().withMessage('Invalid search ID'),
];