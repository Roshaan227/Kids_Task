'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   

    await queryInterface.addColumn('ChildrenTasks', 'childId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Children', // Table name of children
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ChildrenTasks', 'taskId');
    await queryInterface.removeColumn('ChildrenTasks', 'childId');
  }
};
