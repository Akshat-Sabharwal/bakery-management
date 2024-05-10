const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Response = require("../utils/responseUtils");
const ServerError = require("../utils/serverError");
const { errorHandler } = require("../utils/errorHandlers");

// CONTROLLERS
exports.getAllOrders = errorHandler(async (req, res, next) => {
  const result = await Order.find();

  if (result) {
    new Response(res)
      .status(200)
      .send("success", "Orders fetched!", result);
  } else {
    next(
      new ServerError(500, "fail", "Orders could not be fetched!")
    );
  }
});

exports.getFoodOrder = errorHandler(async (req, res, next) => {
  const result = await Order.findById(req.params.id);

  if (!result) {
    return next(
      new ServerError(404, "fail", "Order could not be found!")
    );
  }

  new Response(res)
    .status(200)
    .send("success", "Order found!", result);
});

exports.createFoodOrder = errorHandler(async (req, res, next) => {
  const orderCount = await Order.countDocuments();

  const result = await Order.create(
    Object.assign({ orderNumber: orderCount + 1 }, req.body)
  );

  if (result) {
    new Response(res)
      .status(200)
      .send("success", "Order created!", result);
  } else {
    next(new ServerError(500, "fail", "Order could not be created!"));
  }
});

exports.updateFoodOrder = errorHandler(async (req, res, next) => {
  const result = await Order.updateOne(
    { _id: req.params.id },
    req.body
  );

  const updatedOrder = await Order.findById(req.params.id);

  if (result) {
    new Response(res)
      .status(200)
      .send("success", "Order updated!", updatedOrder);
  } else {
    next(new ServerError(500, "fail", "Order could not be updated!"));
  }
});

exports.deleteFoodOrder = errorHandler(async (req, res, next) => {
  const result = await Order.deleteOne({ _id: req.params.id });

  if (result) {
    new Response(res)
      .status(200)
      .send("success", "Order deleted!", result);
  } else {
    next(new ServerError(500, "fail", "Order could not be deleted!"));
  }
});
