module.exports = (bot) => {
  bot.command(["help", "Help"], async (ctx) => {
    const help_message = `Here are some of the commands you can use:

- /picture - Get a picture based on your query. 📷
- /weather - Get current weather conditions. ☀️
- /news - Get the latest news. 📰
- /country - Get detail Information about a country. 🌍
- /kanye - Get a random Kanye-West quote. 🎤
- /joke - Get a random joke. 😄
- /help - Show this help message. ℹ️

    This bot is designed to entertain and inform you. You can use this bot anytime and anywhere. Have Fun 🎉
    `;
    await ctx.reply(help_message);
  });
};
