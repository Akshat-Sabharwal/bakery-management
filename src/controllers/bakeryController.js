const Menu = require("../models/Menu");
const StandardQueries = require("../utils/stdQueries");
const Response = require("../utils/responseUtils");
const ServerError = require("../utils/serverError");

// CONTROLLERS
exports.getMenu = async (req, res, next) => {
  let query = Menu.find();

  const featuredQuery = new StandardQueries(req.query, query)
    .paginate()
    .fields()
    .filter()
    .sort();

  const menu = await featuredQuery.mongoQuery;

  if (menu.length !== 0) {
    new Response(res)
      .status(200)
      .send("success", "Menu fetched!", menu);
  } else {
    next(
      new ServerError(500, "internal server error", "Menu not found!")
    );
  }
};
