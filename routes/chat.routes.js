const express = require("express");
const router = express.Router();
const { getMessages, deleteMessage } = require("../controllers/chat.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time chat message history
 */

/**
 * @swagger
 * /api/chat/messages:
 *   get:
 *     summary: Get last 50 messages for a room (public)
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: room
 *         schema: { type: string, default: general }
 *     responses:
 *       200:
 *         description: Message list
 */
router.get("/messages", getMessages);

/**
 * @swagger
 * /api/chat/messages/{id}:
 *   delete:
 *     summary: Delete a chat message (Admin only)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Message deleted
 */
router.delete("/messages/:id", protect, adminOnly, deleteMessage);

module.exports = router;
