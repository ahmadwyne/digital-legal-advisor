const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Response = sequelize.define('Response', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    queryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'queries',
        key: 'id'
      }
    },
    responseText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    citations: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    numSources: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'responses',
    timestamps: true
  });

  Response.associate = (models) => {
    Response.belongsTo(models.Query, {
      foreignKey: 'queryId',
      as: 'query'
    });
  };

  return Response;
};