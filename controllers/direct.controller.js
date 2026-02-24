const DirectMessage = require("../models/DirectMessage");

/** Build a deterministic conversationId from two userIds */
const makeConvId = (a, b) => [a, b].sort().join("_");

// GET /api/direct/conversations  — all convos for the logged-in user
const getConversations = async (req, res, next) => {
    try {
        const userId = req.user._id.toString();

        // Get the latest message per conversation that involves this user
        const convos = await DirectMessage.aggregate([
            {
                $match: {
                    $or: [{ "from.userId": userId }, { "to.userId": userId }],
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$conversationId",
                    lastMessage: { $first: "$$ROOT" },
                    unread: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$to.userId", userId] }, { $eq: ["$read", false] }] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { "lastMessage.createdAt": -1 } },
        ]);

        res.json({ success: true, conversations: convos });
    } catch (err) {
        next(err);
    }
};

// GET /api/direct/messages/:conversationId
const getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const messages = await DirectMessage.find({ conversationId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        res.json({ success: true, messages: messages.reverse() });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/direct/read/:conversationId  — mark all incoming as read
const markRead = async (req, res, next) => {
    try {
        const userId = req.user._id.toString();
        const { conversationId } = req.params;
        await DirectMessage.updateMany(
            { conversationId, "to.userId": userId, read: false },
            { $set: { read: true } }
        );
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

module.exports = { getConversations, getMessages, markRead, makeConvId };
