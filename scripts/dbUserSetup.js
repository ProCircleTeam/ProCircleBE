require("dotenv").config();
const { Sequelize } = require("sequelize");

async function createSuperuser() {
  const adminSequelize = new Sequelize({
    database: "postgres",
    username: "postgres",
    password: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  });

  try {
    const username = process.env.DB_USERNAME;

    await adminSequelize.query(
      `
        DO
          $$
          BEGIN
            IF NOT EXISTS (
              SELECT FROM pg_catalog.pg_roles WHERE rolname = '${username}'
            ) THEN
              CREATE ROLE ${username} WITH SUPERUSER CREATEDB CREATEROLE LOGIN;
            END IF;
          END
          $$;

      `
    );

    console.log(`✅ Superuser "${username}" created successfully`);
  } catch (error) {
    console.error("❌ Error creating superuser:", error.message);
    process.exit(1);
  } finally {
    await adminSequelize.close();
  }
}

createSuperuser();
