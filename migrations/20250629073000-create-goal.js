'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Goals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      goals: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      week_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      week_end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add index for efficient querying
    await queryInterface.addIndex('Goals', ['user_id', 'week_start']);
    await queryInterface.addIndex('Goals', ['user_id', 'status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Goals');
  }
};