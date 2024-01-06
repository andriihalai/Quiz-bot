"use strict";

import { Bot, Keyboard, InlineKeyboard } from "grammy";

import { BOT_API_KEY } from "./config.js";
import { handleErrors } from "./errorHandler.js";
import {
  getRandomTest,
  getSubjects,
  getTestTypesById,
  getTestTypes,
} from "./utils.js";

import { pool as db } from "./db.js";

const bot = new Bot(BOT_API_KEY);

const RETURN_TO_MENU = "Повернутися до головного меню";

const showMenu = async (ctx) => {
  try {
    const menuButtons = subjects.map((subject) => [subject]);
    const keyboard = Keyboard.from(menuButtons).resized();
    await ctx.reply("Оберіть предмет", {
      reply_markup: keyboard,
    });
  } catch (e) {
    console.error(e);
  }
};

const subjects = await getSubjects();
const testTypes = await getTestTypes();

bot.command("menu", showMenu);

bot.hears(RETURN_TO_MENU, showMenu);

bot.hears(subjects, async (ctx) => {
  try {
    const subject = ctx.message.text;
    const { id: subjectId } = (
      await db.query("SELECT id FROM subjects WHERE subject = $1", [subject])
    ).rows[0];
    const testTypes = await getTestTypesById(subjectId);
    const rows = [];

    for (const item of testTypes) {
      rows.push([item.test_type]);
    }

    rows.push([RETURN_TO_MENU]);

    const keyboard = Keyboard.from(rows).resized();

    await ctx.reply("Що саме ви хочете попрактикувати?", {
      reply_markup: keyboard,
    });
  } catch (e) {
    console.error(e);
  }
});

bot.hears(testTypes, async (ctx) => {
  try {
    const testType = ctx.message.text;
    const tests = (
      await db.query("SELECT * FROM tests WHERE test_type = $1", [testType])
    ).rows;
    const test = getRandomTest(tests);

    const inlineKeyboard = new InlineKeyboard().text(
      "Показати відповідь",
      "answer"
    );
    await ctx.reply(test.question, {
      reply_markup: inlineKeyboard,
    });
  } catch (e) {
    console.error(e);
  }
});

bot.on("callback_query:data", async (ctx) => {
  await ctx.reply(ctx.callbackQuery.data);
  await ctx.answerCallbackQuery();
});

bot.catch((err) => {
  handleErrors(err);
});

bot.start();
