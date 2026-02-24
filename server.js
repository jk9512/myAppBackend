require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const autoSeed = require("./utils/autoSeed");
const Message = require("./models/Message");
const DirectMessage = require("./models/DirectMessage");
const { makeConvId } = require("./controllers/direct.controller");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const portfolioRoutes = require("./routes/portfolio.routes");
const contactRoutes = require("./routes/contact.routes");
const statsRoutes = require("./routes/stats.routes");
const blogRoutes = require("./routes/blog.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const chatRoutes = require("./routes/chat.routes");
const directRoutes = require("./routes/direct.routes");

// Connect to MongoDB, then auto-seed if collections are empty
connectDB().then(() => autoSeed());

const app = express();
const server = http.createServer(app);

app.set("trust proxy", 1);

const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? true
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: corsOptions,
    transports: ["websocket", "polling"],
});

// Track online users per group room
const onlineUsers = {};

// Track which socket belongs to which userId (for DM delivery)
const userSockets = {}; // { userId: socketId }

io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ── GROUP CHAT ──────────────────────────────────────────────────────────
    socket.on("join-room", (room = "general") => {
        socket.join(room);
        if (!onlineUsers[room]) onlineUsers[room] = new Set();
        onlineUsers[room].add(socket.id);
        io.to(room).emit("online-count", onlineUsers[room].size);
    });

    socket.on("send-message", async ({ room = "general", text, sender }) => {
        if (!text?.trim() || !sender?.name) return;
        try {
            const msg = await Message.create({ room, text: text.trim(), sender });
            io.to(room).emit("new-message", {
                _id: msg._id,
                text: msg.text,
                sender: msg.sender,
                createdAt: msg.createdAt,
            });
        } catch (err) {
            console.error("Chat save error:", err.message);
        }
    });

    // ── DIRECT MESSAGES ─────────────────────────────────────────────────────
    // Register user's socket so we can deliver DMs
    socket.on("dm-register", (userId) => {
        if (userId) {
            userSockets[userId] = socket.id;
            socket.userId = userId;
        }
    });

    // Join a private DM room (conversationId)
    socket.on("dm-join", (conversationId) => {
        socket.join(`dm:${conversationId}`);
    });

    // Send a direct message
    socket.on("dm-send", async ({ from, to, text }) => {
        if (!text?.trim() || !from?.userId || !to?.userId) return;
        try {
            const conversationId = makeConvId(from.userId, to.userId);
            const msg = await DirectMessage.create({
                conversationId,
                from,
                to,
                text: text.trim(),
            });

            const payload = {
                _id: msg._id,
                conversationId,
                from: msg.from,
                to: msg.to,
                text: msg.text,
                read: msg.read,
                createdAt: msg.createdAt,
            };

            // Deliver to both sender and recipient
            io.to(`dm:${conversationId}`).emit("dm-message", payload);

            // Also push to recipient's socket if they're online but not in this room
            const recipientSocketId = userSockets[to.userId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("dm-notification", payload);
            }
        } catch (err) {
            console.error("DM save error:", err.message);
        }
    });

    // ── DISCONNECT ──────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
        for (const room of Object.keys(onlineUsers)) {
            if (onlineUsers[room].has(socket.id)) {
                onlineUsers[room].delete(socket.id);
                io.to(room).emit("online-count", onlineUsers[room].size);
            }
        }
        if (socket.userId) delete userSockets[socket.userId];
        console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
});

// ── Swagger UI ────────────────────────────────────────────────────────────────
const swaggerUiOptions = {
    customCss: `
    .swagger-ui .topbar { background: #0f172a; }
    .swagger-ui .info .title { color: #6366f1; }
    body { background: #1e293b; }
    .swagger-ui { color: #f1f5f9; }
    .swagger-ui .opblock-tag { color: #94a3b8; }
  `,
    customSiteTitle: "Full-Stack API Docs",
    swaggerOptions: { persistAuthorization: true },
};

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", (req, res, next) => {
    const host = req.get("host");
    const protocol = req.protocol;
    swaggerSpec.servers = [
        { url: `${protocol}://${host}`, description: "Current Server" },
    ];
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)(req, res, next);
});

app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/direct", directRoutes);

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Server running ✅" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs  → http://localhost:${PORT}/api-docs`);
    console.log(`💬 Socket.io ready (group + DM)`);
});
