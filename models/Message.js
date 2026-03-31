const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            name: { type: String, required: true, trim: true },
            userId: { type: String, default: "" },
            avatar: { type: String, default: "" },
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
        room: {
            type: String,
            default: "general",
            trim: true,
        },
    },
    { timestamps: true }
);

messageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
