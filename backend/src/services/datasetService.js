const { Dataset, User, ActivityLog, sequelize } = require('../models');
const { Op } = require('sequelize');
const { getPagination } = require('../utils/pagination');
const storageUtil = require('../utils/supabaseStorage');

class DatasetService {
  normalizeTags(tags) {
    if (!tags) return null;
    if (Array.isArray(tags)) {
      return tags
        .map(tag => `${tag}`.trim().toLowerCase())
        .filter(Boolean);
    }
    if (typeof tags === 'string') {
      const parsed = tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean);
      return parsed.length ? parsed : null;
    }
    return null;
  }

  mapDatasetType(category) {
    const mapping = {
      case_law: 'case_law',
      statutes: 'statute',
      regulations: 'regulation',
      precedents: 'precedent'
    };
    return mapping[category] || 'case_law';
  }

  /**
   * Get all datasets with pagination, search, and filters
   */
  async getAllDatasets(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        category = null,
        status = null,
        fileFormat = null,
        jurisdiction = null,
        tags = null,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeArchived = false
      } = options;

      // Build where clause
      const where = { isDeleted: false };

      // Include archived datasets only if specified
      if (!includeArchived) {
        where.status = { [Op.ne]: 'archived' };
      }

      // Search filter (name, description, tags)
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          sequelize.where(
            sequelize.fn('array_to_string', sequelize.col('tags'), ','),
            { [Op.iLike]: `%${search}%` }
          )
        ];
      }

      // Category filter
      if (category) {
        where.category = category;
      }

      // Status filter
      if (status) {
        where.status = status;
      }

      // File format filter
      if (fileFormat) {
        where.fileFormat = fileFormat;
      }

      // Jurisdiction filter
      if (jurisdiction) {
        where.jurisdiction = { [Op.iLike]: `%${jurisdiction}%` };
      }

      // Tags filter (search for any matching tag)
      if (tags) {
        const tagArray = (Array.isArray(tags) ? tags : [tags])
          .map(tag => `${tag}`.toLowerCase().trim())
          .filter(Boolean);
        if (tagArray.length) {
          where.tags = { [Op.overlap]: tagArray };
        }
      }

      // Get pagination details
      const { offset, itemsPerPage } = getPagination(page, limit);

      // Fetch datasets with count
      const { count, rows } = await Dataset.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'uploadedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'lastModifiedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: itemsPerPage,
        offset
      });

      return {
        datasets: rows,
        totalDatasets: count,
        page: parseInt(page),
        limit: itemsPerPage
      };
    } catch (error) {
      throw new Error(`Error fetching datasets: ${error.message}`);
    }
  }

  /**
   * Get single dataset by ID
   */
  async getDatasetById(datasetId) {
    try {
      const dataset = await Dataset.findOne({
        where: { 
          id: datasetId,
          isDeleted: false 
        },
        include: [
          {
            model: User,
            as: 'uploadedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'lastModifiedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      return dataset;
    } catch (error) {
      throw new Error(`Error fetching dataset: ${error.message}`);
    }
  }

  /**
   * Create new dataset
   */
  async createDataset(fileBuffer, datasetData, userId) {
    const transaction = await sequelize.transaction();

    try {
      const {
        name, 
        description, 
        category, 
        fileFormat,
        version,
        tags,
        jurisdiction,
        dateRange,
        metadata,
        isPublic 
      } = datasetData;

      // Upload file to Supabase storage
      const uploadResult = await storageUtil.uploadFile(
        fileBuffer,
        datasetData.originalFileName || `${name}.${fileFormat}`,
        category,
        userId
      );

      // Count records in dataset
      const recordCount = await storageUtil.countRecords(fileBuffer, fileFormat);

      // Create dataset record
      const dataset = await Dataset.create({
        datasetType: this.mapDatasetType(category),
        name,
        description,
        category,
        fileFormat,
        fileSize: uploadResult.fileSize,
        filePath: uploadResult.filePath,
        bucketName: uploadResult.bucketName,
        recordCount,
        version,
        status: 'active',
        isPublic: isPublic !== undefined ? isPublic : true,
        isDeleted: false,
        tags: this.normalizeTags(tags),
        jurisdiction,
        dateRange,
        metadata: {
          ...metadata,
          originalFileName: datasetData.originalFileName,
          uploadedAt: uploadResult.uploadedAt
        },
        checksum: uploadResult.checksum,
        uploadedById: userId,
        lastModifiedById: userId
      }, { transaction });

      // Log activity
      await ActivityLog.create({
        userId,
        eventType: 'Dataset Created',
        severity: 'info',
        details: `New dataset created: ${name} (${category})`
      }, { transaction });

      await transaction.commit();

      // Return dataset with user info
      return await this.getDatasetById(dataset.id);
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      throw new Error(`Error creating dataset: ${error.message}`);
    }
  }

  /**
   * Update existing dataset
   */
  async updateDataset(datasetId, fileBuffer, updateData, userId) {
    const transaction = await sequelize.transaction();

    try {
      const dataset = await Dataset.findByPk(datasetId, { transaction });

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      if (dataset.isDeleted) {
        throw new Error('Cannot update deleted dataset');
      }

      const updates = {};

      // Update basic fields
      if (updateData.name !== undefined) updates.name = updateData.name;
      if (updateData.description !== undefined) updates.description = updateData.description;
      if (updateData.category !== undefined) updates.category = updateData.category;
      if (updateData.version !== undefined) updates.version = updateData.version;
      if (updateData.tags !== undefined) updates.tags = this.normalizeTags(updateData.tags);
      if (updateData.jurisdiction !== undefined) updates.jurisdiction = updateData.jurisdiction;
      if (updateData.dateRange !== undefined) updates.dateRange = updateData.dateRange;
      if (updateData.isPublic !== undefined) updates.isPublic = updateData.isPublic;
      if (updateData.status !== undefined) updates.status = updateData.status;

      // Merge metadata
      if (updateData.metadata) {
        updates.metadata = {
          ...dataset.metadata,
          ...updateData.metadata,
          lastUpdated: new Date()
        };
      }

      // Handle file replacement
      if (fileBuffer) {
        // Delete old file
        await storageUtil.deleteFile(dataset.filePath);

        // Upload new file
        const uploadResult = await storageUtil.uploadFile(
          fileBuffer,
          updateData.originalFileName || `${updates.name || dataset.name}.${updateData.fileFormat || dataset.fileFormat}`,
          updates.category || dataset.category,
          userId
        );

        // Count records in new file
        const recordCount = await storageUtil.countRecords(
          fileBuffer, 
          updateData.fileFormat || dataset.fileFormat
        );

        updates.filePath = uploadResult.filePath;
        updates.fileSize = uploadResult.fileSize;
        updates.checksum = uploadResult.checksum;
        updates.recordCount = recordCount;

        if (updateData.fileFormat) {
          updates.fileFormat = updateData.fileFormat;
        }

        updates.metadata = {
          ...(updates.metadata || dataset.metadata),
          replacedAt: uploadResult.uploadedAt,
          previousChecksum: dataset.checksum
        };
      }

      updates.lastModifiedById = userId;

      // Update dataset
      await dataset.update(updates, { transaction });

      // Log activity
      await ActivityLog.create({
        userId,
        eventType: 'Dataset Updated',
        severity: 'info',
        details: `Dataset updated: ${dataset.name} (ID: ${datasetId})`
      }, { transaction });

      await transaction.commit();

      return await this.getDatasetById(datasetId);
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error updating dataset: ${error.message}`);
    }
  }

  /**
   * Delete dataset (soft delete)
   */
  async deleteDataset(datasetId, userId) {
    const transaction = await sequelize.transaction();

    try {
      const dataset = await Dataset.findByPk(datasetId, { transaction });

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      if (dataset.isDeleted) {
        throw new Error('Dataset already deleted');
      }

      // Soft delete
      await dataset.update({
        isDeleted: true,
        status: 'archived',
        archivedAt: new Date(),
        lastModifiedById: userId
      }, { transaction });

      // Log activity
      await ActivityLog.create({
        userId,
        eventType: 'Dataset Deleted',
        severity: 'warning',
        details: `Dataset deleted: ${dataset.name} (ID: ${datasetId})`
      }, { transaction });

      await transaction.commit();

      return { message: 'Dataset deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error deleting dataset: ${error.message}`);
    }
  }

  /**
   * Permanently delete dataset and file
   */
  async permanentDeleteDataset(datasetId, userId) {
    const transaction = await sequelize.transaction();

    try {
      const dataset = await Dataset.findByPk(datasetId, { transaction });

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      // Delete file from storage
      await storageUtil.deleteFile(dataset.filePath);

      // Log activity before deletion
      await ActivityLog.create({
        userId,
        eventType: 'Dataset Permanently Deleted',
        severity: 'critical',
        details: `Dataset permanently deleted: ${dataset.name} (ID: ${datasetId})`
      }, { transaction });

      // Permanently delete from database
      await dataset.destroy({ transaction });

      await transaction.commit();

      return { message: 'Dataset permanently deleted' };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error permanently deleting dataset: ${error.message}`);
    }
  }

  /**
   * Archive dataset
   */
  async archiveDataset(datasetId, userId) {
    try {
      const dataset = await Dataset.findByPk(datasetId);

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      await dataset.update({
        status: 'archived',
        archivedAt: new Date(),
        lastModifiedById: userId
      });

      // Log activity
      await ActivityLog.create({
        userId,
        eventType: 'Dataset Archived',
        severity: 'info',
        details: `Dataset archived: ${dataset.name}`
      });

      return await this.getDatasetById(datasetId);
    } catch (error) {
      throw new Error(`Error archiving dataset: ${error.message}`);
    }
  }

  /**
   * Restore archived dataset
   */
  async restoreDataset(datasetId, userId) {
    try {
      const dataset = await Dataset.findByPk(datasetId);

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      await dataset.update({
        status: 'active',
        isDeleted: false,
        archivedAt: null,
        lastModifiedById: userId
      });

      // Log activity
      await ActivityLog.create({
        userId,
        eventType: 'Dataset Restored',
        severity: 'info',
        details: `Dataset restored: ${dataset.name}`
      });

      return await this.getDatasetById(datasetId);
    } catch (error) {
      throw new Error(`Error restoring dataset: ${error.message}`);
    }
  }

  /**
   * Download dataset file
   */
  async downloadDataset(datasetId, userId) {
    try {
      const dataset = await Dataset.findByPk(datasetId);

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      if (dataset.isDeleted) {
        throw new Error('Cannot download deleted dataset');
      }

      // Increment download count
      await dataset.incrementDownloadCount();

      // Generate signed URL (valid for 1 hour)
      const signedUrl = await storageUtil.generateSignedUrl(dataset.filePath, 3600);

      // Log activity
      await ActivityLog.create({
        userId,
        eventType: 'Dataset Downloaded',
        severity: 'info',
        details: `Dataset downloaded: ${dataset.name}`
      });

      return {
        signedUrl,
        fileName: dataset.name,
        fileFormat: dataset.fileFormat,
        fileSize: dataset.fileSize,
        expiresIn: 3600
      };
    } catch (error) {
      throw new Error(`Error downloading dataset: ${error.message}`);
    }
  }

  /**
   * Get dataset statistics
   */
  async getDatasetStats() {
    try {
      const totalDatasets = await Dataset.count({ where: { isDeleted: false } });
      const activeDatasets = await Dataset.count({ 
        where: { status: 'active', isDeleted: false } 
      });
      const archivedDatasets = await Dataset.count({ 
        where: { status: 'archived', isDeleted: false } 
      });
      const processingDatasets = await Dataset.count({ 
        where: { status: 'processing', isDeleted: false } 
      });

      // Get category breakdown
      const categoryStats = await Dataset.findAll({
        where: { isDeleted: false },
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      });

      // Get file format breakdown
      const formatStats = await Dataset.findAll({
        where: { isDeleted: false },
        attributes: [
          'fileFormat',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['fileFormat'],
        raw: true
      });

      // Get total storage used
      const storageResult = await Dataset.findOne({
        where: { isDeleted: false },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('fileSize')), 'totalSize']
        ],
        raw: true
      });

      const totalStorageBytes = parseInt(storageResult.totalSize) || 0;

      // Get total records across all datasets
      const recordsResult = await Dataset.findOne({
        where: { isDeleted: false, status: 'active' },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('recordCount')), 'totalRecords']
        ],
        raw: true
      });

      const totalRecords = parseInt(recordsResult.totalRecords) || 0;

      // Get most downloaded datasets
      const topDownloaded = await Dataset.findAll({
        where: { isDeleted: false },
        order: [['downloadCount', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'category', 'downloadCount']
      });

      // Get recent uploads
      const recentUploads = await Dataset.findAll({
        where: { isDeleted: false },
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'name', 'category', 'createdAt', 'uploadedById'],
        include: [{
          model: User,
          as: 'uploadedBy',
          attributes: ['firstName', 'lastName', 'email']
        }]
      });

      return {
        overview: {
          totalDatasets,
          activeDatasets,
          archivedDatasets,
          processingDatasets,
          totalRecords,
          totalStorage: totalStorageBytes,
          formattedStorage: storageUtil.formatBytes(totalStorageBytes)
        },
        categoryBreakdown: categoryStats.reduce((acc, stat) => {
          acc[stat.category] = parseInt(stat.count);
          return acc;
        }, {}),
        formatBreakdown: formatStats.reduce((acc, stat) => {
          acc[stat.fileFormat] = parseInt(stat.count);
          return acc;
        }, {}),
        topDownloaded: topDownloaded.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category,
          downloads: d.downloadCount
        })),
        recentUploads: recentUploads.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category,
          uploadedAt: d.createdAt,
          uploadedBy: d.uploadedBy ? {
            name: `${d.uploadedBy.firstName} ${d.uploadedBy.lastName}`,
            email: d.uploadedBy.email
          } : null
        }))
      };
    } catch (error) {
      throw new Error(`Error fetching dataset stats: ${error.message}`);
    }
  }

  /**
   * Get dataset analytics for charts
   */
  async getDatasetAnalytics(timeRange = '30days') {
    try {
      let dateFilter;
      const now = new Date();

      switch (timeRange) {
        case '7days':
          dateFilter = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30days':
          dateFilter = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90days':
          dateFilter = new Date(now.setDate(now.getDate() - 90));
          break;
        case '1year':
          dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          dateFilter = new Date(now.setDate(now.getDate() - 30));
      }

      // Upload trend over time
      const uploadTrend = await Dataset.findAll({
        where: {
          createdAt: { [Op.gte]: dateFilter },
          isDeleted: false
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
        raw: true
      });

      // Storage growth over time
      const storageGrowth = await Dataset.findAll({
        where: {
          createdAt: { [Op.gte]: dateFilter },
          isDeleted: false
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('SUM', sequelize.col('fileSize')), 'totalSize']
        ],
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
        raw: true
      });

      // Activity by category
      const categoryActivity = await Dataset.findAll({
        where: {
          createdAt: { [Op.gte]: dateFilter },
          isDeleted: false
        },
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'uploads'],
          [sequelize.fn('SUM', sequelize.col('downloadCount')), 'downloads']
        ],
        group: ['category'],
        raw: true
      });

      return {
        uploadTrend: uploadTrend.map(item => ({
          date: item.date,
          count: parseInt(item.count)
        })),
        storageGrowth: storageGrowth.map(item => ({
          date: item.date,
          size: parseInt(item.totalSize),
          formattedSize: storageUtil.formatBytes(parseInt(item.totalSize))
        })),
        categoryActivity: categoryActivity.map(item => ({
          category: item.category,
          uploads: parseInt(item.uploads),
          downloads: parseInt(item.downloads || 0)
        }))
      };
    } catch (error) {
      throw new Error(`Error fetching dataset analytics: ${error.message}`);
    }
  }

  /**
   * Verify dataset file integrity
   */
  async verifyDatasetIntegrity(datasetId) {
    try {
      const dataset = await Dataset.findByPk(datasetId);

      if (!dataset) {
        throw new Error('Dataset not found');
      }

      const isValid = await storageUtil.verifyFileIntegrity(
        dataset.filePath,
        dataset.checksum
      );

      return {
        datasetId,
        fileName: dataset.name,
        isValid,
        checksum: dataset.checksum,
        verifiedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Error verifying dataset integrity: ${error.message}`);
    }
  }

  /**
   * Get recent dataset activities
   */
  async getRecentActivities(limit = 20) {
    try {
      const activities = await ActivityLog.findAll({
        where: {
          eventType: {
            [Op.in]: [
              'Dataset Created',
              'Dataset Updated',
              'Dataset Deleted',
              'Dataset Archived',
              'Dataset Restored',
              'Dataset Downloaded'
            ]
          }
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit
      });

      return activities.map(activity => ({
        id: activity.id,
        eventType: activity.eventType,
        details: activity.details,
        severity: activity.severity,
        timestamp: activity.createdAt,
        user: activity.user ? {
          id: activity.user.id,
          name: `${activity.user.firstName} ${activity.user.lastName}`,
          email: activity.user.email
        } : null
      }));
    } catch (error) {
      throw new Error(`Error fetching recent activities: ${error.message}`);
    }
  }
}

module.exports = new DatasetService();