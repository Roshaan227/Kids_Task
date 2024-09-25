'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,  // Ensure this is INTEGER
      primaryKey: true,
      autoIncrement: true
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Families',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    paranoid: true,
    timestamps: true
  });

  User.associate = function(models) {
    User.belongsTo(models.Family, { foreignKey: 'familyId' });
    User.hasMany(models.Hobby, { foreignKey: 'userId', as: 'hobbies' });
    User.hasMany(models.Task, {foreignKey: 'userId', as: 'tasks'});
  };

  return User;
};
