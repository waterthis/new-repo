import { Telegraf } from "telegraf";
import { MyContext } from "../types";
const countryCommand = (bot : Telegraf<MyContext>) => {
  bot.command(["country", "Country"], (ctx) => {
    ctx.scene.enter("COUNTRY_WIZARD");
  });
};

export { countryCommand };