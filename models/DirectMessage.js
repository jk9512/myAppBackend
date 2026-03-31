const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            index: true,
        },
        from: {
            userId: { type: String, required: true },
            name: { type: String, required: true },
        },
        to: {
            userId: { type: String, required: true },
            name: { type: String, required: true },
        },
        text: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },
        mediaUrl: {
            type: String,
            default: "",
        },
        mediaType: {
            type: String,
            enum: ["image", "video", "none"],
            default: "none",
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

directMessageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model("DirectMessage", directMessageSchema);
