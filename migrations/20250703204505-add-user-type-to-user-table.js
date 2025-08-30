/* eslint-disable new-cap */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'type', {
			type: Sequelize.ENUM('admin', 'user'),
			defaultValue: 'user',
		});
	},

	async down(queryInterface, _) {
		await queryInterface.removeColumn('Users', 'type');
	},
};
