const express = require("express");
const router = express.Router();
const { getConversations, getMessages, markRead } = require("../controllers/direct.controller");
const { protect } = require("../middleware/auth.middleware");

// All DM routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: DirectMessages
 *   description: Private 1-to-1 messaging
 */

/**
 * @swagger
 * /api/direct/conversations:
 *   get:
 *     summary: Get all conversations for the logged-in user
 *     tags: [DirectMessages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations with last message + unread count
 */
router.get("/conversations", getConversations);

/**
 * @swagger
 * /api/direct/messages/{conversationId}:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [DirectMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get("/messages/:conversationId", getMessages);

/**
 * @swagger
 * /api/direct/read/{conversationId}:
 *   patch:
 *     summary: Mark all incoming messages in a conversation as read
 *     tags: [DirectMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Messages marked read
 */
router.patch("/read/:conversationId", markRead);

module.exports = router;
