import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import env from "../../config/env.config.js";
import { usersService } from "../services/users.service.js";

const sessionsController = {
    register: async (req, res, next) => {
        try {
            const user = await usersService.create(req.body);
            res.status(201).json(user);
        } catch (err) { next(err); }
    },

    login: async (req, res, next) => {
        try {
            const user = await usersService.getByEmail(req.body.email);
            if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

            const valid = await bcrypt.compare(req.body.password, user.password);
            if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

            const token = jwt.sign(
                { id: user._id, role: user.role },
                env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie("jwt", token, { httpOnly: true }).json({ token });
        } catch (err) { next(err); }
    },

    me: async (req, res) => {
        res.json(req.user);
    },

    logout: (req, res) => {
        res.clearCookie("jwt").json({ message: "Logout exitoso" });
    }
};

export default sessionsController;