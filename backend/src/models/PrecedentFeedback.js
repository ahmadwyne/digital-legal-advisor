const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PrecedentFeedback = sequelize.define('PrecedentFeedback', {
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
    searchId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'precedent_searches',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.ENUM('helpful', 'not_helpful'),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'precedent_feedbacks',
    timestamps: true
  });

  PrecedentFeedback.associate = (models) => {
    PrecedentFeedback.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    PrecedentFeedback.belongsTo(models.PrecedentSearch, {
      foreignKey: 'searchId',
      as: 'search'
    });
  };

  return PrecedentFeedback;
};