"use strict";

require("dotenv").config();

const { Bot } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", (ctx) => {
  console.log(ctx);
});

bot.start();
