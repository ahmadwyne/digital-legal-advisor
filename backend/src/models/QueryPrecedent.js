const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QueryPrecedent = sequelize.define('QueryPrecedent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    searchId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'precedent_searches',
        key: 'id'
      }
    },
    precedentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'precedents',
        key: 'id'
      }
    },
    relevanceScore: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: true
    },
    retrievedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'query_precedents',
    timestamps: true
  });

  QueryPrecedent.associate = (models) => {
    QueryPrecedent.belongsTo(models.PrecedentSearch, {
      foreignKey: 'searchId',
      as: 'search'
    });

    QueryPrecedent.belongsTo(models.Precedent, {
      foreignKey: 'precedentId',
      as: 'precedent'
    });
  };

  return QueryPrecedent;
};