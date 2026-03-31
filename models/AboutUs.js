const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
});

const aboutUsSchema = new mongoose.Schema(
    {
        // Company / hero section
        headline: { type: String, required: true, trim: true },
        subheadline: { type: String, default: "", trim: true },
        description: { type: String, required: true },

        // Mission & Vision
        mission: { type: String, default: "" },
        vision: { type: String, default: "" },

        // Core values (array of strings)
        values: { type: [String], default: [] },

        // Key stats (e.g. "50+ Projects", "5 Years")
        stats: {
            type: [{ label: String, value: String }],
            default: [],
        },

        // Team members
        team: { type: [teamMemberSchema], default: [] },

        // Skills / Tech stack shown on page
        skills: { type: [String], default: [] },

        // Single active record — only one "About Us" document used
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AboutUs", aboutUsSchema);
