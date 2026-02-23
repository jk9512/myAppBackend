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
            .select("-password")
            .populate("roleId", "name label description");

        res.status(201).json({ success: true, user: populated });
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
            .select("-password")
            .populate("roleId", "name label description")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            users,
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
            .select("-password")
            .populate("roleId", "name label description");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
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
            .select("-password")
            .populate("roleId", "name label description");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
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

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
