'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Parents', 'role', 'gender');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Parents', 'gender', 'role');
  }
};
