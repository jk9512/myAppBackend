const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        excerpt: {
            type: String,
            trim: true,
            default: "",
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        category: {
            type: String,
            default: "General",
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        coverImage: {
            type: String,
            default: "",
        },
        author: {
            type: String,
            default: "Jay Kachhadiya",
            trim: true,
        },
        published: {
            type: Boolean,
            default: true,
        },
        readTime: {
            type: Number, // in minutes
            default: 1,
        },
    },
    { timestamps: true }
);

// Auto-generate slug from title before saving
blogSchema.pre("save", function (next) {
    if (this.isModified("title") && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    // Auto compute readTime (~200 words per minute)
    if (this.isModified("content")) {
        const wordCount = this.content.trim().split(/\s+/).length;
        this.readTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    next();
});

module.exports = mongoose.model("Blog", blogSchema);
