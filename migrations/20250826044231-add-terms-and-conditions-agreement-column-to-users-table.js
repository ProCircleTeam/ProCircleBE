'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'terms_and_conditions_agreement', {
      type: Sequelize.BOOLEAN,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'terms_and_conditions_agreement');
  }
};
