const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    responseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'responses', key: 'id' },
    },
    rating: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'feedback',
    timestamps: true,
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User,     { foreignKey: 'userId',     as: 'user'     });
    Feedback.belongsTo(models.Response, { foreignKey: 'responseId', as: 'response' });
  };

  return Feedback;
};