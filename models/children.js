'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Children extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Children.init({
    childName: DataTypes.STRING,
    childImage: DataTypes.STRING,
    childDob: DataTypes.DATE,
    childGender: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Children',
  });
  return Children;
};