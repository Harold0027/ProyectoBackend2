import { Router } from "express";
import { hbsController } from "../app/controllers/hbs.controller.js";

const router = Router();

// Registro/Login HBS
router.get("/login", hbsController.loginView);
router.post("/login", hbsController.postLogin);

router.get("/register", hbsController.registerView);
router.post("/register", hbsController.postRegister);

// Logout
router.post("/logout", hbsController.logout);

// Rutas protegidas
router.get("/", hbsController.homeView); 
router.get("/orders/create", hbsController.createOrderView);
router.post("/orders/create", hbsController.createOrder);

export default router;
