'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'googleAccessToken', {
			type: Sequelize.TEXT,
			allowNull: true,
		});

		await queryInterface.addColumn('Users', 'googleRefreshToken', {
			type: Sequelize.TEXT,
			allowNull: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('Users', 'googleAccessToken');
		await queryInterface.removeColumn('Users', 'googleRefreshToken');
	},
};
