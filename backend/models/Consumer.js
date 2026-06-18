const mongoose = require("mongoose");

const consumerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number (10 digits starting with 6-9)"],
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "consumers" }
);

module.exports = mongoose.model("Consumer", consumerSchema);
