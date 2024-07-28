import { Telegraf } from "telegraf";
import { MyContext } from "../types";
const jokeCommand = (bot : Telegraf<MyContext>) => {
  bot.command(["joke", "Joke"], async (ctx) => {
    ctx.scene.enter("JOKE_WIZARD");
  });
};

export {jokeCommand}