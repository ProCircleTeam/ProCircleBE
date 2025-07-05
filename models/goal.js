"use strict";
const { Model } = require("sequelize");
const GOAL_STATUS = require("../constants/goalStatus");

module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
 
    static associate(models) {
      // define association here
      Goal.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Goal.belongsTo(models.User, {
        foreignKey: 'paired_with',
        as: 'partner'
      });

    }

    // Helper method to get week boundaries
    static getWeekBoundaries(date = new Date()) {
      const currentDate = new Date(date);
      const dayOfWeek = currentDate.getDay();
      const diff = currentDate.getDate() - dayOfWeek;
      
      const weekStart = new Date(currentDate.setDate(diff));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      return { weekStart, weekEnd };
    }
  }

  Goal.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      goals: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Goals array cannot be empty'
          },
          isValidArray(value) {
            if (!Array.isArray(value)) {
              throw new Error('Goals must be an array');
            }
            if (value.length === 0) {
              throw new Error('Goals array cannot be empty');
            }
            if (value.some(goal => typeof goal !== 'string' || goal.trim() === '')) {
              throw new Error('All goals must be non-empty strings');
            }
          }
        }
      },
      paired_with: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM(Object.values(GOAL_STATUS)),
        allowNull: false,
        defaultValue: GOAL_STATUS.PENDING
      },
      week_start: {
        type: DataTypes.DATE,
        allowNull: false
      },
      week_end: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Goal",
    }
  );

  return Goal;
};