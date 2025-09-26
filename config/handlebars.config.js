import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configura Handlebars como motor de plantillas en la app de Express
 * @param {Express.Application} app
 */
export const configureHandlebars = (app) => {
  app.engine(
    "handlebars",
    exphbs.engine({
      layoutsDir: path.join(__dirname, "../views/layout"),
      defaultLayout: "main",
      extname: ".handlebars",
      helpers: {
        multiply: (a, b) => (a && b ? (a * b).toFixed(2) : 0),
        formatCurrency: (value) =>
          value ? `$${Number(value).toFixed(2)}` : "$0.00",
        eq: (a, b) => a === b
      },
    })
  );

  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "../views"));
};
