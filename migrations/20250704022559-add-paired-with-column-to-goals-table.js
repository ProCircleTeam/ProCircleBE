"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Goals", "paired_with", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: 'SET NULL',
      onUpdate: "CASCADE"
    });
  },

  async down(queryInterface, _) {
    await queryInterface.removeColumn("Users", "paired_with")
  },
};
