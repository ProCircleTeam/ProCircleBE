"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Industry_Sector extends Model {
    static associate(models) {
      // Define associations here, e.g., with Users
      Industry_Sector.hasMany(models.User, {
        foreignKey: "industry_sector_id",
        as: "users",
      });
    }
  }

  Industry_Sector.init(
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
      tableName: "Industry_Sectors"
    }
  );

  return Industry_Sector;
};
