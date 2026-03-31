const express = require("express");
const router = express.Router();
const { createRole, getRoles, getRoleById, updateRole, deleteRole } = require("../controllers/role.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management CRUD — Dynamic role system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         _id:          { type: string,  example: "65f1a2b3c4d5e6f7a8b9c0d1" }
 *         name:         { type: string,  example: "admin" }
 *         label:        { type: string,  example: "Administrator" }
 *         description:  { type: string,  example: "Full system access" }
 *         createdAt:    { type: string,  format: date-time }
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, label]
 *             properties:
 *               name:        { type: string, example: "manager" }
 *               label:       { type: string, example: "Manager" }
 *               description: { type: string, example: "Can manage team members" }
 *     responses:
 *       201:
 *         description: Role created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 role:    { $ref: '#/components/schemas/Role' }
 *       400:
 *         description: Missing fields or duplicate name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", protect, adminOnly, createRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles (any logged-in user)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count:   { type: integer }
 *                 roles:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Role' }
 */
router.get("/", protect, getRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a single role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 role:    { $ref: '#/components/schemas/Role' }
 *       404:
 *         description: Role not found
 */
router.get("/:id", protect, adminOnly, getRoleById);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
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
 *               name:        { type: string, example: "manager" }
 *               label:       { type: string, example: "Manager" }
 *               description: { type: string, example: "Updated description" }
 *     responses:
 *       200:
 *         description: Role updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 role:    { $ref: '#/components/schemas/Role' }
 *       404:
 *         description: Role not found
 */
router.put("/:id", protect, adminOnly, updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role deleted
 *       404:
 *         description: Role not found
 */
router.delete("/:id", protect, adminOnly, deleteRole);

module.exports = router;
