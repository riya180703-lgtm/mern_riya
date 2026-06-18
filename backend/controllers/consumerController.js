const Consumer = require("../models/Consumer");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const getConsumers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [consumers, total] = await Promise.all([
      Consumer.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Consumer.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: consumers,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return next(error);
  }
};

const createConsumer = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const consumer = await Consumer.create({ name, email, phone });
    return res.status(201).json({ success: true, data: consumer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }
    return next(error);
  }
};

module.exports = {
  getConsumers,
  createConsumer,
};
