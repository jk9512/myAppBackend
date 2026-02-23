const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/stats.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated stats from all collections
 */
router.get("/", protect, adminOnly, getStats);

module.exports = router;
