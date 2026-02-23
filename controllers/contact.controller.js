const Contact = require("../models/Contact");
const XLSX = require("xlsx");

// ── Public: Submit contact form ────────────────────────────────────────────
// POST /api/contacts
const createContact = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !subject || !message)
            return res.status(400).json({ success: false, message: "Name, email, subject and message are required" });

        const contact = await Contact.create({ name, email, phone, subject, message });
        res.status(201).json({ success: true, message: "Message sent successfully! We'll get back to you soon.", contact });
    } catch (error) { next(error); }
};

// ── Admin: Get all contacts (with optional status filter) ──────────────────
// GET /api/contacts
const getContacts = async (req, res, next) => {
    try {
        const filter = req.query.status ? { status: req.query.status } : {};
        const contacts = await Contact.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, contacts });
    } catch (error) { next(error); }
};

// ── Admin: Update contact status ───────────────────────────────────────────
// PUT /api/contacts/:id
const updateContactStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
        res.status(200).json({ success: true, contact });
    } catch (error) { next(error); }
};

// ── Admin: Delete contact ──────────────────────────────────────────────────
// DELETE /api/contacts/:id
const deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
        res.status(200).json({ success: true, message: "Contact deleted" });
    } catch (error) { next(error); }
};

// ── Admin: Download contacts as Excel ─────────────────────────────────────
// GET /api/contacts/export
const exportContactsExcel = async (req, res, next) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });

        // Build rows
        const rows = contacts.map((c, i) => ({
            "Sr. No.": i + 1,
            "Name": c.name,
            "Email": c.email,
            "Phone": c.phone || "—",
            "Subject": c.subject,
            "Message": c.message,
            "Status": c.status.toUpperCase(),
            "Received At": new Date(c.createdAt).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
            }),
        }));

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);

        // Column widths
        ws["!cols"] = [
            { wch: 6 },   // Sr No
            { wch: 24 },  // Name
            { wch: 28 },  // Email
            { wch: 16 },  // Phone
            { wch: 26 },  // Subject
            { wch: 48 },  // Message
            { wch: 10 },  // Status
            { wch: 22 },  // Received At
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Contacts");

        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        const filename = `contacts_${new Date().toISOString().slice(0, 10)}.xlsx`;

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) { next(error); }
};

module.exports = { createContact, getContacts, updateContactStatus, deleteContact, exportContactsExcel };
