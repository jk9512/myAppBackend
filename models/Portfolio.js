const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        category: {
            type: String,
            default: "Other",
            trim: true,
        },
        imageUrl: {
            type: String,
            default: "",
            trim: true,
        },
        projectUrl: {
            type: String,
            default: "",
            trim: true,
        },
        technologies: {
            type: [String],
            default: [],
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

module.exports = mongoose.model("Portfolio", portfolioSchema);
