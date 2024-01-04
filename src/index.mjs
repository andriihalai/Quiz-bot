"use strict";

import { Bot, Keyboard, InlineKeyboard } from "grammy";

import { BOT_API_KEY } from "./config.js";
import { handleErrors } from "./errorHandler.js";

import { pool as db } from "./db.js";

const bot = new Bot(BOT_API_KEY);

const getTopics = async () => {
  try {
    const result = [];
    const req = await db.query("SELECT * FROM topics");
    for (const item of req.rows) {
      result.push(item.topic);
    }
    return result;
  } catch (e) {
    console.error(e);
  }
}

const topics = await getTopics();

bot.command("start", async (ctx) => {
  try {
    const menuButtons = topics.map(topic => [topic]);

    const keyboard = Keyboard.from(menuButtons).resized();
    await ctx.reply("Обери предмет", {
      reply_markup: keyboard,
    });
  } catch (e) {
    console.error(e);
  }
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
