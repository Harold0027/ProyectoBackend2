import { Router } from "express";
import { requiereJwtCookie } from "../middleware/auth.middleware.js";
import sessionController from "../app/controllers/session.controller.js"

const router = Router();
// router.use(requiereJwtCookie);

router.post("/register", sessionController.register)
router.post("/jwt/login", sessionController.login)
router.post("/jwt/logout", sessionController.logout)
router.get("/jwt/me",requiereJwtCookie, sessionController.me);

export default router;
