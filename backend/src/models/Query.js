const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Query = sequelize.define('Query', {
    id: {
      type:  DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:  true
    },
    userId:  {
      type: DataTypes. UUID,
      allowNull: false,
      references:  {
        model: 'users',
        key: 'id'
      }
    },
    queryText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    queryType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'answered', 'closed'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'queries',
    timestamps: true
  });

  Query.associate = (models) => {
    Query.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Query.hasOne(models.Response, {
      foreignKey: 'queryId',
      as: 'response'
    });
    Query.hasMany(models.History, {
      foreignKey: 'queryId',
      as: 'historyEntries'
    });
  };

  return Query;
};