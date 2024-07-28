import { Telegraf } from "telegraf";
import { MyContext } from "../types";
const newsCommand = (bot : Telegraf<MyContext>) => {
  bot.command(["NEWS", "News", "news"], async (ctx) => {
    ctx.scene.enter("NEWS_WIZARD");
  });
};

export {newsCommand};