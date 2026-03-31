const express = require("express");
const router = express.Router();
const { getPortfolios, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio } = require("../controllers/portfolio.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Portfolio items — public read, admin write
 */

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Get all active portfolio items (public)
 *     tags: [Portfolio]
 *     parameters:
 *       - in: query
 *         name: all
 *         schema: { type: string, enum: [true, false] }
 *         description: Pass "true" to include inactive items (admin use)
 *     responses:
 *       200:
 *         description: List of portfolio items
 */
router.get("/", getPortfolios);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   get:
 *     summary: Get single portfolio item
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Portfolio item found
 *       404:
 *         description: Not found
 */
router.get("/:id", getPortfolioById);

/**
 * @swagger
 * /api/portfolio:
 *   post:
 *     summary: Create portfolio item (Admin only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:        { type: string, example: "E-Commerce App" }
 *               description:  { type: string, example: "A full-stack shopping platform" }
 *               category:     { type: string, example: "Web App" }
 *               imageUrl:     { type: string, example: "https://..." }
 *               projectUrl:   { type: string, example: "https://..." }
 *               technologies: { type: string, example: "React, Node.js, MongoDB" }
 *               isActive:     { type: boolean, example: true }
 *               order:        { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Portfolio item created
 */
router.post("/", protect, adminOnly, createPortfolio);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   put:
 *     summary: Update portfolio item (Admin only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:        { type: string }
 *               description:  { type: string }
 *               category:     { type: string }
 *               imageUrl:     { type: string }
 *               projectUrl:   { type: string }
 *               technologies: { type: string }
 *               isActive:     { type: boolean }
 *               order:        { type: integer }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:id", protect, adminOnly, updatePortfolio);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   delete:
 *     summary: Delete portfolio item (Admin only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", protect, adminOnly, deletePortfolio);

module.exports = router;
