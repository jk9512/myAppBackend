const Blog = require("../models/Blog");

// ── GET all published blogs (public) ─────────────────────────────────────────
const getBlogs = async (req, res, next) => {
    try {
        const { category, tag, limit = 10, page = 1, all } = req.query;
        const filter = {};

        // Admins can pass ?all=true to see unpublished
        if (all !== "true") filter.published = true;
        if (category) filter.category = category;
        if (tag) filter.tags = tag;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Blog.countDocuments(filter);
        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select("-content"); // Exclude heavy content from list

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            blogs,
        });
    } catch (err) {
        next(err);
    }
};

// ── GET single blog by id or slug ─────────────────────────────────────────────
const getBlogByIdOrSlug = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const blog = isObjectId
            ? await Blog.findById(id)
            : await Blog.findOne({ slug: id });

        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
        res.json({ success: true, blog });
    } catch (err) {
        next(err);
    }
};

// ── CREATE blog (Admin only) ──────────────────────────────────────────────────
const createBlog = async (req, res, next) => {
    try {
        const { title, content, excerpt, category, tags, coverImage, author, published } = req.body;
        const blog = await Blog.create({ title, content, excerpt, category, tags, coverImage, author, published });
        res.status(201).json({ success: true, blog });
    } catch (err) {
        next(err);
    }
};

// ── UPDATE blog (Admin only) ──────────────────────────────────────────────────
const updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
        res.json({ success: true, blog });
    } catch (err) {
        next(err);
    }
};

// ── DELETE blog (Admin only) ──────────────────────────────────────────────────
const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports = { getBlogs, getBlogByIdOrSlug, createBlog, updateBlog, deleteBlog };
