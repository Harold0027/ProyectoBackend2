import { Router } from "express";
import { messagingController } from "../app/controllers/messaging.controller.js";

const router = Router();
router.post("/sms", messagingController.sendSMS);
router.post("/whatsapp", messagingController.sendWhatsApp);

export default router;
