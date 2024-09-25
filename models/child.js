'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Child.init({
    userId: DataTypes.INTEGER,
    familyId: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,
    childrenDOB: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Child',
  });

  Child.associate = (models) => {
    // Add this many-to-many relationship between Child and Task through ChildrenTask
    Child.belongsToMany(models.Task, {
      through: 'ChildrenTask',
      foreignKey: 'childId',
      as: 'tasks'
    });
  
    // Any other associations related to Child
  };
  
  return Child;
};
