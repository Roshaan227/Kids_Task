'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Childgifts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Childgifts.init({
    childId: DataTypes.INTEGER,
    giftId: DataTypes.INTEGER,
    claim: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Childgifts',
  });
  return Childgifts;
};