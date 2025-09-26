    import { Router } from "express";
    import { usersController } from "../app/controllers/users.controller.js";
    import { requiereJwtCookie, requireRole } from "../middleware/auth.middleware.js";

    const router = Router();
    router.use(requiereJwtCookie);

    router.get("/", usersController.list);
    router.get("/:id", usersController.get);
    router.post("/", requireRole("admin"), usersController.create);
    router.put("/:id", requireRole("admin"), usersController.update);
    router.delete("/:id", requireRole("admin"), usersController.remove);

    export default router;
