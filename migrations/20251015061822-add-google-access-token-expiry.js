'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'googleAccessTokenExpiry', {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: null,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('Users', 'googleAccessTokenExpiry');
	},
};
