const express = require("express");
const { createOrder, getOrders, getOrderAnalytics } = require("../controllers/orderController");
const { validateOrder } = require("../middleware/validateRequest");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", validateOrder, createOrder);
router.get("/analytics", protect, getOrderAnalytics);
router.get("/", protect, getOrders);

module.exports = router;
