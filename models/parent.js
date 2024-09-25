'use strict';
module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    familyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    familyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {  // Column for storing the avatar image
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {  // Column for gender information
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {});

  Parent.associate = function(models) {
    Parent.belongsTo(models.User, { foreignKey: 'userId' });
    Parent.belongsTo(models.Family, { foreignKey: 'familyId' });
    Parent.belongsToMany(models.Task, { through: 'ParentTasks', foreignKey: 'parentId', as: 'tasks'});
  };

  return Parent;
};
