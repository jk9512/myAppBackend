const express = require("express");
const router = express.Router();
const { createContact, getContacts, updateContactStatus, deleteContact, exportContactsExcel } = require("../controllers/contact.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact form submissions — public write, admin read/export
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Submit a contact message (public)
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name:    { type: string, example: "Jay Kachhadiya" }
 *               email:   { type: string, example: "jay@example.com" }
 *               phone:   { type: string, example: "+91 99999 99999" }
 *               subject: { type: string, example: "Project Inquiry" }
 *               message: { type: string, example: "I'd like to discuss a project..." }
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post("/", createContact);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contact submissions (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [new, read, replied] }
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get("/", protect, adminOnly, getContacts);

/**
 * @swagger
 * /api/contacts/export:
 *   get:
 *     summary: Download all contacts as Excel (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export", protect, adminOnly, exportContactsExcel);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update contact status (Admin only)
 *     tags: [Contacts]
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
 *               status: { type: string, enum: [new, read, replied] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put("/:id", protect, adminOnly, updateContactStatus);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact (Admin only)
 *     tags: [Contacts]
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
router.delete("/:id", protect, adminOnly, deleteContact);

module.exports = router;
