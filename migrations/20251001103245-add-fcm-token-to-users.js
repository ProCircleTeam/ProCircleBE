'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'fcmToken', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	async down(queryInterface, _Sequelize) {
		await queryInterface.removeColumn('Users', 'fcmToken');
	},
};
