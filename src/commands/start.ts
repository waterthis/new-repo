import { Telegraf } from "telegraf";
import { MyContext } from "../types";
const startCommand = (bot : Telegraf<MyContext>) => {
  bot.command(["Start", "start"], async (ctx) => {
    const user = ctx.from.username || ctx.from.first_name || "user";
    const message = `Hello @${user}, Welcome!

Use /help for more info 🤖`;
    await ctx.reply(message);
  });
};

export {startCommand}