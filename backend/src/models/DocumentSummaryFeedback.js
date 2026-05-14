const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentSummaryFeedback = sequelize.define('DocumentSummaryFeedback', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    documentSummaryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'document_summaries',
        key: 'id'
      }
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    summarySnippet: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'document_summary_feedbacks',
    timestamps: true
  });

  DocumentSummaryFeedback.associate = (models) => {
    DocumentSummaryFeedback.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    DocumentSummaryFeedback.belongsTo(models.DocumentSummary, {
      foreignKey: 'documentSummaryId',
      as: 'documentSummary'
    });
  };

  return DocumentSummaryFeedback;
};
