"use strict";

require("dotenv").config();

const { Bot, Keyboard, GrammyError, HttpError } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const menuButtons = [
    ["Українська мова", "Математика"],
    ["Історія України", "Англійська мова"],
  ];
  const keyboard = Keyboard.from(menuButtons).resized();
  await ctx.reply("Обери предмет", {
    reply_markup: keyboard,
  });
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();