// import path from "path";
// import dotenv from "dotenv"
import { Telegraf} from "telegraf";
import { MyContext} from "../types";
import {Photo} from "pexels/dist/types"
// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import axios from "axios";
import {createClient} from "pexels"
import { InlineQueryResult} from "telegraf/types";

const PICTURE_API = process.env.PEXELS_API_TOKEN;

if (!PICTURE_API) {
  throw new Error("PEXELS_API_TOKEN is not defined");
}

const client = createClient(PICTURE_API as string);

const pictureCommand = (bot : Telegraf<MyContext>) => {
  bot.command(["picture", "Picture"], async (ctx) => {
    let message = `PLEASE SELECT <b>DOMAIN</b>

And enter your Search on <b>Inline Mode</b> after domain name`;
    await ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Search Pixabay Images",
              switch_inline_query_current_chat: "pixabay ",
            },
          ],
          [
            {
              text: "Search Pexels Images",
              switch_inline_query_current_chat: "pexels ",
            },
          ],
        ],
      },
      parse_mode: "HTML",
    });
  });

  bot.inlineQuery(/pixabay\s.+/, async (ctx) => {
    let input = ctx.inlineQuery.query.split(" ");
    input.shift();
    let query = input.join(" ");
    let response = await axios(process.env.PIXABAY_API + query);

    let pictures: InlineQueryResult[] = [];
    
    for (let i = 0; i < response.data.hits.length; i++) {
      let each_picture = response.data.hits[i];
      pictures.push({
        type: "photo",
        id: each_picture.id,
        photo_url: each_picture.webformatURL,
        thumbnail_url: each_picture.previewURL,
        photo_width: each_picture.imageWidth,
        photo_height: each_picture.imageHeight,
        caption: `[Source](${each_picture.webformatURL})  [Larger File](${each_picture.largeImageURL})`,
        parse_mode: "Markdown",
      });
    }

    await ctx.answerInlineQuery(pictures);
  });

  bot.inlineQuery(/pexels\s.+/, async (ctx) => {
    // console.log(ctx.inlineQuery.query);
    let input = ctx.inlineQuery.query.split(" ");
    input.shift();
    let query = input.join(" ");

    try {
      let response = await client.photos.search({
        query,
        page: 1,
        per_page: 50,
      });

      if ('error' in response) {
        console.error(response.error);
        return [];
      }

      let pictures: InlineQueryResult[] = [];

      for (let i = 0; i < response.photos.length; i++) {
        let each_picture:Photo = response.photos[i];
        pictures.push({
          type: "photo",
          id: String(each_picture.id),
          thumbnail_url: each_picture.src.tiny,
          photo_url: each_picture.src.original,
          photo_width: each_picture.width,
          photo_height: each_picture.height,
          caption: `
      [${each_picture.alt}](${each_picture.url})
      
      [Large File](${each_picture.src.large})`,
          parse_mode: "Markdown",
        });
      }

      await ctx.answerInlineQuery(pictures);
    } catch (err) {
      console.log("Something Went Wrong");
      console.log(err);
    }
  });
};

export {pictureCommand};