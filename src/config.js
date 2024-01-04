"use strict";

require("dotenv").config();

module.exports = {
  BOT_API_KEY: process.env.BOT_API_KEY,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
};

// console.log(
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   process.env.DB_HOST,
//   process.env.DB_PORT
// );
