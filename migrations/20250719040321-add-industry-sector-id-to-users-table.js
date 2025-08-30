'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'industry_sector_id', {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'Industry_Sectors',
				key: 'id',
			},
			onDelete: 'SET NULL',
			onUpdate: 'CASCADE',
		});
	},

	async down(queryInterface, _) {
		await queryInterface.removeColumn('Users', 'industry_sector_id');
	},
};
