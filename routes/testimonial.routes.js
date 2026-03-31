const express = require("express");
const router = express.Router();
const { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial } = require("../controllers/testimonial.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Testimonials — public read, admin write
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all active testimonials (public)
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: all
 *         schema: { type: string, enum: [true, false] }
 *         description: Pass "true" to include inactive (admin use)
 *     responses:
 *       200:
 *         description: List of testimonials
 */
router.get("/", getTestimonials);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get single testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Testimonial found
 *       404:
 *         description: Not found
 */
router.get("/:id", getTestimonialById);

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Create a testimonial (Admin only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, designation, message]
 *             properties:
 *               name:        { type: string, example: "Jay Kachhadiya" }
 *               designation: { type: string, example: "CEO at Acme" }
 *               message:     { type: string, example: "Amazing service!" }
 *               rating:      { type: integer, minimum: 1, maximum: 5, example: 5 }
 *               avatar:      { type: string, example: "https://..." }
 *               isActive:    { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Testimonial created
 */
router.post("/", protect, adminOnly, createTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update a testimonial (Admin only)
 *     tags: [Testimonials]
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
 *               name:        { type: string }
 *               designation: { type: string }
 *               message:     { type: string }
 *               rating:      { type: integer }
 *               isActive:    { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:id", protect, adminOnly, updateTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: Delete a testimonial (Admin only)
 *     tags: [Testimonials]
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
router.delete("/:id", protect, adminOnly, deleteTestimonial);

module.exports = router;
