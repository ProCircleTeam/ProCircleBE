/* eslint-disable new-cap */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Industry_Sectors', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING(200),
				allowNull: false,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('Industry_Sectors');
	},
};
