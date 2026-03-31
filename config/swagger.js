const swaggerJsdoc = require("swagger-jsdoc");

const servers = [
    {
        url: process.env.SERVER_URL || "http://localhost:5000",
        description: process.env.NODE_ENV === "production" ? "Production Server" : "Local Development Server",
    },
    // Always include localhost as fallback option
    ...(process.env.NODE_ENV === "production"
        ? [{ url: "http://localhost:5000", description: "Local Development Server" }]
        : []),
];

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Full-Stack API",
            version: "1.0.0",
            description: "REST API documentation for the Full-Stack Node + Express + MongoDB project",
            contact: {
                name: "Jay Kachhadiya",
            },
        },
        servers,
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token obtained from /api/auth/login",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "65f1a2b3c4d5e6f7a8b9c0d1" },
                        name: { type: "string", example: "Jay Kachhadiya" },
                        email: { type: "string", example: "jay@example.com" },
                        role: { type: "string", enum: ["user", "admin"], example: "admin" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        user: { $ref: "#/components/schemas/User" },
                    },
                },
                PaginatedUsers: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        total: { type: "integer", example: 6 },
                        page: { type: "integer", example: 1 },
                        pages: { type: "integer", example: 1 },
                        users: { type: "array", items: { $ref: "#/components/schemas/User" } },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Not authorized" },
                    },
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
