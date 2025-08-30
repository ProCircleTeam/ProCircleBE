'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.removeColumn('Users', 'time_zone');
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'time_zone', {
			type: Sequelize.STRING,
		});
	},
};
