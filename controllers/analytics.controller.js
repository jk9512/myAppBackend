const PageView = require("../models/PageView");

// POST /api/analytics/track  (public — called by frontend on each page load)
const trackPageView = async (req, res, next) => {
    try {
        const { page } = req.body;
        if (!page) return res.status(400).json({ success: false, message: "page is required" });

        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            "unknown";

        await PageView.create({
            page,
            ip,
            userAgent: req.headers["user-agent"] || "",
            referrer: req.headers["referer"] || req.headers["referrer"] || "",
        });

        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
};

// GET /api/analytics  (admin only — overview of visits)
const getAnalytics = async (req, res, next) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalViews,
            todayViews,
            weekViews,
            monthViews,
            topPages,
            dailyLast7,
        ] = await Promise.all([
            // Overall totals
            PageView.countDocuments(),
            PageView.countDocuments({ createdAt: { $gte: todayStart } }),
            PageView.countDocuments({ createdAt: { $gte: weekStart } }),
            PageView.countDocuments({ createdAt: { $gte: monthStart } }),

            // Top 5 most visited pages this month
            PageView.aggregate([
                { $match: { createdAt: { $gte: monthStart } } },
                { $group: { _id: "$page", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $project: { page: "$_id", count: 1, _id: 0 } },
            ]),

            // Daily views for last 7 days
            PageView.aggregate([
                { $match: { createdAt: { $gte: weekStart } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
                { $project: { date: "$_id", count: 1, _id: 0 } },
            ]),
        ]);

        // Unique IPs (approximate unique visitors)
        const uniqueTotal = await PageView.distinct("ip");
        const uniqueToday = await PageView.distinct("ip", { createdAt: { $gte: todayStart } });

        res.json({
            success: true,
            analytics: {
                totalViews,
                todayViews,
                weekViews,
                monthViews,
                uniqueVisitors: uniqueTotal.length,
                uniqueToday: uniqueToday.length,
                topPages,
                dailyLast7,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { trackPageView, getAnalytics };
