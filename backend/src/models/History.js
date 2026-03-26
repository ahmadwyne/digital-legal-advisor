const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const History = sequelize.define('History', {
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
    queryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'queries',
        key: 'id'
      }
    },
    entryTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'history',
    timestamps: false
  });

  History.associate = (models) => {
    History.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    History.belongsTo(models.Query, { foreignKey: 'queryId', as: 'query' });
  };

  return History;
};