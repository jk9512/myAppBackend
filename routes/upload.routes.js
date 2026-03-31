const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/chat_media");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    },
});

// Init upload
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for videos
    fileFilter(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images and Videos Only!");
        }
    }
});

// @desc    Upload chat media
// @route   POST /api/upload/chat-media
// @access  Public (should ideally be protected, but keeping simple for chat)
router.post("/chat-media", upload.single("media"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const mediaUrl = `/uploads/chat_media/${req.file.filename}`;
    let mediaType = "none";

    if (req.file.mimetype.startsWith("image/")) {
        mediaType = "image";
    } else if (req.file.mimetype.startsWith("video/")) {
        mediaType = "video";
    }

    res.status(200).json({
        success: true,
        mediaUrl,
        mediaType
    });
});

module.exports = router;
