const Message = require("../models/Message");

// GET /api/chat/messages?room=general
const getMessages = async (req, res, next) => {
    try {
        const room = req.query.room || "general";
        const messages = await Message.find({ room })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        res.json({ success: true, messages: messages.reverse() });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/chat/messages/:id  (admin only)
const deleteMessage = async (req, res, next) => {
    try {
        const msg = await Message.findByIdAndDelete(req.params.id);
        if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
        res.json({ success: true, message: "Message deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMessages, deleteMessage };
