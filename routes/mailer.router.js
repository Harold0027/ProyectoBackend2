import { Router } from "express";
import { mailerController } from "../app/controllers/mailer.controller.js";

const router = Router();
router.post("/mail/welcome", mailerController.sendWelcome);
router.post("/mail/order-status", mailerController.sendOrderStatus);

export default router;
