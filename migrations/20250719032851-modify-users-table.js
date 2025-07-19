"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // -- Profile Info
      await queryInterface.sequelize.query(
        `
          ALTER TABLE "Users"
          ADD COLUMN "first_name" VARCHAR(50),
          ADD COLUMN "last_name" VARCHAR(50),
          ADD COLUMN "profile_photo" VARCHAR(650),
          ADD COLUMN "bio" TEXT,
          ADD COLUMN "job_title" VARCHAR(250),
          ADD COLUMN "years_of_experience" INTEGER,
          ADD COLUMN "career_summary" TEXT,
          ADD COLUMN "long_term_goal" TEXT,
          ADD COLUMN "preferred_accountability_partner_trait" TEXT,
          ADD COLUMN "availability_days" TEXT[],
          ADD COLUMN "time_zone" VARCHAR(30),
          ADD COLUMN "fun_fact" TEXT;
        `,
        { transaction }
      );

      // -- Constraints
      await queryInterface.sequelize.query(
        `
          ALTER TABLE "Users" ADD CONSTRAINT "unique_email_constraint"
          UNIQUE ("email");
          `,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `
          ALTER TABLE "Users" ADD CONSTRAINT "unique_username_constraint"
          UNIQUE ("username");
  
          `,
        { transaction }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Rollback constraints
      await Promise.all([
        queryInterface.removeConstraint("Users", "unique_email_constraint", {
          transaction,
        }),
        queryInterface.removeConstraint("Users", "unique_username_constraint", {
          transaction,
        }),
      ]);

      // Rollback engagement
      await Promise.all([
        queryInterface.removeColumn("Users", "fun_fact", { transaction }),
        queryInterface.removeColumn("Users", "time_zone", { transaction }),
        queryInterface.removeColumn("Users", "availability_days", {
          transaction,
        }),
      ]);

      // Rollback goals & professionals
      await Promise.all([
        queryInterface.removeColumn(
          "Users",
          "preferred_accountability_partner_trait",
          { transaction }
        ),
        queryInterface.removeColumn("Users", "long_term_goal", {
          transaction,
        }),
        queryInterface.removeColumn("Users", "career_summary", {
          transaction,
        }),
        queryInterface.removeColumn("Users", "years_of_experience", {
          transaction,
        }),
        queryInterface.removeColumn("Users", "job_title", { transaction }),
      ]);

      // Rollback profile info
      await Promise.all([
        queryInterface.removeColumn("Users", "bio", { transaction }),
        queryInterface.removeColumn("Users", "profile_photo", {
          transaction,
        }),
        queryInterface.removeColumn("Users", "last_name", { transaction }),
        queryInterface.removeColumn("Users", "first_name", { transaction }),
      ]);
    });
  },
};
