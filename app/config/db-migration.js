require('dotenv').config();
module.exports = {
  username: process.env.WALLET_DB_USER,
  password: process.env.WALLET_DB_PASS,
  database: process.env.WALLET_DB_NAME,
  host: process.env.WALLET_DB_HOST,
  port: process.env.WALLET_DB_PORT,
  dialect: "postgres",
  operatorsAliases: 0,
  define: {
    underscored: true,
    underscoredAll: true
  }
}
