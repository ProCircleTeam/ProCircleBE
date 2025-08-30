/* eslint-disable new-cap */
'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class AreaOfInterest extends Model {
		static associate(models) {
			AreaOfInterest.belongsToMany(models.User, {
				through: models.UserAreaOfInterest,
				foreignKey: 'area_of_Interest_id',
				otherKey: 'user_id',
				as: 'users',
			});
		}
	}

	AreaOfInterest.init(
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
			tableName: 'Area_of_Interests',
			timestamps: false,
		},
	);

	return AreaOfInterest;
};
