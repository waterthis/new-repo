import { Telegraf } from "telegraf";
import { MyContext } from "../types";
const weatherCommand = (bot : Telegraf<MyContext>) => {
  bot.command(["weather", "Weather"], async (ctx) => {
    ctx.scene.enter("WEATHER_WIZARD");
  });
};

export {weatherCommand};
