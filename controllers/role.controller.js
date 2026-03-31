const Role = require("../models/Role");

// @desc    Create a role
// @route   POST /api/roles
// @access  Admin
const createRole = async (req, res, next) => {
    try {
        const { name, label, description } = req.body;

        if (!name || !label) {
            return res.status(400).json({ success: false, message: "Name and label are required" });
        }

        const exists = await Role.findOne({ name: name.toLowerCase() });
        if (exists) {
            return res.status(400).json({ success: false, message: "Role with this name already exists" });
        }

        const role = await Role.create({ name, label, description });
        res.status(201).json({ success: true, role });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (any logged-in user — needed to populate role dropdown in forms)
const getRoles = async (req, res, next) => {
    try {
        const roles = await Role.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: roles.length, roles });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Admin
const getRoleById = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }
        res.status(200).json({ success: true, role });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Admin
const updateRole = async (req, res, next) => {
    try {
        const { name, label, description } = req.body;

        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { name, label, description },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }
        res.status(200).json({ success: true, role });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Admin
const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }
        res.status(200).json({ success: true, message: "Role deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole };
