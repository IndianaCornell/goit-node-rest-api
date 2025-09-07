import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialectOptions: {
    ssl: true,
  },
});

try {
  await sequelize.authenticate();
  console.log("Database connection successful");
} catch (error) {
  console.error("Database connection error:", error.message);
  process.exit(1);
}

export default sequelize;

  //   dialect: "postgres",
  //   database: "my_contacts_list",
  //   username: "my_contacts_list_user",
  //   password: "jFwCKX8iozmsmvRqbl9S1YBKwioUHPJw",
  //   host: "dpg-d2tgkc95pdvs739i9rfg-a.oregon-postgres.render.com/my_contacts_list",
  //   port: "5432",