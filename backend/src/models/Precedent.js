const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Precedent = sequelize.define('Precedent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    citation: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    caseNo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    court: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: 'Supreme Court of Pakistan'
    },
    judge: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    keywords: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    fileUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    tableName: 'precedents',
    timestamps: true
  });

  Precedent.associate = (models) => {
    Precedent.hasMany(models.QueryPrecedent, {
      foreignKey: 'precedentId',
      as: 'queryLinks'
    });

    Precedent.belongsToMany(models.PrecedentSearch, {
      through: models.QueryPrecedent,
      foreignKey: 'precedentId',
      otherKey: 'searchId',
      as: 'searches'
    });
  };

  return Precedent;
};