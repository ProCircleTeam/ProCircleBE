'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Timezone extends Model {
		static associate(models) {
			// Define associations here, e.g., with Users
			Timezone.hasMany(models.User, {
				foreignKey: 'timezone_id',
				as: 'users',
			});
		}
	}

	Timezone.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			abbreviation: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			timestamps: false,
			modelName: 'Timezone',
		},
	);

	return Timezone;
};
