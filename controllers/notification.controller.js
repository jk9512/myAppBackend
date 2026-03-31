const { sendWhatsAppMessage, sendWhatsAppMediaMessage } = require("../utils/twilio");

// @desc    Send a WhatsApp notification
// @route   POST /api/notifications/whatsapp
// @access  Private (or Public for testing purposes)
const sendWhatsApp = async (req, res, next) => {
    try {
        const { to, variables, mediaUrl, body } = req.body;

        if (!to) {
            return res.status(400).json({ success: false, message: "Recipient phone number is required" });
        }

        let sid;
        if (mediaUrl) {
            // Send media message if mediaUrl is provided
            sid = await sendWhatsAppMediaMessage(to, mediaUrl, body);
        } else {
            // Fallback to the template message
            sid = await sendWhatsAppMessage(to, variables || { "1": "12/1", "2": "3pm" });
        }

        res.status(200).json({
            success: true,
            message: "WhatsApp message sent successfully",
            messageSid: sid
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendWhatsApp
};
