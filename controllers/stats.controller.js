const User = require("../models/User");
const Role = require("../models/Role");
const Testimonial = require("../models/Testimonial");
const Portfolio = require("../models/Portfolio");
const Contact = require("../models/Contact");

// GET /api/stats  (admin only)
const getStats = async (req, res, next) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Parallel queries for speed
        const [
            totalUsers,
            adminUsers,
            joinedToday,
            joinedThisWeek,
            joinedThisMonth,
            totalRoles,
            totalTestimonials,
            activeTestimonials,
            totalPortfolio,
            activePortfolio,
            totalContacts,
            newContacts,
            recentContacts,
            recentUsers,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ createdAt: { $gte: todayStart } }),
            User.countDocuments({ createdAt: { $gte: weekStart } }),
            User.countDocuments({ createdAt: { $gte: monthStart } }),
            Role.countDocuments(),
            Testimonial.countDocuments(),
            Testimonial.countDocuments({ isActive: true }),
            Portfolio.countDocuments(),
            Portfolio.countDocuments({ isActive: true }),
            Contact.countDocuments(),
            Contact.countDocuments({ status: "new" }),
            Contact.find().sort({ createdAt: -1 }).limit(5).select("name email subject status createdAt"),
            User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                users: { total: totalUsers, admins: adminUsers, joinedToday, joinedThisWeek, joinedThisMonth },
                roles: { total: totalRoles },
                testimonials: { total: totalTestimonials, active: activeTestimonials },
                portfolio: { total: totalPortfolio, active: activePortfolio },
                contacts: { total: totalContacts, new: newContacts },
            },
            recentContacts,
            recentUsers,
        });
    } catch (error) { next(error); }
};

module.exports = { getStats };
