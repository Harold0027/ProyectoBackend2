import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../config/models/user.model.js";
import { requiereJwtCookie, requireRole } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        if (!first_name || !last_name || !email || !password || !age) 
            return res.status(400).json({ error: "Datos incompletos" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "Email ya registrado" });

        const hash = bcrypt.hashSync(password, 10);
        const userRole = role || "user";
        const user = await User.create({ first_name, last_name, email, age, password: hash, role: userRole });

        const userSafe = user.toObject();
        delete userSafe.password;
        res.status(201).json({ message: "Usuario creado", user: userSafe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LISTAR TODOS LOS USUARIOS (admin) 
router.get("/", requiereJwtCookie, requireRole("admin"), async (req, res) => {
    try {
        const users = await User.find().select("-password").lean();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET :ID
router.get("/:id", requiereJwtCookie, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ error: "ID inválido" });

        const user = await User.findById(id).select("-password").lean();
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        // Solo admin o el propio usuario
        if (req.user.role !== "admin" && req.user._id !== user._id.toString()) {
            return res.status(403).json({ error: "Prohibido el paso" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put("/:id", requiereJwtCookie, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, age, password, role } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ error: "ID inválido" });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        // Solo admin o el propio usuario
        if (req.user.role !== "admin" && req.user._id !== user._id.toString()) {
            return res.status(403).json({ error: "Prohibido el paso" });
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;

        if (email && email !== user.email) {
            const exists = await User.findOne({ email });
            if (exists) return res.status(400).json({ error: "Email ya registrado" });
            user.email = email;
        }

        if (age) user.age = age;
        if (password) user.password = bcrypt.hashSync(password, 10);
        if (role && req.user.role === "admin") user.role = role; // solo admin puede cambiar rol

        await user.save();

        const userSafe = user.toObject();
        delete userSafe.password;
        res.json({ message: "Usuario actualizado", user: userSafe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE 
router.delete("/:id", requiereJwtCookie, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ error: "ID inválido" });

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
