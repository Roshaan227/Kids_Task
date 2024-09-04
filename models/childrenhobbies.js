'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChildrenHobbies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChildrenHobbies.init({
    childId: DataTypes.INTEGER,
    hobbyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChildrenHobbies',
  });
  return ChildrenHobbies;
};