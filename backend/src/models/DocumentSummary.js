const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentSummary = sequelize.define('DocumentSummary', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    // Required by your spec
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    // App fields
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    summaryContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    docType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    docYear: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wordCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usedAI: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'document_summaries',
    timestamps: true,
    freezeTableName: true
  });

  DocumentSummary.associate = (models) => {
    DocumentSummary.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    DocumentSummary.hasMany(models.DocumentSummaryHistory, {
      foreignKey: 'documentSummaryId',
      as: 'historyEntries'
    });
  };

  return DocumentSummary;
};