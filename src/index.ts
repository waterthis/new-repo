import * as path from "path";
// import dotenv from "dotenv";
// dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { Telegraf, session, Context, Scenes } from "telegraf";
import { Stage } from "telegraf/scenes";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { development, production } from "./core";

import {
countryCommand,defaultHandler,helpCommand,jokeCommand,kanyeCommand,newsCommand,startCommand,weatherCommand
} from "./commands";

import {pictureCommand} from "./inline/picture"



import {
  countryWizard,
  jokeWizard,
  newsWizard,
  weatherWizard,
} from "./wizards";

import {MyContext } from "./types";


const BOT_TOKEN = process.env.BOT_TOKEN || "";
const ENVIRONMENT = process.env.NODE_ENV || "";

const bot = new Telegraf<MyContext>(BOT_TOKEN);
const stage = new Scenes.Stage<MyContext>([countryWizard, jokeWizard,newsWizard,weatherWizard]);


bot.use(
  session({
    defaultSession: () => ({ allNews:null, current_index: 0,user_location:null ,user_selection:null}),
  })
);
bot.use(stage.middleware());

countryCommand(bot);
startCommand(bot);
helpCommand(bot);
kanyeCommand(bot);
jokeCommand(bot);
newsCommand(bot);
weatherCommand(bot);
pictureCommand(bot);


defaultHandler(bot);

export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

ENVIRONMENT !== "production" && development(bot);
