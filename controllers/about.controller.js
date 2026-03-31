const AboutUs = require("../models/AboutUs");

// ── GET the active About Us record (public) ────────────────────────────────────
const getAbout = async (req, res, next) => {
    try {
        const about = await AboutUs.findOne({ isActive: true }).sort({ createdAt: -1 });
        if (!about) return res.status(404).json({ success: false, message: "About Us not found" });
        res.json({ success: true, about });
    } catch (err) {
        next(err);
    }
};

// ── GET all About Us records (admin) ──────────────────────────────────────────
const getAllAbout = async (req, res, next) => {
    try {
        const items = await AboutUs.find().sort({ createdAt: -1 });
        res.json({ success: true, items });
    } catch (err) {
        next(err);
    }
};

// ── CREATE About Us record (admin) ────────────────────────────────────────────
const createAbout = async (req, res, next) => {
    try {
        const { headline, subheadline, description, mission, vision, values, stats, team, skills, isActive } = req.body;
        const about = await AboutUs.create({ headline, subheadline, description, mission, vision, values, stats, team, skills, isActive });
        res.status(201).json({ success: true, about });
    } catch (err) {
        next(err);
    }
};

// ── UPDATE About Us record (admin) ────────────────────────────────────────────
const updateAbout = async (req, res, next) => {
    try {
        const about = await AboutUs.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!about) return res.status(404).json({ success: false, message: "About Us not found" });
        res.json({ success: true, about });
    } catch (err) {
        next(err);
    }
};

// ── DELETE About Us record (admin) ────────────────────────────────────────────
const deleteAbout = async (req, res, next) => {
    try {
        const about = await AboutUs.findByIdAndDelete(req.params.id);
        if (!about) return res.status(404).json({ success: false, message: "About Us not found" });
        res.json({ success: true, message: "About Us record deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAbout, getAllAbout, createAbout, updateAbout, deleteAbout };
