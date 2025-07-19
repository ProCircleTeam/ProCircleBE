"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "timezone_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Timezones",
        key: "id"
      },
      onDelete: 'SET NULL',
      onUpdate: "CASCADE"
    });
  },

  async down(queryInterface, _) {
    await queryInterface.removeColumn("Users", "timezone_id")
  },
};
