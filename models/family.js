module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define('Family', {
    familyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Members: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  }, {});

  Family.associate = function(models) {
    Family.hasMany(models.User, { foreignKey: 'familyId' });
    Family.hasMany(models.Parent, { foreignKey: 'familyId' });
    Family.hasMany(models.Child, { foreignKey: 'familyId' });
  };

  return Family;
};
