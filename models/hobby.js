'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hobby = sequelize.define('Hobby', {
    hobbyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hobbyImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Ensure this matches the name of the Users table
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    timestamps: true
  });

  Hobby.associate = function(models) {
    Hobby.belongsTo(models.User, { foreignKey: 'userId' });
    Hobby.belongsToMany(models.Task, {
      through: 'TaskHobbies', foreignKey: 'hobbyId', as: 'tasks'});
  };

  return Hobby;
};
