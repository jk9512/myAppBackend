const User = require("../models/User");

// @desc    Create a new user (by admin)
// @route   POST /api/users
// @access  Admin
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role, roleId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const user = await User.create({ name, email, password, role: role || "user", roleId: roleId || null });

        const populated = await User.findById(user._id)
            .select("-password -avatar.data")
            .populate("roleId", "name label description");

        res.status(201).json({ success: true, user: { ...populated.toObject(), hasAvatar: false } });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (paginated + populated roleId)
// @route   GET /api/users
// @access  Admin
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select("-password -avatar.data")
            .populate("roleId", "name label description")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const usersWithFlag = users.map(u => ({
            ...u.toObject(),
            hasAvatar: !!(u.avatar?.contentType),
        }));

        res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            users: usersWithFlag,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password -avatar.data")
            .populate("roleId", "name label description");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user: { ...user.toObject(), hasAvatar: !!(user.avatar?.contentType) },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user (name, email, role, roleId)
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
    try {
        const { name, email, role, roleId } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, roleId: roleId || null },
            { new: true, runValidators: true }
        )
            .select("-password -avatar.data")
            .populate("roleId", "name label description");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: { ...user.toObject(), hasAvatar: !!(user.avatar?.contentType) },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload / replace the logged-in user's avatar
// @route   POST /api/users/avatar/me
// @access  Private (any logged-in user)
const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(req.file.mimetype)) {
            return res.status(400).json({ success: false, message: "Only JPEG, PNG, WebP or GIF images are allowed" });
        }

        if (req.file.size > 2 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: "Image must be under 2 MB" });
        }

        await User.findByIdAndUpdate(req.user._id, {
            "avatar.data": req.file.buffer,
            "avatar.contentType": req.file.mimetype,
        });

        res.json({ success: true, message: "Avatar updated", hasAvatar: true });
    } catch (error) {
        next(error);
    }
};

// @desc    Serve a user's avatar image
// @route   GET /api/users/:id/avatar
// @access  Public
const serveAvatar = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("avatar");
        if (!user || !user.avatar?.data) {
            return res.status(404).json({ success: false, message: "No avatar found" });
        }
        res.set("Content-Type", user.avatar.contentType);
        res.set("Cache-Control", "public, max-age=86400");
        res.send(user.avatar.data);
    } catch (error) {
        next(error);
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, uploadAvatar, serveAvatar };
