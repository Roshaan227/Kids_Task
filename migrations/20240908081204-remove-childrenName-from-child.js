'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Children', 'childrenName');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Children', 'childrenName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
