const { default: mongoose } = require("mongoose");

// SCHEMA
const orderSchema = mongoose.Schema(
  {
    orderNumber: Number,
    foodItems: [
      {
        name: {
          type: String,
          required: [true, "Food item must have a name!"],
        },
        quantity: {
          type: Number,
          required: [true, "Food item must have a quantity!"],
        },
      },
    ],
    address: {
      type: String,
      required: [true, "An order must have an address!"],
    },
    contact: {
      type: String,
      required: [true, "An order must have an contact!"],
    },
  },
  {
    collection: "orders",
  }
);

// MODELLING
const Order = mongoose.model("Order", orderSchema);

// EXPORTS
module.exports = Order;
