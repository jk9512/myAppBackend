const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { createGroup, getUserGroups, leaveGroup, removeMember, deleteGroup } = require("../controllers/group.controller");

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group chat management
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group chat
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post("/", protect, createGroup);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups the current user belongs to
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get("/", protect, getUserGroups);

/**
 * @swagger
 * /api/groups/{id}/leave:
 *   post:
 *     summary: Leave a group (members only, admin cannot leave)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Left group successfully
 */
router.post("/:id/leave", protect, leaveGroup);

/**
 * @swagger
 * /api/groups/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member from a group (Admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Member removed successfully
 */
router.delete("/:id/members/:userId", protect, removeMember);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a group entirely (Admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Group deleted successfully
 */
router.delete("/:id", protect, deleteGroup);

module.exports = router;
