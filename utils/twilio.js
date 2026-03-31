const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const sendWhatsAppMessage = async (to, variables = { "1": "12/1", "2": "3pm" }) => {
    try {
        const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

        const message = await client.messages.create({
            from: process.env.TWILIO_FROM,
            contentSid: process.env.TWILIO_CONTENT_SID,
            contentVariables: JSON.stringify(variables),
            to: formattedTo
        });

        console.log(`WhatsApp message sent successfully. SID: ${message.sid}`);
        return message.sid;
    } catch (error) {
        console.error("Error sending WhatsApp message via Twilio:", error);
        throw error;
    }
};

module.exports = {
    sendWhatsAppMessage
};
