"use strict";

const {
  Bot,
  Keyboard,
  InlineKeyboard,
  GrammyError,
  HttpError,
} = require("grammy");

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
  const menuButtons = [
    [topics[0], topics[1]],
    [topics[2], topics[3]],
  ];
  const keyboard = Keyboard.from(menuButtons).resized();
  await ctx.reply("Обери предмет", {
    reply_markup: keyboard,
  });
});

bot.hears(topics[2], async (ctx) => {
  const options = [
    ["Дати", "dates"],
    ["Терміни", "definitions"],
    ["Персоналії", "personalities"],
  ];

  const buttonRow = options.map(([label, data]) =>
    InlineKeyboard.text(label, data)
  );

  const keyboard = InlineKeyboard.from([buttonRow]);

  await ctx.reply("Що саме ви хочете попрактикувати?", {
    reply_markup: keyboard,
  });
});

bot.catch((err) => {
  handleErrors(err);
});

bot.start();
