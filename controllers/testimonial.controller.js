const Testimonial = require("../models/Testimonial");

// @desc    Get all active testimonials (public)
// @route   GET /api/testimonials
const getTestimonials = async (req, res, next) => {
    try {
        const filter = req.query.all === "true" ? {} : { isActive: true };
        const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: testimonials.length, testimonials });
    } catch (error) { next(error); }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
const getTestimonialById = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
        res.status(200).json({ success: true, testimonial });
    } catch (error) { next(error); }
};

// @desc    Create testimonial (admin)
// @route   POST /api/testimonials
const createTestimonial = async (req, res, next) => {
    try {
        const { name, designation, message, rating, avatar, isActive } = req.body;
        if (!name || !designation || !message)
            return res.status(400).json({ success: false, message: "Name, designation and message are required" });

        const testimonial = await Testimonial.create({ name, designation, message, rating, avatar, isActive });
        res.status(201).json({ success: true, testimonial });
    } catch (error) { next(error); }
};

// @desc    Update testimonial (admin)
// @route   PUT /api/testimonials/:id
const updateTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
        res.status(200).json({ success: true, testimonial });
    } catch (error) { next(error); }
};

// @desc    Delete testimonial (admin)
// @route   DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
        res.status(200).json({ success: true, message: "Testimonial deleted" });
    } catch (error) { next(error); }
};

module.exports = { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial };
