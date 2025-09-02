import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

// Rutas
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";

// Config DB y Passport
import { connectAuto } from "./config/db/connection.js";
import { initPassport } from "./config/auth/passport.config.js";

// Middleware
import env, { validateEnv } from "./config/env.config.js";

dotenv.config();
validateEnv();

const app = express();
const PORT = env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

await connectAuto();

// Configuración de sesión con Mongo
const store = MongoStore.create({
    client: (await import("mongoose")).default.connection.getClient(),
    ttl: 60 * 60, 
});

app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: { maxAge: 60 * 60 * 1000, httpOnly: true },
    })
);

// Inicializar Passport
initPassport();
app.use(passport.initialize());

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

app.get("/", (req, res) => res.json({ message: "Backend corriendo!" }));

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
