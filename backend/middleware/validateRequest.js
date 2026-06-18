const { CATEGORIES } = require("../models/MenuItem");

const validateMenuItem = (req, res, next) => {
  const { itemName, price, category } = req.body;

  if (!itemName || price === undefined) {
    return res.status(400).json({ success: false, message: "itemName and price are required." });
  }

  if (Number.isNaN(Number(price)) || Number(price) < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Price must be a valid number greater than or equal to 0." });
  }

  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${CATEGORIES.join(", ")}`,
    });
  }

  return next();
};

const validateConsumer = (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: "Name, email, and phone are required." });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!emailRegex.test(String(email).trim())) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }

  if (!phoneRegex.test(String(phone).trim())) {
    return res
      .status(400)
      .json({ success: false, message: "Phone must be a 10-digit Indian mobile number starting with 6-9." });
  }

  return next();
};

const validateOrder = (req, res, next) => {
  const { itemName, price } = req.body;

  if (!itemName || price === undefined) {
    return res.status(400).json({ success: false, message: "itemName and price are required." });
  }

  if (Number.isNaN(Number(price)) || Number(price) < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Price must be a valid number greater than or equal to 0." });
  }

  return next();
};

module.exports = {
  validateMenuItem,
  validateConsumer,
  validateOrder,
};
