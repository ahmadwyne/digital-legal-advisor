const express = require('express');
const router = express.Router();
const datasetController = require('../controllers/datasetController');
const datasetValidators = require('../validators/datasetValidator');
const { validate } = require('../middlewares/validationMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { 
  uploadDatasetFile, 
  handleUploadError, 
  validateFileFormat,
  sanitizeFilename 
} = require('../middlewares/uploadMiddleware');

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// ============================================
// STATISTICS & ANALYTICS ROUTES
// ============================================

/**
 * @route   GET /api/datasets/stats
 * @desc    Get dataset statistics
 * @access  Admin only
 */
router.get('/stats', datasetController.getDatasetStats);

/**
 * @route   GET /api/datasets/analytics
 * @desc    Get dataset analytics (charts data)
 * @access  Admin only
 */
router.get(
  '/analytics',
  datasetValidators.analyticsQuery,
  validate,
  datasetController.getDatasetAnalytics
);

/**
 * @route   GET /api/datasets/recent-activities
 * @desc    Get recent dataset activities
 * @access  Admin only
 */
router.get(
  '/recent-activities',
  datasetValidators.recentActivitiesQuery,
  validate,
  datasetController.getRecentActivities
);

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * @route   POST /api/datasets/bulk
 * @desc    Perform bulk operations (archive, restore, delete)
 * @access  Admin only
 */
router.post(
  '/bulk',
  datasetValidators.bulkOperation,
  validate,
  datasetController.bulkOperation
);

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * @route   GET /api/datasets
 * @desc    Get all datasets with pagination and filters
 * @access  Admin only
 */
router.get(
  '/',
  datasetValidators.listDatasets,
  validate,
  datasetController.getAllDatasets
);

/**
 * @route   POST /api/datasets
 * @desc    Create new dataset (upload file)
 * @access  Admin only
 */
router.post(
  '/',
  uploadDatasetFile,
  handleUploadError,
  sanitizeFilename,
  datasetValidators.createDataset,
  validate,
  validateFileFormat,
  datasetController.createDataset
);

/**
 * @route   GET /api/datasets/:id
 * @desc    Get single dataset by ID
 * @access  Admin only
 */
router.get(
  '/:id',
  datasetValidators.datasetId,
  validate,
  datasetController.getDataset
);

/**
 * @route   PUT /api/datasets/:id
 * @desc    Update dataset (optionally replace file)
 * @access  Admin only
 */
router.put(
  '/:id',
  uploadDatasetFile,
  handleUploadError,
  sanitizeFilename,
  datasetValidators.updateDataset,
  validate,
  validateFileFormat,
  datasetController.updateDataset
);

/**
 * @route   DELETE /api/datasets/:id
 * @desc    Delete dataset (soft delete by default, permanent with ?permanent=true)
 * @access  Admin only
 */
router.delete(
  '/:id',
  datasetValidators.datasetId,
  validate,
  datasetController.deleteDataset
);

// ============================================
// SPECIFIC OPERATIONS
// ============================================

/**
 * @route   PATCH /api/datasets/:id/archive
 * @desc    Archive dataset
 * @access  Admin only
 */
router.patch(
  '/:id/archive',
  datasetValidators.datasetId,
  validate,
  datasetController.archiveDataset
);

/**
 * @route   PATCH /api/datasets/:id/restore
 * @desc    Restore archived dataset
 * @access  Admin only
 */
router.patch(
  '/:id/restore',
  datasetValidators.datasetId,
  validate,
  datasetController.restoreDataset
);

/**
 * @route   GET /api/datasets/:id/download
 * @desc    Download dataset file (returns signed URL)
 * @access  Admin only
 */
router.get(
  '/:id/download',
  datasetValidators.datasetId,
  validate,
  datasetController.downloadDataset
);

/**
 * @route   GET /api/datasets/:id/verify
 * @desc    Verify dataset file integrity
 * @access  Admin only
 */
router.get(
  '/:id/verify',
  datasetValidators.datasetId,
  validate,
  datasetController.verifyDatasetIntegrity
);

module.exports = router;