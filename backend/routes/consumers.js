const express = require("express");
const { createConsumer, getConsumers } = require("../controllers/consumerController");
const { validateConsumer } = require("../middleware/validateRequest");

const router = express.Router();

router.post("/", validateConsumer, createConsumer);
router.get("/", getConsumers);

module.exports = router;
