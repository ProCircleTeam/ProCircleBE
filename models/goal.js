module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    goals: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending'
    },
    pairedWith: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'goals',
    timestamps: true
  });

  return Goal;
};