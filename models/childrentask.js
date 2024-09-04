'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChildrenTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChildrenTask.init({
    taskId: DataTypes.INTEGER,
    childrenId: DataTypes.INTEGER,
    frequency: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChildrenTask',
  });
  return ChildrenTask;
};