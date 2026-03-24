const { body, param, query } = require('express-validator');

/**
 * Validation rules for listing datasets
 */
exports.listDatasets = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),
  
  query('category')
    .optional()
    .isIn([
      'case_law',
      'statutes',
      'regulations',
      'legal_forms',
      'precedents',
      'financial_laws',
      'contract_templates',
      'compliance_guidelines',
      'other'
    ])
    .withMessage('Invalid category'),
  
  query('status')
    .optional()
    .isIn(['pending', 'processing', 'active', 'archived', 'failed'])
    .withMessage('Invalid status'),
  
  query('fileFormat')
    .optional()
    .isIn(['json', 'csv', 'txt', 'pdf', 'docx', 'xlsx'])
    .withMessage('Invalid file format'),
  
  query('jurisdiction')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Jurisdiction too long'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name', 'fileSize', 'downloadCount', 'recordCount'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
  
  query('includeArchived')
    .optional()
    .isBoolean()
    .withMessage('includeArchived must be boolean')
];

/**
 * Validation rules for creating dataset
 */
exports.createDataset = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Dataset name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Dataset name must be between 3 and 255 characters')
    .matches(/^[a-zA-Z0-9\s\-_.()]+$/)
    .withMessage('Dataset name contains invalid characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description too long (max 2000 characters)'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'case_law',
      'statutes',
      'regulations',
      'legal_forms',
      'precedents',
      'financial_laws',
      'contract_templates',
      'compliance_guidelines',
      'other'
    ])
    .withMessage('Invalid category'),
  
  body('fileFormat')
    .notEmpty()
    .withMessage('File format is required')
    .isIn(['json', 'csv', 'txt', 'pdf', 'docx', 'xlsx'])
    .withMessage('Invalid file format. Allowed: json, csv, txt, pdf, docx, xlsx'),
  
  body('version')
    .optional()
    .matches(/^\d+\.\d+$/)
    .withMessage('Version must be in format X.Y (e.g., 1.0)'),
  
  body('tags')
    .optional()
    .custom((value) => {
      try {
        const tags = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(tags)) {
          throw new Error('Tags must be an array');
        }
        if (tags.length > 20) {
          throw new Error('Maximum 20 tags allowed');
        }
        if (tags.some(tag => typeof tag !== 'string' || tag.length > 50)) {
          throw new Error('Each tag must be a string with max 50 characters');
        }
        return true;
      } catch (error) {
        throw new Error(error.message || 'Invalid tags format');
      }
    }),
  
  body('jurisdiction')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Jurisdiction too long (max 100 characters)'),
  
  body('dateRange')
    .optional()
    .custom((value) => {
      try {
        const range = typeof value === 'string' ? JSON.parse(value) : value;
        if (range && (!range.startDate || !range.endDate)) {
          throw new Error('dateRange must have both startDate and endDate');
        }
        if (range && new Date(range.startDate) > new Date(range.endDate)) {
          throw new Error('startDate must be before endDate');
        }
        return true;
      } catch (error) {
        throw new Error(error.message || 'Invalid dateRange format');
      }
    }),
  
  body('metadata')
    .optional()
    .custom((value) => {
      try {
        const meta = typeof value === 'string' ? JSON.parse(value) : value;
        if (typeof meta !== 'object' || Array.isArray(meta)) {
          throw new Error('Metadata must be an object');
        }
        return true;
      } catch (error) {
        throw new Error(error.message || 'Invalid metadata format');
      }
    }),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be boolean')
];

/**
 * Validation rules for updating dataset
 */
exports.updateDataset = [
  param('id')
    .isUUID()
    .withMessage('Invalid dataset ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Dataset name must be between 3 and 255 characters')
    .matches(/^[a-zA-Z0-9\s\-_.()]+$/)
    .withMessage('Dataset name contains invalid characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description too long (max 2000 characters)'),
  
  body('category')
    .optional()
    .isIn([
      'case_law',
      'statutes',
      'regulations',
      'legal_forms',
      'precedents',
      'financial_laws',
      'contract_templates',
      'compliance_guidelines',
      'other'
    ])
    .withMessage('Invalid category'),
  
  body('fileFormat')
    .optional()
    .isIn(['json', 'csv', 'txt', 'pdf', 'docx', 'xlsx'])
    .withMessage('Invalid file format'),
  
  body('version')
    .optional()
    .matches(/^\d+\.\d+$/)
    .withMessage('Version must be in format X.Y'),
  
  body('tags')
    .optional()
    .custom((value) => {
      try {
        const tags = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(tags)) {
          throw new Error('Tags must be an array');
        }
        if (tags.length > 20) {
          throw new Error('Maximum 20 tags allowed');
        }
        if (tags.some(tag => typeof tag !== 'string' || tag.length > 50)) {
          throw new Error('Each tag must be a string with max 50 characters');
        }
        return true;
      } catch (error) {
        throw new Error(error.message || 'Invalid tags format');
      }
    }),
  
  body('jurisdiction')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Jurisdiction too long'),
  
  body('dateRange')
    .optional()
    .custom((value) => {
      try {
        const range = typeof value === 'string' ? JSON.parse(value) : value;
        if (range && (!range.startDate || !range.endDate)) {
          throw new Error('dateRange must have both startDate and endDate');
        }
        if (range && new Date(range.startDate) > new Date(range.endDate)) {
          throw new Error('startDate must be before endDate');
        }
        return true;
      } catch (error) {
        throw new Error(error.message || 'Invalid dateRange format');
      }
    }),
  
  body('metadata')
    .optional()
    .custom((value) => {
      try {
        const meta = typeof value === 'string' ? JSON.parse(value) : value;
        if (typeof meta !== 'object' || Array.isArray(meta)) {
          throw new Error('Metadata must be an object');
        }
        return true;
      } catch (error) {
        throw new Error(error.message || 'Invalid metadata format');
      }
    }),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be boolean'),
  
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'active', 'archived', 'failed'])
    .withMessage('Invalid status')
];

/**
 * Validation rules for dataset ID parameter
 */
exports.datasetId = [
  param('id')
    .isUUID()
    .withMessage('Invalid dataset ID format')
];

/**
 * Validation rules for bulk operations
 */
exports.bulkOperation = [
  body('operation')
    .notEmpty()
    .withMessage('Operation is required')
    .isIn(['archive', 'restore', 'delete'])
    .withMessage('Invalid operation. Must be: archive, restore, or delete'),
  
  body('datasetIds')
    .isArray({ min: 1, max: 50 })
    .withMessage('datasetIds must be an array with 1-50 items'),
  
  body('datasetIds.*')
    .isUUID()
    .withMessage('All dataset IDs must be valid UUIDs')
];

/**
 * Validation rules for analytics query
 */
exports.analyticsQuery = [
  query('timeRange')
    .optional()
    .isIn(['7days', '30days', '90days', '1year'])
    .withMessage('Invalid time range. Must be: 7days, 30days, 90days, or 1year')
];

/**
 * Validation rules for recent activities query
 */
exports.recentActivitiesQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];