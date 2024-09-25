'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChildrenTask extends Model {
    static associate(models) {
      // Associations between ChildrenTask and Task
      ChildrenTask.belongsTo(models.Task, {
        foreignKey: 'taskId',
        as: 'task'
      });

      // Associations between ChildrenTask and Child
      ChildrenTask.belongsTo(models.Child, {
        foreignKey: 'childId',
        as: 'child'
      });
      
    }
  }

  ChildrenTask.init({
    childId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Children', // Table name of the child model
        key: 'id'
      }
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tasks', // Table name of the task model
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ChildrenTask',
  });

  return ChildrenTask;
};
