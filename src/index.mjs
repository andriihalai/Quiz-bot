"use strict";

import { Bot, Keyboard, InlineKeyboard } from "grammy";

import { BOT_API_KEY } from "./config.js";
import { handleErrors } from "./errorHandler.js";

import { pool as db } from "./db.js";

const bot = new Bot(BOT_API_KEY);

const getSubjects = async () => {
  try {
    const result = [];
    const req = await db.query("SELECT * FROM subjects");
    for (const item of req.rows) {
      result.push(item.subject);
    }
    return result;
  } catch (e) {
    console.error(e);
  }
}

const subjects = await getSubjects();

bot.command("start", async (ctx) => {
  try {
    const menuButtons = subjects.map(subject => [subject]);

    const keyboard = Keyboard.from(menuButtons).resized();
    await ctx.reply("Обери предмет", {
      reply_markup: keyboard,
    });
  } catch (e) {
    console.error(e);
  }
});

bot.hears(subjects, async (ctx) => {
  try {
    const subject = ctx.message.text;
    const { id: subjectId } = (await db.query("SELECT id FROM subjects WHERE subject = $1", [subject])).rows[0];
    const testTypes = (await db.query("SELECT test_type, description FROM test_types WHERE subject_id = $1", [subjectId])).rows;
    const rows = [];
  
    for (const item of testTypes) {
      const buttonRow = InlineKeyboard.text(item.test_type, item.description);
      rows.push([buttonRow]);
    }
  
    const keyboard = InlineKeyboard.from(rows);
  
    await ctx.reply("Що саме ви хочете попрактикувати?", {
      reply_markup: keyboard,
    });
  } catch (e) {
    console.error(e);
  }
});

bot.hears("callback_query:data", async (ctx) => {});

bot.catch((err) => {
  handleErrors(err);
});

bot.start();
