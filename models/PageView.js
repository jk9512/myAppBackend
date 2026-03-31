const mongoose = require("mongoose");

const pageViewSchema = new mongoose.Schema(
    {
        page: {
            type: String,
            required: true,
            trim: true,
        },
        ip: {
            type: String,
            default: "unknown",
        },
        userAgent: {
            type: String,
            default: "",
        },
        referrer: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Index for fast time-range queries
pageViewSchema.index({ createdAt: -1 });
pageViewSchema.index({ page: 1 });

module.exports = mongoose.model("PageView", pageViewSchema);
