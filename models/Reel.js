const mongoose = require("mongoose");

// Helper: extract shortcode from various Instagram URL formats
// Supports: /reel/CODE/, /p/CODE/, /tv/CODE/
const extractShortcode = (url) => {
    const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : "";
};

const reelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        instagramUrl: {
            type: String,
            required: [true, "Instagram URL is required"],
            trim: true,
        },
        shortcode: {
            type: String,
            trim: true,
        },
        caption: {
            type: String,
            default: "",
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Auto-extract shortcode before save
reelSchema.pre("save", function (next) {
    if (this.isModified("instagramUrl")) {
        this.shortcode = extractShortcode(this.instagramUrl);
    }
    next();
});

// Also extract on findOneAndUpdate
reelSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update?.instagramUrl) {
        update.shortcode = extractShortcode(update.instagramUrl);
    }
    next();
});

module.exports = mongoose.model("Reel", reelSchema);
