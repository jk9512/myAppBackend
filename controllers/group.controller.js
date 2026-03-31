const Group = require("../models/Group");

// POST /api/groups
// Create a new group
const createGroup = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        // admin is the current user. members is array of user ids.

        let targetMembers = members || [];
        if (!targetMembers.includes(req.user.id)) {
            targetMembers.push(req.user.id);
        }

        const group = await Group.create({
            name,
            admin: req.user.id,
            members: targetMembers
        });

        res.status(201).json({ success: true, group });
    } catch (err) {
        next(err);
    }
};

// GET /api/groups
// Get all groups for the current user
const getUserGroups = async (req, res, next) => {
    try {
        const groups = await Group.find({ members: req.user.id })
            .populate("admin", "name email hasAvatar")
            .populate("members", "name email hasAvatar")
            .sort({ createdAt: -1 });

        res.json({ success: true, groups });
    } catch (err) {
        next(err);
    }
};

// POST /api/groups/:id/leave
// Leave a group
const leaveGroup = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.admin.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: "Admin cannot leave the group. Delete the group instead." });
        }

        group.members = group.members.filter(memberId => memberId.toString() !== req.user.id);
        await group.save();

        res.json({ success: true, message: "Left group successfully" });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/groups/:id/members/:userId
// Remove a user from group (Admin only)
const removeMember = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Only admin can remove members" });
        }

        group.members = group.members.filter(memberId => memberId.toString() !== req.params.userId);
        await group.save();

        res.json({ success: true, message: "Member removed successfully" });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/groups/:id
// Delete a group (Admin only)
const deleteGroup = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Only admin can delete group" });
        }

        await Group.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Group deleted successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports = { createGroup, getUserGroups, leaveGroup, removeMember, deleteGroup };
