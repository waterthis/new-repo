// import * as path from "path";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import dotenv from "dotenv";
// dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { Telegraf, session, Context, Scenes } from "telegraf";
import { Stage } from "telegraf/scenes";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { development, production } from "../../src/core";

import {
countryCommand,defaultHandler,helpCommand,jokeCommand,kanyeCommand,newsCommand,startCommand,weatherCommand
} from "../../src/commands";

import {pictureCommand} from "../../src/inline/picture";


import {
  countryWizard,
  jokeWizard,
  newsWizard,
  weatherWizard,
} from "../../src/wizards";

import {MyContext } from "../../src/types";


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

// export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
//   await production(req, res, bot);
// };
if (ENVIRONMENT === "production"){
      exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
          await bot.handleUpdate(JSON.parse(event.body || '{}'));
          return { statusCode: 200, body: "" };
        } catch (e) {
          console.error("error in handler:", e);
          return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" };
        }
      };
}
else{

    development(bot);
}
