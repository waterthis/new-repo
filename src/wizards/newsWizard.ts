const { WizardScene } = require("telegraf/scenes");
const axios = require("axios");
import { MyContext } from "../types";

const displayArticle = async (index:number, ctx:MyContext, first:boolean) => {
  const allNews = ctx.session.allNews;
  const the_date = allNews[index].publishedAt.split("T")[0];
  const the_time = allNews[index].publishedAt.split("T")[1].slice(0, -4);

  const articleMessage = `**Title** : ${allNews[index].title}
    
${
  allNews[index].description
    ? allNews[index].description
    : "*NEWS HAS NO DESCRIPTION*"
}
    
[Link To News](${allNews[index].url})
*Source* : ${allNews[index].source.name}
*Published At* : ${the_date + ", " + the_time}`;

  if (first) {
    await ctx.reply(articleMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `${index + 2} ⏩`,
              callback_data: "next",
            },
          ],
          [
            {
              text: `🏠 Home`,
              callback_data: "home",
            },
          ],
        ],
      },
    });
  } else {
    if (index === 0) {
      await ctx.editMessageText(articleMessage, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `${index + 2} ⏩`,
                callback_data: "next",
              },
            ],
            [
              {
                text: `🏠 Home`,
                callback_data: "home",
              },
            ],
          ],
        },
      });
    } else if (index === 9) {
      await ctx.editMessageText(articleMessage, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `⏪ ${index} `,
                callback_data: "prev",
              },
            ],
            [
              {
                text: `🏠 Home`,
                callback_data: "home",
              },
            ],
          ],
        },
      });
    } else {
      await ctx.editMessageText(articleMessage, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `⏪ ${index} `,
                callback_data: "prev",
              },
              {
                text: `${index + 2} ⏩`,
                callback_data: "next",
              },
            ],
            [
              {
                text: `🏠 Home`,
                callback_data: "home",
              },
            ],
          ],
        },
      });
    }
  }
};

const STEP_1 = async (ctx:MyContext) => {
  await ctx.reply("Please select a Category", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Entertainment 🎭", callback_data: "entertainment" }],
        [
          { text: "Technology 💻", callback_data: "technology" },
          { text: "Health 🏥", callback_data: "health" },
        ],
        [
          { text: "Business 💼", callback_data: "business" },
          { text: "Sports ⚽️", callback_data: "sports" },
        ],
        [
          { text: "General 🌍", callback_data: "general" },
          { text: "Science 🔬", callback_data: "science" },
        ],
        [
          {
            text: `🏠 Home`,
            callback_data: "home",
          },
        ],
      ],
    },
  });
  return ctx.wizard.next();
};
const STEP_2 = async (ctx:MyContext) => {
  if (ctx.updateType !== "callback_query") {
    await ctx.reply("Invalid entry. Select only from the provided buttons");
    return;
  }
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.log("Can't delete message.");
  }
  const categories = [
    "general",
    "science",
    "sports",
    "business",
    "health",
    "technology",
    "entertainment",
  ];
  if (("callback_query" in ctx.update) && ("data" in ctx.update.callback_query)) {
  const user_selection = ctx.update.callback_query.data;

  if (categories.includes(user_selection)) {
    const API_CALL = `${process.env.NEWS_PROVIDER}${user_selection}${process.env.NEWS_API_KEY}`;
    
    try {
      await ctx.reply("Loading news. . .");
    } catch (error) {
      console.log("Can't display message.");
    }
    try {
      const response = await axios(API_CALL);
      if (response.statusText === "OK") {
        ctx.session.allNews = response.data.articles;
        ctx.session.current_index = 0;
        await displayArticle(0, ctx, true);
      } else {
        await ctx.reply("Something went wrong, Try Again 🤗.");
      }
    } catch (error) {
      await ctx.reply("Something went wrong, Try Again 🤗.");
    
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
  } else {
    await ctx.reply("Invalid category selected,Try Again 🤗");
  }
} else{
  await ctx.reply("Something went wrong try again 🤗.");
  console.log("Message does not contain text");
  return ctx.scene.leave();
}

};

const newsWizard = new WizardScene("NEWS_WIZARD", STEP_1, STEP_2);

newsWizard.action(["prev", "next"], async (ctx:MyContext) => {
  if ("match" in ctx){
    let index = ctx.session.current_index;
    const user_selection = (ctx.match as string[])[0];
     if (user_selection === "prev") {
      index = Math.max(index - 1, 0);
    } else if (user_selection === "next") {
      index = Math.min(index + 1, 9);
    }
    ctx.session.current_index = index;
    await displayArticle(index, ctx, false);
  }
});

newsWizard.action(["home"], async (ctx:MyContext) => {
  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
  } catch (error) {
    console.log("Couldn't delete message.");
  }
  try {
    await ctx.reply("Hit /start to continue.", {
      reply_markup: { remove_keyboard: true },
    });
  } catch (error) {
    console.log("Couldn't delete message.");
  }
  return ctx.scene.leave();
});

export {newsWizard};