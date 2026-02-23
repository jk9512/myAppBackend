const Portfolio = require("../models/Portfolio");

// @desc    Get all active portfolio items (public)
// @route   GET /api/portfolio
const getPortfolios = async (req, res, next) => {
    try {
        const filter = req.query.all === "true" ? {} : { isActive: true };
        const items = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: items.length, portfolios: items });
    } catch (error) { next(error); }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
const getPortfolioById = async (req, res, next) => {
    try {
        const item = await Portfolio.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Portfolio item not found" });
        res.status(200).json({ success: true, portfolio: item });
    } catch (error) { next(error); }
};

// @desc    Create portfolio item (admin)
// @route   POST /api/portfolio
const createPortfolio = async (req, res, next) => {
    try {
        const { title, description, category, imageUrl, projectUrl, technologies, isActive, order } = req.body;
        if (!title || !description)
            return res.status(400).json({ success: false, message: "Title and description are required" });

        const techs = Array.isArray(technologies)
            ? technologies
            : (technologies || "").split(",").map((t) => t.trim()).filter(Boolean);

        const item = await Portfolio.create({ title, description, category, imageUrl, projectUrl, technologies: techs, isActive, order });
        res.status(201).json({ success: true, portfolio: item });
    } catch (error) { next(error); }
};

// @desc    Update portfolio item (admin)
// @route   PUT /api/portfolio/:id
const updatePortfolio = async (req, res, next) => {
    try {
        if (req.body.technologies && !Array.isArray(req.body.technologies)) {
            req.body.technologies = req.body.technologies.split(",").map((t) => t.trim()).filter(Boolean);
        }
        const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: "Portfolio item not found" });
        res.status(200).json({ success: true, portfolio: item });
    } catch (error) { next(error); }
};

// @desc    Delete portfolio item (admin)
// @route   DELETE /api/portfolio/:id
const deletePortfolio = async (req, res, next) => {
    try {
        const item = await Portfolio.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Portfolio item not found" });
        res.status(200).json({ success: true, message: "Portfolio item deleted" });
    } catch (error) { next(error); }
};

module.exports = { getPortfolios, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio };
