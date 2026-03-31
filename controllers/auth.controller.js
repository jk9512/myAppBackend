const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password, role, plan } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const user = await User.create({ name, email, password, role, plan });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                plan: user.plan,
                planStartDate: user.planStartDate,
                hasAvatar: !!(user.avatar?.contentType),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Check subscription plan validity
        const now = new Date();
        const planStart = new Date(user.planStartDate || user.createdAt || now);
        let expiryDays = 14; // Default for "free"
        if (user.plan === "premium" || user.plan === "pro") {
            expiryDays = 90; // 3 months
        }

        const expiryDate = new Date(planStart.getTime() + expiryDays * 24 * 60 * 60 * 1000);

        if (now > expiryDate) {
            return res.status(403).json({
                success: false,
                message: "Your subscription plan has expired. Please renew to continue.",
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                plan: user.plan,
                planStartDate: user.planStartDate,
                hasAvatar: !!(user.avatar?.contentType),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
