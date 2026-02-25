const Reel = require("../models/Reel");

// @desc    Get active reels (public)
// @route   GET /api/reels
const getReels = async (req, res, next) => {
    try {
        const reels = await Reel.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .select("-__v");
        res.json({ success: true, reels });
    } catch (error) {
        next(error);
    }
};

// @desc    Get ALL reels (admin)
// @route   GET /api/reels/all
const getAllReels = async (req, res, next) => {
    try {
        const reels = await Reel.find().sort({ order: 1, createdAt: -1 }).select("-__v");
        res.json({ success: true, reels });
    } catch (error) {
        next(error);
    }
};

// @desc    Create reel (admin)
// @route   POST /api/reels
const createReel = async (req, res, next) => {
    try {
        const { title, instagramUrl, caption, isActive, order } = req.body;
        if (!title || !instagramUrl) {
            return res.status(400).json({ success: false, message: "Title and Instagram URL are required" });
        }
        const reel = await Reel.create({ title, instagramUrl, caption, isActive, order });
        res.status(201).json({ success: true, reel });
    } catch (error) {
        next(error);
    }
};

// @desc    Update reel (admin)
// @route   PUT /api/reels/:id
const updateReel = async (req, res, next) => {
    try {
        const { title, instagramUrl, caption, isActive, order } = req.body;
        const reel = await Reel.findByIdAndUpdate(
            req.params.id,
            { title, instagramUrl, caption, isActive, order },
            { new: true, runValidators: true }
        );
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });
        res.json({ success: true, reel });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete reel (admin)
// @route   DELETE /api/reels/:id
const deleteReel = async (req, res, next) => {
    try {
        const reel = await Reel.findByIdAndDelete(req.params.id);
        if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });
        res.json({ success: true, message: "Reel deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getReels, getAllReels, createReel, updateReel, deleteReel };
