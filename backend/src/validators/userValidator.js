const { body, param, query } = require('express-validator');

const userValidators = {
  // Validate user creation
  createUser: [
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    
    body('password')
      .optional()
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    
    body('phoneNumber')
      .optional()
      .isMobilePhone().withMessage('Must be a valid phone number'),
    
    body('role')
      .optional()
      .isIn(['user', 'lawyer', 'admin']).withMessage('Invalid role')
  ],

  // Validate user update
  updateUser: [
    param('id')
      .isUUID().withMessage('Invalid user ID'),
    
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max:  50 }).withMessage('First name must be 2-50 characters'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    
    body('phoneNumber')
      .optional()
      .isMobilePhone().withMessage('Must be a valid phone number'),
    
    body('role')
      .optional()
      .isIn(['user', 'lawyer', 'admin']).withMessage('Invalid role')
  ],

  // Validate current user profile update
  updateMyProfile: [
    body('firstName')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),

    body('lastName')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),

    body('phoneNumber')
      .optional({ checkFalsy: true })
      .isMobilePhone().withMessage('Must be a valid phone number')
  ],

  // Validate user ID parameter
  userId: [
    param('id')
      .isUUID().withMessage('Invalid user ID')
  ],

  // Validate query parameters for listing users
  listUsers: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Search term too long'),
    
    query('role')
      .optional()
      .isIn(['user', 'lawyer', 'admin']).withMessage('Invalid role filter'),
    
    query('status')
      .optional()
      .isIn(['active', 'inactive']).withMessage('Invalid status filter'),
    
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'firstName', 'lastName', 'email', 'lastLogin']).withMessage('Invalid sort field'),
    
    query('sortOrder')
      .optional()
      .isIn(['ASC', 'DESC']).withMessage('Invalid sort order')
  ],

  // Validate status update
  updateStatus: [
    param('id')
      .isUUID().withMessage('Invalid user ID'),
    
    body('isActive')
      .isBoolean().withMessage('isActive must be a boolean')
  ],

  // Validate role update
  updateRole: [
    param('id')
      .isUUID().withMessage('Invalid user ID'),
    
    body('role')
      .isIn(['user', 'lawyer', 'admin']).withMessage('Invalid role')
  ]
};

module.exports = userValidators;