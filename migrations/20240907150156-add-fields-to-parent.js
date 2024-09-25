'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Parents', 'familyName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Parents', 'parentName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Parents', 'role', {
      type: Sequelize.ENUM('male', 'female'),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Parents', 'familyName');
    await queryInterface.removeColumn('Parents', 'parentName');
    await queryInterface.removeColumn('Parents', 'role');
  }
};
