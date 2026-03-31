const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res, next) => {
    try {
        const { prompt, history = [] } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({
                success: false,
                message: "AI service is not configured. Please add GEMINI_API_KEY to your server/.env file.",
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const formattedHistory = [];
        let expectedRole = "user";

        for (const msg of history) {
            const role = msg.isMe ? "user" : "model";
            if (role === expectedRole) {
                formattedHistory.push({
                    role,
                    parts: [{ text: msg.text || "" }],
                });
                expectedRole = role === "user" ? "model" : "user";
            }
        }

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("AI response timed out. Please check your API Key or network connection.")), 60000)
        );

        const result = await Promise.race([
            chat.sendMessage(prompt),
            timeoutPromise
        ]);

        const responseText = result.response.text();

        res.status(200).json({
            success: true,
            reply: responseText,
        });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to communicate with AI Assistant. Please try again later.",
        });
    }
};

module.exports = { chatWithAI };
