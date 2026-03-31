const express = require("express");
const router = express.Router();
const {
    getAbout,
    getAllAbout,
    createAbout,
    updateAbout,
    deleteAbout,
} = require("../controllers/about.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: AboutUs
 *   description: About Us content — public read, admin write
 */

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get the active About Us content (public)
 *     tags: [AboutUs]
 *     responses:
 *       200:
 *         description: About Us content
 *       404:
 *         description: Not found
 */
router.get("/", getAbout);

/**
 * @swagger
 * /api/about/all:
 *   get:
 *     summary: Get all About Us records (admin)
 *     tags: [AboutUs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of About Us records
 */
router.get("/all", protect, adminOnly, getAllAbout);

/**
 * @swagger
 * /api/about:
 *   post:
 *     summary: Create an About Us record (Admin only)
 *     tags: [AboutUs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [headline, description]
 *             properties:
 *               headline:    { type: string, example: "Building Digital Experiences" }
 *               subheadline: { type: string, example: "We craft modern web solutions" }
 *               description: { type: string, example: "Full description of the company..." }
 *               mission:     { type: string, example: "To deliver world-class software" }
 *               vision:      { type: string, example: "A world where every business thrives digitally" }
 *               values:      { type: array, items: { type: string }, example: ["Innovation", "Quality"] }
 *               stats:       { type: array, items: { type: object }, example: [{"label":"Projects","value":"50+"}] }
 *               team:        { type: array, items: { type: object } }
 *               skills:      { type: array, items: { type: string }, example: ["React", "Node.js"] }
 *               isActive:    { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: About Us record created
 */
router.post("/", protect, adminOnly, createAbout);

/**
 * @swagger
 * /api/about/{id}:
 *   put:
 *     summary: Update an About Us record (Admin only)
 *     tags: [AboutUs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: About Us record updated
 */
router.put("/:id", protect, adminOnly, updateAbout);

/**
 * @swagger
 * /api/about/{id}:
 *   delete:
 *     summary: Delete an About Us record (Admin only)
 *     tags: [AboutUs]
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
router.delete("/:id", protect, adminOnly, deleteAbout);

module.exports = router;
