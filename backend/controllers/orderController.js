const Order = require("../models/Order");

const createOrder = async (req, res, next) => {
  try {
    const { itemName, price } = req.body;
    const order = await Order.create({ itemName, price });
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

const getOrderAnalytics = async (req, res, next) => {
  try {
    const [overview] = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
          averageOrderValue: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: { $round: ["$averageOrderValue", 2] },
        },
      },
    ]);

    const topItems = await Order.aggregate([
      {
        $group: {
          _id: "$itemName",
          orders: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { orders: -1, revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          itemName: "$_id",
          orders: 1,
          revenue: 1,
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          orders: 1,
          revenue: 1,
        },
      },
    ]);

    return res.status(200).json({
      overview: overview || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      },
      topItems,
      dailyOrders,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderAnalytics,
};
