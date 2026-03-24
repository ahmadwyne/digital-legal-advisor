const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidators = require('../validators/userValidator');
const { validate } = require('../middlewares/validationMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin, restrictTo } = require('../middlewares/roleMiddleware');

// All routes require authentication
router.use(protect);

// ============================================
// REGULAR USER ROUTES (All authenticated users)
// ============================================

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private (all users)
 */
router.get('/me', userController.getMyProfile);

router.put(
  '/me',
  userValidators.updateMyProfile,
  validate,
  userController.updateMyProfile
);

// ============================================
// ADMIN-ONLY ROUTES
// ============================================

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Admin only
 */
router.get('/stats', isAdmin, userController.getUserStats);

/**
 * @route   GET /api/users/recent-actions
 * @desc    Get recent user actions for activity log
 * @access  Admin only
 */
router.get('/recent-actions', isAdmin, userController.getRecentActions);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filters
 * @access  Admin only
 */
router.get(
  '/',
  isAdmin,
  userValidators.listUsers,
  validate,
  userController.getAllUsers
);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Admin only
 */
router.post(
  '/',
  isAdmin,
  userValidators.createUser,
  validate,
  userController. createUser
);

/**
 * @route   GET /api/users/:id
 * @desc    Get single user by ID
 * @access  Admin only
 */
router.get(
  '/:id',
  isAdmin,
  userValidators.userId,
  validate,
  userController.getUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Admin only
 */
router.put(
  '/:id',
  isAdmin,
  userValidators.updateUser,
  validate,
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (soft delete)
 * @access  Admin only
 */
router.delete(
  '/:id',
  isAdmin,
  userValidators.userId,
  validate,
  userController.deleteUser
);

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Update user status (activate/suspend)
 * @access  Admin only
 */
router.patch(
  '/:id/status',
  isAdmin,
  userValidators.updateStatus,
  validate,
  userController.updateUserStatus
);

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Update user role
 * @access  Admin only
 */
router.patch(
  '/:id/role',
  isAdmin,
  userValidators.updateRole,
  validate,
  userController.updateUserRole
);

module.exports = router;