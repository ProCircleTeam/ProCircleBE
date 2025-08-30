/* eslint-disable camelcase */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users_Area_of_Interests', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			area_of_Interest_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Area_of_Interests',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('Users_Area_of_Interests');
	},
};
