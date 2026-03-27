const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PrecedentSearch = sequelize.define('PrecedentSearch', {
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
    query: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resultCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'precedent_searches',
    timestamps: true
  });

  PrecedentSearch.associate = (models) => {
    PrecedentSearch.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    PrecedentSearch.hasMany(models.QueryPrecedent, {
      foreignKey: 'searchId',
      as: 'queryPrecedents'
    });

    PrecedentSearch.belongsToMany(models.Precedent, {
      through: models.QueryPrecedent,
      foreignKey: 'searchId',
      otherKey: 'precedentId',
      as: 'precedents'
    });

    PrecedentSearch.hasOne(models.PrecedentFeedback, {
      foreignKey: 'searchId',
      as: 'feedback'
    });
  };

  return PrecedentSearch;
};