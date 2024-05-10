const mongoose = require("mongoose");

// SCHEMA
const menuSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A food item must have a name!"],
    },
    price: {
      type: Number,
      required: [true, "A food item must have a price!"],
    },
    quantity: {
      type: Number,
      required: [true, "A food item must have a quantity!"],
    },
  },
  {
    collection: "menu",
  }
);

// MODEL
const Menu = mongoose.model("Menu", menuSchema);

// EXPORTS
module.exports = Menu;
