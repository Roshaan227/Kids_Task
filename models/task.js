// models/task.js[]
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // table name for the foreign key
        key: 'id'
      }
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskImage: {
      type: DataTypes.STRING,
    },
    taskScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});

  // Associations
  Task.associate = (models) => {
    // A task belongs to a user
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Task association with Parents and Hobbies (add the logic as per your structure)
    Task.belongsToMany(models.Parent, {
      through: 'ParentTasks',  // Junction table for many-to-many relationship
      foreignKey: 'taskId',
      as: 'parents'
    });

    Task.belongsToMany(models.Hobby, {
      through: 'TaskHobbies',  // Junction table for many-to-many relationship
      foreignKey: 'taskId',
      as: 'hobbies'
    });
    Task.belongsToMany(models.Child, {
      through: 'ChildrenTask',
      foreignKey: 'taskId',
      as: 'children'
    });
    Task.hasMany(models.ChildrenTask, {
      foreignKey: 'taskId',
      as: 'childrenTasks' // Alias
    });
  
  };

  return Task;
};
