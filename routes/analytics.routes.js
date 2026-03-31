const express = require("express");
const router = express.Router();
const { trackPageView, getAnalytics } = require("../controllers/analytics.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Visitor tracking and analytics
 */

/**
 * @swagger
 * /api/analytics/track:
 *   post:
 *     summary: Track a page view (public — called by frontend)
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [page]
 *             properties:
 *               page: { type: string, example: "/about" }
 *     responses:
 *       201:
 *         description: Tracked successfully
 */
router.post("/track", trackPageView);

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get analytics overview (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get("/", protect, adminOnly, getAnalytics);

module.exports = router;
