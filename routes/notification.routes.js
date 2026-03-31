const express = require("express");
const { sendWhatsApp } = require("../controllers/notification.controller");

const router = express.Router();

// @route   POST /api/notifications/whatsapp
router.post("/whatsapp", sendWhatsApp);

module.exports = router;
