import twilio from "twilio";
import env from "../../config/env.config.js";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export const messagingService = {
    async sendSMS(to, body) {
        return await client.messages.create({
            body,
            from: env.TWILIO_FROM_SMS, 
            to,
        });
    },

    async sendWhatsApp(to, body) {
        return await client.messages.create({
            body,
            from: `whatsapp:${env.TWILIO_FROM_WAPP}`,
            to: `whatsapp:${to}`,
        });
    }
};
