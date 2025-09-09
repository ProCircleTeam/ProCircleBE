/* eslint-disable new-cap */
'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class IndustrySector extends Model {
		static associate(models) {
			// Define associations here, e.g., with Users
			IndustrySector.hasMany(models.User, {
				foreignKey: 'industry_sector_id',
				as: 'users',
			});
		}
	}

	IndustrySector.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(200),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'Industry_Sectors',
			timestamps: false,
		},
	);

	return IndustrySector;
};
