'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'resetCode', {
			type: Sequelize.STRING,
		});
		await queryInterface.addColumn('Users', 'resetCodeExpiration', {
			type: Sequelize.DATE,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('Users', 'resetCode');
		await queryInterface.removeColumn('Users', 'resetCodeExpiration');
	},
};
