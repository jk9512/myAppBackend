require('dotenv').config();
const { sendWhatsAppMessage, sendWhatsAppMediaMessage } = require('./utils/twilio');

const testTwilio = async () => {
    try {
        console.log("Attempting to send test WhatsApp template message...");
        const sidTemplate = await sendWhatsAppMessage('+919512746758', { "1": "12/1", "2": "3pm" });
        console.log(`Template test passed. Message SID: ${sidTemplate}`);

        console.log("Attempting to send test WhatsApp media message...");
        const sidMedia = await sendWhatsAppMediaMessage(
            '+919512746758',
            'https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf',
            'Here is your invoice.'
        );
        console.log(`Media test passed. Message SID: ${sidMedia}`);

    } catch (err) {
        console.error("Test failed:", err);
    }
};

testTwilio();
