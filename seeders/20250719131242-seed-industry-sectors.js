"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Industry_Sectors",
      [
        { name: "Healthcare" },
        { name: "Finance" },
        { name: "Education" },
        { name: "Technology" },
        { name: "Construction" },
        { name: "Agriculture" },
        { name: "Retail" },
        { name: "Transportation" },
        { name: "Energy" },
        { name: "Media & Entertainment" },
        { name: "Others" },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Industry_Sectors",
      {
        name: [
          "Healthcare",
          "Finance",
          "Education",
          "Technology",
          "Construction",
          "Agriculture",
          "Retail",
          "Transportation",
          "Energy",
          "Media & Entertainment",
          "Others",
        ],
      },
      {}
    );
  },
};
