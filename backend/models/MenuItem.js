const mongoose = require("mongoose");

const CATEGORIES = ["Starter", "Main Course", "Dessert", "Beverage"];

const menuItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Main Course",
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true, collection: "menuitems" }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
module.exports.CATEGORIES = CATEGORIES;
