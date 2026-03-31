const express = require("express");
const router = express.Router();
const { getReels, getAllReels, createReel, updateReel, deleteReel } = require("../controllers/reel.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Reels
 *   description: Instagram Reels — public read, admin write
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reel:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         title:
 *           type: string
 *           example: Behind the scenes
 *         instagramUrl:
 *           type: string
 *           example: https://www.instagram.com/reel/ABC123xyz/
 *         shortcode:
 *           type: string
 *           description: Auto-extracted from instagramUrl
 *           example: ABC123xyz
 *         caption:
 *           type: string
 *           example: A glimpse into our workflow
 *         isActive:
 *           type: boolean
 *           default: true
 *         order:
 *           type: integer
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ReelInput:
 *       type: object
 *       required:
 *         - title
 *         - instagramUrl
 *       properties:
 *         title:
 *           type: string
 *           example: Behind the scenes
 *         instagramUrl:
 *           type: string
 *           example: https://www.instagram.com/reel/ABC123xyz/
 *         caption:
 *           type: string
 *           example: A glimpse into our workflow
 *         isActive:
 *           type: boolean
 *           default: true
 *         order:
 *           type: integer
 *           default: 0
 */

/**
 * @swagger
 * /api/reels:
 *   get:
 *     summary: Get all active reels (public)
 *     tags: [Reels]
 *     description: Returns only active reels sorted by order then newest first. No authentication required.
 *     responses:
 *       200:
 *         description: List of active reels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reels:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reel'
 */
router.get("/", getReels);

/**
 * @swagger
 * /api/reels/all:
 *   get:
 *     summary: Get ALL reels including hidden ones (Admin only)
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full list of all reels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reels:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reel'
 *       401:
 *         description: Unauthorized — Bearer token missing or invalid
 *       403:
 *         description: Forbidden — Admin access required
 */
router.get("/all", protect, adminOnly, getAllReels);

/**
 * @swagger
 * /api/reels:
 *   post:
 *     summary: Create a new reel (Admin only)
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReelInput'
 *           example:
 *             title: Behind the scenes
 *             instagramUrl: https://www.instagram.com/reel/ABC123xyz/
 *             caption: A glimpse into our workflow
 *             isActive: true
 *             order: 0
 *     responses:
 *       201:
 *         description: Reel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reel:
 *                   $ref: '#/components/schemas/Reel'
 *       400:
 *         description: Validation error — title and instagramUrl are required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 */
router.post("/", protect, adminOnly, createReel);

/**
 * @swagger
 * /api/reels/{id}:
 *   put:
 *     summary: Update a reel (Admin only)
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the reel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReelInput'
 *     responses:
 *       200:
 *         description: Reel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reel:
 *                   $ref: '#/components/schemas/Reel'
 *       404:
 *         description: Reel not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 */
router.put("/:id", protect, adminOnly, updateReel);

/**
 * @swagger
 * /api/reels/{id}:
 *   delete:
 *     summary: Delete a reel (Admin only)
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the reel to delete
 *     responses:
 *       200:
 *         description: Reel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Reel deleted
 *       404:
 *         description: Reel not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 */
router.delete("/:id", protect, adminOnly, deleteReel);

module.exports = router;
