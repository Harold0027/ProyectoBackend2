import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

// Rutas
import usersRouter from "../../routes/users.router.js";
import sessionsRouter from "../../routes/session.router.js";
import ordersRouter from "../../routes/orders.router.js";
import mailerRouter from "../../routes/mailer.router.js";
import messagingRouter from "../../routes/messaging.router.js";
import hbsRouter from "../../routes/hbs.router.js";

// Config y Passport
import { connectAuto } from "../../config/db/connection.js";
import { configureHandlebars } from "../../config/handlebars.config.js";
import { initPassport } from "../../config/auth/passport.config.js";

// Middleware
import env, { validateEnv } from "../../config/env.config.js";
import { ordersService } from "../../app/services/orders.service.js";
import { toOrderDTO } from "../../app/dtos/order.dto.js"; 



dotenv.config();

const app = express();
const PORT = env.PORT || 3000;

// Necesario para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos (ej: CSS, imágenes, JS del cliente)
app.use(express.static(path.join(__dirname, "../../public")));

// Configuración de Handlebars
configureHandlebars(app);

export const startServer = async () => {
    // Validar .env
    validateEnv();

    // Conexión DB
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

    // Passport
    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    // Rutas
    app.use("/api/users", usersRouter);
    app.use("/api/session", sessionsRouter);
    app.use("/api/orders", ordersRouter);
    app.use("/api/mailer", mailerRouter);
    app.use("/api/messaging", messagingRouter); 
    // Rutas para vistas Handlebars
    app.use("/", hbsRouter);

    // Not found
    app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

    // Error handler
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    });

    // Start
    app.listen(PORT, () =>
        console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
    );
};
