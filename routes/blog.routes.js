const express = require("express");
const router = express.Router();
const {
    getBlogs,
    getBlogByIdOrSlug,
    createBlog,
    updateBlog,
    deleteBlog,
} = require("../controllers/blog.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog posts — public read, admin write
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all published blogs (public)
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *       - in: query
 *         name: all
 *         schema: { type: string, enum: [true, false] }
 *         description: Pass "true" to include unpublished (admin use)
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get("/", getBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID or slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId OR slug string
 *     responses:
 *       200:
 *         description: Blog post found
 *       404:
 *         description: Not found
 */
router.get("/:id", getBlogByIdOrSlug);

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a blog post (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:       { type: string, example: "My First Blog Post" }
 *               content:     { type: string, example: "Full article content here..." }
 *               excerpt:     { type: string, example: "A short summary..." }
 *               category:    { type: string, example: "Tech" }
 *               tags:        { type: array, items: { type: string }, example: ["react", "nodejs"] }
 *               coverImage:  { type: string, example: "https://example.com/image.jpg" }
 *               author:      { type: string, example: "Jay Kachhadiya" }
 *               published:   { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Blog created
 */
router.post("/", protect, adminOnly, createBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog post (Admin only)
 *     tags: [Blogs]
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
 *               title:       { type: string }
 *               content:     { type: string }
 *               excerpt:     { type: string }
 *               category:    { type: string }
 *               tags:        { type: array, items: { type: string } }
 *               coverImage:  { type: string }
 *               published:   { type: boolean }
 *     responses:
 *       200:
 *         description: Blog updated
 */
router.put("/:id", protect, adminOnly, updateBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Blog deleted
 */
router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;
