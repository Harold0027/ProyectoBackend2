import { mailerService } from "../services/mailer.service.js";
import nodemailer from "nodemailer";

export const mailerController = {
    sendWelcome: async (req, res, next) => {
        // try {
        //     await mailerService.send({
        //         to: req.body.email,
        //         subject: "Bienvenido a Ecommerce",
        //         template: "welcome",
        //         context: { name: req.body.name }
        //     });
        //     res.json({ message: "Email enviado" });
        // } catch (err) { next(err); }
        try {
            const info = await mailerService.send({
                to: req.body.email,
                subject: "Bienvenido a Ecommerce",
                template: "welcome",
                context: { name: req.body.name }
            });

            const previewUrl = nodemailer.getTestMessageUrl(info);
            res.json({ message: "Email enviado", previewUrl });
        } catch (err) { next(err); }
    },
    sendOrderStatus: async (req, res, next) => {
        try {
            await mailerService.send({
                to: req.body.email,
                subject: `Estado de tu orden ${req.body.code}`,
                template: "order-status",
            });
            res.json({ message: "Notificación enviada" });
        } catch (err) { next(err); }
    }
};
