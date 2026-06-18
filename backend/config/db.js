const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

const DEFAULT_URI = "mongodb://127.0.0.1:27017/restaurantdb";

async function migrateLegacyMenuItems() {
  await MenuItem.updateMany({ category: { $exists: false } }, { $set: { category: "Main Course" } });
  await MenuItem.updateMany({ available: { $exists: false } }, { $set: { available: true } });
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;
  await mongoose.connect(mongoUri);
  await migrateLegacyMenuItems();
  console.log("MongoDB connected");
}

module.exports = connectDB;
