'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Notification extends Model {
		static associate(models) {
			Notification.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
			});
		}
	}
	Notification.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			title: DataTypes.STRING,
			body: DataTypes.TEXT,
			isRead: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: 'Notification',
		},
	);
	return Notification;
};
