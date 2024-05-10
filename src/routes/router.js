const express = require("express");
const { getMenu } = require("../controllers/bakeryController");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// ROUTER
const bakeryRouter = express.Router();

// ROUTES

// BAKERY ROUTE
bakeryRouter.route("/menu").get(getMenu);

// ORDERS ROUTE
bakeryRouter
  .route("/order")
  .get(authController.protectRoute, orderController.getAllOrders)
  .post(authController.protectRoute, orderController.createFoodOrder);

bakeryRouter
  .route("/order/:id")
  .get(authController.protectRoute, orderController.getFoodOrder)
  .patch(authController.protectRoute, orderController.updateFoodOrder)
  .delete(
    authController.protectRoute,
    orderController.deleteFoodOrder
  );

// USER ROUTE
bakeryRouter.route("/signup").post(authController.signup);

bakeryRouter.route("/login").post(authController.login);

bakeryRouter
  .route("/users")
  .get(authController.protectRoute, userController.getAllUsers);

bakeryRouter.post("/forgot-password", authController.forgotPassword);

bakeryRouter.patch(
  "/reset-password/:token",
  authController.resetPassword
);

// EXPORTS
module.exports = bakeryRouter;
