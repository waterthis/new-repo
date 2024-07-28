import { Telegraf } from "telegraf";
import { MyContext } from "../types";
const defaultHandler = (bot : Telegraf<MyContext>) => {
  bot.on(["message"], async (ctx) => {
    const message = `*Feature Doesn't Exist 🤗.*`;
    await ctx.reply(message, { parse_mode: "Markdown" });
  });
};

export { defaultHandler };