const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;

module.exports = async (req, res, bot) => {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body, res);
  } else {
    res.status(200).json("Listening to bot events...");
  }
};
