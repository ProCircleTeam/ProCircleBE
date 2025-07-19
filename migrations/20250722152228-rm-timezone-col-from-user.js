"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "time_zone");
  },

  async down(queryInterface, _) {
    await queryInterface.addColumn("Users", "time_zone", {
      type: Sequelize.STRING,
    });
  },
};
