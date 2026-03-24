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
    timestamps: true,
    freezeTableName: true,
    underscored: false, // matches your camelCase columns
    indexes: [
      { fields: ['category'] },
      { fields: ['status'] },
      { fields: ['uploadedById'] },
      { fields: ['isDeleted'] },
      { fields: ['tags'], using: 'gin' }
    ],
    hooks: {
      beforeCreate: (dataset) => {
        if (dataset.tags) dataset.tags = dataset.tags.map(t => t.toLowerCase().trim());
      },
      beforeUpdate: (dataset) => {
        if (dataset.changed('tags') && dataset.tags) dataset.tags = dataset.tags.map(t => t.toLowerCase().trim());
      }
    }
  });

  // Instance methods
  Dataset.prototype.incrementDownloadCount = async function () {
    this.downloadCount++;
    await this.save();
  };

  Dataset.prototype.incrementQueryCount = async function () {
    this.queryCount++;
    await this.save();
  };

  Dataset.prototype.archive = async function () {
    this.status = 'archived';
    this.archivedAt = new Date();
    await this.save();
  };

  Dataset.prototype.softDelete = async function () {
    this.isDeleted = true;
    await this.save();
  };

  return Dataset;
};
