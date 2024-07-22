module.exports = (bot) => {
  bot.command(["Start", "start"], async (ctx) => {
    const user = ctx.from.username || ctx.from.first_name || "user";
    const message = `
Hello @${user}, welcome! How can I assist you?

Use /help for more information`;
    await ctx.reply(message);
  });
};
