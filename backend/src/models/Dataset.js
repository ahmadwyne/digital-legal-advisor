const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dataset = sequelize.define('Dataset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING, // STRING with validation
      allowNull: false,
      defaultValue: 'other',
      validate: {
        isIn: [[
          'case_law', 'statutes', 'regulations', 'legal_forms', 
          'precedents', 'financial_laws', 'contract_templates', 
          'compliance_guidelines', 'other'
        ]]
      }
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0',
      validate: {
        is: /^\d+\.\d+$/
      }
    },
    status: {
      type: DataTypes.STRING, // STRING with validation
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'processing', 'active', 'archived', 'failed']]
      }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Searchable tags for dataset categorization'
    },
    jurisdiction: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    checksum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileFormat: {
      type: DataTypes.ENUM('json', 'csv', 'txt', 'pdf', 'docx', 'xlsx'),
      allowNull: false,
      field: 'fileFormat'
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: { min: 0 },
      field: 'fileSize'
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Supabase storage path',
      field: 'filePath'
    },
    bucketName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'legal-datasets',
      field: 'bucketName'
    },
    recordCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'recordCount'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'isPublic'
    },
    dateRange: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'dateRange',
      validate: {
        isValidDateRange(value) {
          if (value && (!value.startDate || !value.endDate)) {
            throw new Error('dateRange must have both startDate and endDate');
          }
        }
      }
    },
    processingDetails: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'processingDetails'
    },
    uploadedById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      field: 'uploadedById'
    },
    lastModifiedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      field: 'lastModifiedById'
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'downloadCount'
    },
    queryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'queryCount'
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'isDeleted'
    },
    archivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'archivedAt'
    }
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
