const bcrypt = require("bcryptjs");
const Role = require("../models/Role");
const User = require("../models/User");
const Testimonial = require("../models/Testimonial");
const Portfolio = require("../models/Portfolio");
const AboutUs = require("../models/AboutUs");

/**
 * autoSeed — runs automatically when the server starts.
 * Checks each collection FIRST. Only inserts if it is empty.
 * Safe to call on every startup — will never overwrite existing data.
 */
const autoSeed = async () => {
    try {

        // ── 1. Roles ───────────────────────────────────────────────────────
        const roleCount = await Role.countDocuments();
        if (roleCount === 0) {
            await Role.insertMany([
                { name: "admin", label: "Administrator", description: "Full system access" },
                { name: "manager", label: "Manager", description: "Can manage team members" },
                { name: "user", label: "Regular User", description: "Basic read access" },
            ]);
            console.log("🌱 Roles seeded");
        }

        // ── 2. Users ───────────────────────────────────────────────────────
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const roles = await Role.find();
            const adminRole = roles.find(r => r.name === "admin");
            const userRole = roles.find(r => r.name === "user");
            const managerRole = roles.find(r => r.name === "manager");

            const adminPwd = await bcrypt.hash("admin123", 12);
            const userPwd = await bcrypt.hash("user123", 12);

            await User.insertMany([
                { name: "Admin User", email: "admin@example.com", password: adminPwd, role: "admin", roleId: adminRole?._id },
                { name: "Alice Smith", email: "alice@example.com", password: userPwd, role: "user", roleId: userRole?._id },
                { name: "Bob Johnson", email: "bob@example.com", password: userPwd, role: "user", roleId: userRole?._id },
                { name: "Carol White", email: "carol@example.com", password: userPwd, role: "user", roleId: managerRole?._id },
                { name: "David Brown", email: "david@example.com", password: userPwd, role: "user", roleId: userRole?._id },
                { name: "Eve Williams", email: "eve@example.com", password: userPwd, role: "user", roleId: managerRole?._id },
            ]);
            console.log("🌱 Users seeded");
            console.log("   👑 admin@example.com  /  admin123");
            console.log("   👤 *@example.com      /  user123");
        }

        // ── 3. Testimonials ────────────────────────────────────────────────
        const testCount = await Testimonial.countDocuments();
        if (testCount === 0) {
            await Testimonial.insertMany([
                { name: "Sarah Johnson", designation: "CEO at TechCorp", message: "Absolutely outstanding work! The project was delivered on time and exceeded all our expectations.", rating: 5, isActive: true },
                { name: "Michael Chen", designation: "Product Manager at Startup Hub", message: "Working with this team was a game changer for our product. They understood our vision perfectly.", rating: 5, isActive: true },
                { name: "Priya Patel", designation: "Founder at DesignStudio", message: "The UI/UX design they created for us is simply stunning. Users love it and our engagement metrics have gone through the roof.", rating: 5, isActive: true },
                { name: "David Williams", designation: "CTO at FinTech Ltd", message: "Exceptional technical expertise combined with great communication. The API is rock solid.", rating: 4, isActive: true },
                { name: "Emily Rodriguez", designation: "Director at MediaGroup", message: "From concept to deployment, everything was handled professionally. Highly recommend!", rating: 5, isActive: true },
                { name: "James Liu", designation: "Head of Engineering at CloudApps", message: "Top-notch code quality, thorough documentation, and great support post-launch.", rating: 4, isActive: true },
            ]);
            console.log("🌱 Testimonials seeded (6)");
        }

        // ── 4. Portfolio ───────────────────────────────────────────────────
        const portCount = await Portfolio.countDocuments();
        if (portCount === 0) {
            await Portfolio.insertMany([
                { title: "E-Commerce Platform", description: "Full-featured online shopping platform with product management, cart, Stripe payments, and admin dashboard.", category: "Web App", projectUrl: "https://github.com", technologies: ["React", "Node.js", "MongoDB", "Stripe", "Framer Motion"], isActive: true, order: 1 },
                { title: "Real-Time Chat App", description: "WhatsApp-like messaging with Socket.IO, group chats, media sharing, and read receipts.", category: "Web App", projectUrl: "https://github.com", technologies: ["React", "Socket.IO", "Express", "MongoDB"], isActive: true, order: 2 },
                { title: "Task Management Dashboard", description: "Trello-inspired drag-and-drop kanban boards with team collaboration, deadlines, and priority tagging.", category: "SaaS", projectUrl: "https://github.com", technologies: ["React", "Redux", "Node.js", "PostgreSQL"], isActive: true, order: 3 },
                { title: "Portfolio CMS", description: "Headless CMS for managing portfolio projects, blog posts, and testimonials with media uploads.", category: "CMS", projectUrl: "https://github.com", technologies: ["Next.js", "Prisma", "PostgreSQL", "AWS S3"], isActive: true, order: 4 },
                { title: "Fitness Tracker Mobile App", description: "React Native app for tracking workouts, calories, and progress with charts and social sharing.", category: "Mobile", projectUrl: "https://github.com", technologies: ["React Native", "Firebase", "Redux", "Expo"], isActive: true, order: 5 },
                { title: "AI Resume Builder", description: "AI-powered resume builder that generates professional CVs from career inputs with PDF export.", category: "AI Tool", projectUrl: "https://github.com", technologies: ["Next.js", "OpenAI API", "Tailwind CSS", "Puppeteer"], isActive: true, order: 6 },
            ]);
            console.log("🌱 Portfolio items seeded (6)");
        }

        // ── 5. About Us ────────────────────────────────────────────────
        const aboutCount = await AboutUs.countDocuments();
        if (aboutCount === 0) {
            await AboutUs.create({
                headline: "Building Digital Experiences",
                subheadline: "We craft modern, scalable web solutions tailored to your vision",
                description: "Sankalp Infotech is a passionate software development studio dedicated to building high-quality web applications. We combine cutting-edge technology with thoughtful design to deliver products that make a difference. Founded with the belief that great software can transform businesses, we work closely with our clients from concept to deployment.",
                mission: "To deliver world-class software solutions that empower businesses to grow, innovate, and succeed in the digital era.",
                vision: "A world where every business — regardless of size — has access to premium digital tools and technology.",
                values: ["Quality First", "Innovation", "Transparency", "Client Success", "Continuous Learning"],
                stats: [
                    { label: "Projects Delivered", value: "50+" },
                    { label: "Happy Clients", value: "30+" },
                    { label: "Years of Experience", value: "5+" },
                    { label: "Technologies", value: "20+" },
                ],
                team: [
                    {
                        name: "Jay Kachhadiya",
                        role: "Founder & Full-Stack Developer",
                        bio: "Passionate about building scalable web applications and clean user interfaces. Expert in React, Node.js, and MongoDB.",
                        avatar: "",
                        linkedin: "https://linkedin.com",
                        github: "https://github.com",
                    },
                    {
                        name: "Priya Sharma",
                        role: "UI/UX Designer",
                        bio: "Creates beautiful, user-centred designs with a focus on accessibility and modern aesthetics.",
                        avatar: "",
                        linkedin: "https://linkedin.com",
                        github: "",
                    },
                    {
                        name: "Rahul Patel",
                        role: "Backend Developer",
                        bio: "Specialises in API design, database optimisation, and cloud infrastructure.",
                        avatar: "",
                        linkedin: "https://linkedin.com",
                        github: "https://github.com",
                    },
                ],
                skills: ["React", "Node.js", "MongoDB", "Express", "Next.js", "PostgreSQL", "Docker", "AWS", "TypeScript", "Figma"],
                isActive: true,
            });
            console.log("🌱 About Us seeded");
        }

        // Only log the summary line if anything was actually seeded
        const total = roleCount + userCount + testCount + portCount + aboutCount;
        if (total === 0) {
            console.log("✅ Auto-seed complete — fresh database is ready!");
        }

    } catch (err) {
        console.error("❌ Auto-seed error:", err.message);
        // Don't crash the server — just log and continue
    }
};

module.exports = autoSeed;
