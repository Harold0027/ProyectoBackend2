// app/controllers/messaging.controller.js
import { messagingService } from "../services/messaging.service.js";

export const messagingController = {
    sendSMS: async (req, res, next) => {
        try {
            await messagingService.sendSMS(req.body.to, req.body.body);
            res.json({ message: "SMS enviado" });
        } catch (err) { next(err); }
    },
    sendWhatsApp: async (req, res, next) => {
        try {
            await messagingService.sendWhatsApp(req.body.to, req.body.body);
            res.json({ message: "WhatsApp enviado" });
        } catch (err) { next(err); }
    }
};
