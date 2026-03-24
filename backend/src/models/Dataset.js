const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dataset = sequelize.define('Dataset', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },

    datasetType: {
      type: DataTypes.ENUM('case_law', 'statute', 'precedent', 'regulation'),
      allowNull: false
    },

    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    version: DataTypes.STRING,
    status: DataTypes.STRING,
    tags: DataTypes.STRING,
    jurisdiction: DataTypes.STRING,
    metadata: DataTypes.JSONB,
    checksum: DataTypes.STRING,
    fileFormat: DataTypes.STRING,
    fileSize: DataTypes.BIGINT,
    filePath: DataTypes.STRING,
    bucketName: DataTypes.STRING,
    recordCount: DataTypes.BIGINT,
    isPublic: DataTypes.BOOLEAN,
    dateRange: DataTypes.JSONB,
    processingDetails: DataTypes.JSONB,
    uploadedById: DataTypes.UUID,
    lastModifiedById: DataTypes.UUID,
    downloadCount: DataTypes.INTEGER,
    queryCount: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN

  }, {
    tableName: 'datasets',
    timestamps: true
  });

  return Dataset;
};