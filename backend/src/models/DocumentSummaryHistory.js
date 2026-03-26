const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentSummaryHistory = sequelize.define('DocumentSummaryHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    documentSummaryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'document_summaries', key: 'id' }
    },
    entryTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'document_summary_history',
    timestamps: false,
    freezeTableName: true
  });

  DocumentSummaryHistory.associate = (models) => {
    DocumentSummaryHistory.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    DocumentSummaryHistory.belongsTo(models.DocumentSummary, {
      foreignKey: 'documentSummaryId',
      as: 'documentSummary'
    });
  };

  return DocumentSummaryHistory;
};