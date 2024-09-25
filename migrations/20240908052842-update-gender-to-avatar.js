'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove 'gender' column
    await queryInterface.removeColumn('Parents', 'gender');
    
    // Add 'avatar' column
    await queryInterface.addColumn('Parents', 'avatar', {
      type: Sequelize.STRING, // Assuming avatar is a string (URL or file path)
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert by adding back 'gender' column
    await queryInterface.addColumn('Parents', 'gender', {
      type: Sequelize.ENUM('male', 'female'),
      allowNull: true,
    });
    
    // Revert by removing 'avatar' column
    await queryInterface.removeColumn('Parents', 'avatar');
  }
};
