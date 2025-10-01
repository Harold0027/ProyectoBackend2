import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildTransport() {
    // Crear cuenta de prueba en Ethereal automáticamente
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
}

async function renderTemplate(templateName, data) {
    const viewDir = path.join(__dirname, "../../views/emails");
    const filePath = path.join(viewDir, `${templateName}.handlebars`);
    const source = await fs.readFile(filePath, "utf-8");
    const tpl = Handlebars.compile(source);
    return tpl(data || {});
}

export class MailerService {
    async send({ to, subject, template, context = {} }) {
        if (!to || !subject || !template) throw new Error("Faltan campos");

        const transport = await buildTransport();
        const html = await renderTemplate(template, context);

        const info = await transport.sendMail({
            from: "Ecommerce <no-reply@example.com>", // o SMTP_FROM si tienes
            to,
            subject,
            html,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);

        return { ...info, previewUrl };
    }
}

export const mailerService = new MailerService();
