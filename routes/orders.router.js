import { Router } from "express";
import { ordersController } from "../app/controllers/orders.controller.js";
import { requiereJwtCookie, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requiereJwtCookie);

router.get("/", ordersController.list);
router.get("/:id", ordersController.get);
router.post("/", requireRole("user"), ordersController.create);
router.put("/:id", requireRole("admin"), ordersController.update);
router.delete("/:id", requireRole("admin"), ordersController.remove);

export default router;
