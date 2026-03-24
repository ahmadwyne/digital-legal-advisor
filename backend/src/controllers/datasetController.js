const datasetService = require('../services/datasetService');
const { paginateResponse } = require('../utils/pagination');

/**
 * Get all datasets with pagination and filters (Admin only)
 */
exports.getAllDatasets = async (req, res, next) => {
  try {
    const { 
      page, 
      limit, 
      search, 
      category, 
      status, 
      fileFormat,
      jurisdiction,
      tags,
      sortBy, 
      sortOrder,
      includeArchived 
    } = req.query;

    const result = await datasetService.getAllDatasets({
      page,
      limit,
      search,
      category,
      status,
      fileFormat,
      jurisdiction,
      tags,
      sortBy,
      sortOrder,
      includeArchived: includeArchived === 'true'
    });

    const response = paginateResponse(
      result.datasets,
      result.page,
      result.limit,
      result.totalDatasets
    );

    res.status(200).json({
      status: 'success',
      data: {
        datasets: response.data,
        pagination: response.pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single dataset by ID (Admin only)
 */
exports.getDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await datasetService.getDatasetById(id);

    res.status(200).json({
      status: 'success',
      data: { dataset }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new dataset (Admin only)
 */
exports.createDataset = async (req, res, next) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    // Parse JSON fields from multipart form data
    const datasetData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      fileFormat: req.body.fileFormat,
      version: req.body.version || '1.0',
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      jurisdiction: req.body.jurisdiction,
      dateRange: req.body.dateRange ? JSON.parse(req.body.dateRange) : null,
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
      isPublic: req.body.isPublic === 'true',
      originalFileName: req.file.originalname
    };

    const newDataset = await datasetService.createDataset(
      req.file.buffer,
      datasetData,
      req.user.id
    );

    res.status(201).json({
      status: 'success',
      message: 'Dataset created successfully',
      data: { dataset: newDataset }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update dataset (Admin only)
 */
exports.updateDataset = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Parse update data
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      fileFormat: req.body.fileFormat,
      version: req.body.version,
      tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
      jurisdiction: req.body.jurisdiction,
      dateRange: req.body.dateRange ? JSON.parse(req.body.dateRange) : undefined,
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic === 'true' : undefined,
      status: req.body.status
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Handle file replacement if new file is uploaded
    const fileBuffer = req.file ? req.file.buffer : null;
    if (req.file) {
      updateData.originalFileName = req.file.originalname;
    }

    const updatedDataset = await datasetService.updateDataset(
      id,
      fileBuffer,
      updateData,
      req.user.id
    );

    res.status(200).json({
      status: 'success',
      message: 'Dataset updated successfully',
      data: { dataset: updatedDataset }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete dataset (Admin only)
 */
exports.deleteDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    let result;
    if (permanent === 'true') {
      result = await datasetService.permanentDeleteDataset(id, req.user.id);
    } else {
      result = await datasetService.deleteDataset(id, req.user.id);
    }

    res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Archive dataset (Admin only)
 */
exports.archiveDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await datasetService.archiveDataset(id, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Dataset archived successfully',
      data: { dataset }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restore archived dataset (Admin only)
 */
exports.restoreDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await datasetService.restoreDataset(id, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Dataset restored successfully',
      data: { dataset }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download dataset file (Admin only)
 */
exports.downloadDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const downloadInfo = await datasetService.downloadDataset(id, req.user.id);

    res.status(200).json({
      status: 'success',
      data: downloadInfo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dataset statistics (Admin only)
 */
exports.getDatasetStats = async (req, res, next) => {
  try {
    const stats = await datasetService.getDatasetStats();

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dataset analytics (Admin only)
 */
exports.getDatasetAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '30days' } = req.query;
    const analytics = await datasetService.getDatasetAnalytics(timeRange);

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify dataset integrity (Admin only)
 */
exports.verifyDatasetIntegrity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await datasetService.verifyDatasetIntegrity(id);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent dataset activities (Admin only)
 */
exports.getRecentActivities = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const activities = await datasetService.getRecentActivities(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { activities }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk operations on datasets (Admin only)
 */
exports.bulkOperation = async (req, res, next) => {
  try {
    const { operation, datasetIds } = req.body;

    if (!operation || !datasetIds || !Array.isArray(datasetIds)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request. Operation and datasetIds array required.'
      });
    }

    const results = {
      successful: [],
      failed: []
    };

    for (const datasetId of datasetIds) {
      try {
        switch (operation) {
          case 'archive':
            await datasetService.archiveDataset(datasetId, req.user.id);
            results.successful.push(datasetId);
            break;
          case 'restore':
            await datasetService.restoreDataset(datasetId, req.user.id);
            results.successful.push(datasetId);
            break;
          case 'delete':
            await datasetService.deleteDataset(datasetId, req.user.id);
            results.successful.push(datasetId);
            break;
          default:
            results.failed.push({ 
              datasetId, 
              error: 'Invalid operation' 
            });
        }
      } catch (error) {
        results.failed.push({ 
          datasetId, 
          error: error.message 
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Bulk ${operation} completed`,
      data: results
    });
  } catch (error) {
    next(error);
  }
};