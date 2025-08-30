'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		const query1 = queryInterface.changeColumn(
			{
				tableName: 'Goals',
			},
			'week_start',
			{
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
		);
		const query2 = queryInterface.changeColumn(
			{
				tableName: 'Goals',
			},
			'week_end',
			{
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
		);
		await Promise.all([query1, query2]);
	},

	async down(queryInterface, Sequelize) {
		const query1 = queryInterface.changeColumn(
			{
				tableName: 'Goals',
			},
			'week_start',
			{
				type: Sequelize.DATE,
				allowNull: false,
			},
		);
		const query2 = queryInterface.changeColumn(
			{
				tableName: 'Goals',
			},
			'week_end',
			{
				type: Sequelize.DATE,
				allowNull: false,
			},
		);
		await Promise.all([query1, query2]);
	},
};
