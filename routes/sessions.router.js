import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../config/models/user.model.js";
import { requiereJwtCookie } from "../middleware/auth.middleware.js";

const router = Router();

// ------------------- LOGIN (JWT) -------------------
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: "Faltan credenciales" });

    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Cookie httpOnly
    res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hora
        sameSite: "lax",
        path: "/"
    });

    res.json({ message: "Login exitoso (JWT en cookie)" });
});

// ------------------- LOGOUT -------------------
router.post("/logout", (req, res) => {
    res.clearCookie("access_token", { path: "/" });
    res.json({ message: "Logout exitoso" });
});

// ------------------- CURRENT (datos del usuario logueado) -------------------
router.get("/current", requiereJwtCookie, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password").lean();
        if(!user) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
