/* eslint-disable camelcase */
'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class UserAreaOfInterest extends Model {
		static associate() {
			// Optional: define if you want direct access
		}
	}

	UserAreaOfInterest.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
		area_of_Interest_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Area_of_Interests',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		},
	}, {
		sequelize,
		tableName: 'Users_Area_of_Interests',
		timestamps: false,
	});

	return UserAreaOfInterest;
};
