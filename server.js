require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const autoSeed = require("./utils/autoSeed");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const portfolioRoutes = require("./routes/portfolio.routes");
const contactRoutes = require("./routes/contact.routes");
const statsRoutes = require("./routes/stats.routes");

// Connect to MongoDB, then auto-seed if collections are empty
connectDB().then(() => autoSeed());

const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,   // e.g. https://your-app.vercel.app
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (curl, mobile apps, etc.)
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Swagger UI ───────────────────────────────────────────────────────────────
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Optional: serve raw JSON spec
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Server running ✅" });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs  → http://localhost:${PORT}/api-docs`);
});
