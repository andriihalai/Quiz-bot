"use strict";

const { Bot, Keyboard, InlineKeyboard } = require("grammy");

const { BOT_API_KEY } = require("./config.js");
const { handleErrors } = require("./errorHandler.js");

const bot = new Bot(BOT_API_KEY);

const topics = [
  "Українська мова",
  "Математика",
  "Історія України",
  "Англійська мова",
];

bot.command("start", async (ctx) => {
  const menuButtons = [];

  for (const topic of topics) {
    menuButtons.push([topic]);
  }

  const keyboard = Keyboard.from(menuButtons).resized();
  await ctx.reply("Обери предмет", {
    reply_markup: keyboard,
  });
});

bot.hears(topics[2], async (ctx) => {
  const rows = [];

  const map = new Map([
    ["Дати", "dates"],
    ["Терміни", "definitions"],
    ["Персоналії", "personalities"],
  ]);

  for (const entry of map) {
    const buttonRow = InlineKeyboard.text(entry[0], entry[1]);
    rows.push([buttonRow]);
  }

  const keyboard = InlineKeyboard.from(rows);

  await ctx.reply("Що саме ви хочете попрактикувати?", {
    reply_markup: keyboard,
  });
});

bot.hears("callback_query:data", async (ctx) => {});

bot.catch((err) => {
  handleErrors(err);
});

bot.start();
