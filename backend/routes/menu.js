const express = require("express");
const { createMenuItem, getMenuGrouped, getMenuItems, updateMenuItem } = require("../controllers/menuController");
const { validateMenuItem } = require("../middleware/validateRequest");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/grouped", getMenuGrouped);
router.get("/", getMenuItems);
router.post("/", protect, validateMenuItem, createMenuItem);
router.patch("/:id", protect, updateMenuItem);

module.exports = router;
