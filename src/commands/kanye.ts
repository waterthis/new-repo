import axios from "axios";
import { Telegraf } from "telegraf";
import { MyContext } from "../types";
const KANYE_API = process.env.KANYE_PROVIDER;

if (!KANYE_API) {
  throw new Error("KANYE_PROVIDER is not defined");
}
const kanyeCommand = (bot : Telegraf<MyContext>) => {
  bot.command(["kanye", "Kanye"], async (ctx) => {
    try {
      await ctx.sendChatAction("typing");
      await ctx.reply("Here is a random Kanye West Quote");
      const response = await axios.get(KANYE_API as string);
      await ctx.reply(response.data.quote);
    } catch (error) {
      await ctx.reply("Something went wrong, Try Again. 🤗");
      console.log("Something went wrong when handling a kanye request.");
    }
  });
};

export {kanyeCommand}
