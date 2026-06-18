const MenuItem = require("../models/MenuItem");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const buildPriceMatch = (minPrice, maxPrice) => {
  const price = {};

  if (minPrice !== undefined && minPrice !== "") {
    price.$gte = Number(minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    price.$lte = Number(maxPrice);
  }

  return Object.keys(price).length ? price : null;
};

const isTruthyQuery = (value) => value === "true" || value === true;
const isFalsyQuery = (value) => value === "false" || value === false;

const buildAvailableFilter = (available) => {
  if (available === undefined || available === "") {
    return null;
  }

  if (isTruthyQuery(available)) {
    return { $or: [{ available: true }, { available: { $exists: false } }] };
  }

  if (isFalsyQuery(available)) {
    return { available: false };
  }

  return null;
};

const getMenuItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { minPrice, maxPrice, category, available } = req.query;

    const filter = {};

    const priceMatch = buildPriceMatch(minPrice, maxPrice);
    if (priceMatch) {
      filter.price = priceMatch;
    }

    if (category) {
      filter.category = category;
    }

    const availableFilter = buildAvailableFilter(available);
    if (availableFilter) {
      Object.assign(filter, availableFilter);
    }

    const [menuItems, total] = await Promise.all([
      MenuItem.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      MenuItem.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: menuItems,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return next(error);
  }
};

const getMenuGrouped = async (req, res, next) => {
  try {
    const { minPrice, maxPrice, category } = req.query;
    const priceMatch = buildPriceMatch(minPrice, maxPrice);

    const pipeline = [
      {
        $addFields: {
          category: { $ifNull: ["$category", "Main Course"] },
          available: { $ifNull: ["$available", true] },
        },
      },
      { $match: { available: true } },
      ...(priceMatch ? [{ $match: { price: priceMatch } }] : []),
      ...(category ? [{ $match: { category } }] : []),
      {
        $group: {
          _id: "$category",
          items: { $push: "$$ROOT" },
          avgPrice: { $avg: "$price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          items: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          count: 1,
        },
      },
    ];

    const result = await MenuItem.aggregate(pipeline);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { itemName, description, price, image, category, available } = req.body;
    const menuItem = await MenuItem.create({
      itemName,
      description,
      price,
      image,
      category,
      available,
    });
    return res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    return next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { available, category, price, description, itemName, image } = req.body;
    const updates = {};

    if (available !== undefined) updates.available = available;
    if (category !== undefined) updates.category = category;
    if (price !== undefined) updates.price = price;
    if (description !== undefined) updates.description = description;
    if (itemName !== undefined) updates.itemName = itemName;
    if (image !== undefined) updates.image = image;

    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    return res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuGrouped,
  createMenuItem,
  updateMenuItem,
};
