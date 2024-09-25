'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Parents', 'parentName'); // Remove parent_name column
    await queryInterface.addColumn('Parents', 'parentImage', {
      type: Sequelize.STRING,
      allowNull: true, // Add parent_image column
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Parents', 'parentName', {
      type: Sequelize.STRING,
      allowNull: true, // Revert by adding back parent_name column
    });
    await queryInterface.removeColumn('Parents', 'parentImage'); // Revert by removing parent_image column
  }
};
