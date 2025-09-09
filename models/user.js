/* eslint-disable new-cap */
/* eslint-disable camelcase */
'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			User.hasMany(models.Goal, {foreignKey: 'user_id', as: 'goals'});
			User.hasMany(models.Goal, {
				foreignKey: 'paired_with',
				as: 'partnerGoals',
			});
			User.belongsTo(models.IndustrySector, {
				foreignKey: 'industry_sector_id',
				as: 'industry_sector',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			});
			User.belongsTo(models.Timezone, {
				foreignKey: 'timezone_id',
				as: 'timezone',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			});
			User.belongsToMany(models.AreaOfInterest, {
				through: models.UserAreaOfInterest,
				foreignKey: 'user_id',
				otherKey: 'area_of_Interest_id',
				as: 'areaOfInterests',
			});
		}
	}
	User.init(
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: DataTypes.STRING,
			type: {
				type: DataTypes.ENUM('admin', 'user'),
				allowNull: false,
				defaultValue: 'user',
			},
			phone_number: DataTypes.STRING,
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			first_name: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			last_name: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			profile_photo: {
				type: DataTypes.STRING(650),
				allowNull: true,
			},
			bio: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			job_title: {
				type: DataTypes.STRING(250),
				allowNull: true,
			},
			years_of_experience: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			long_term_goal: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			preferred_accountability_partner_trait: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			terms_and_conditions_agreement: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			availability_days: {
				type: DataTypes.ARRAY(DataTypes.TEXT),
				allowNull: true,
			},
			timezone_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'Timezone',
					key: 'id',
				},
			},
			fun_fact: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			career_summary: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			industry_sector_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'IndustrySector',
					key: 'id',
				},
			},
			resetCode: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			resetCodeExpiration: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'User',
		},
	);
	return User;
};
