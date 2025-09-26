import { usersService } from "../services/users.service.js";
import { ordersService } from "../services/orders.service.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const hbsController = {

  // GET Login
  loginView: (req, res) => {
    res.render("session/login", {
      title: "Login",
      error: req.query.error,
      success: req.query.success,
    });
  },

  // POST Login
  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await usersService.getByEmail(email);
      if (!user) return res.redirect("/login?error=Usuario no encontrado");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.redirect("/login?error=Contraseña incorrecta");

      req.session.user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      };

      res.redirect("/?success=Bienvenido " + user.first_name);
    } catch (err) {
      res.redirect("/login?error=Error al iniciar sesión");
    }
  },

  // GET Register
  registerView: (req, res) => {
    res.render("session/register", {
      title: "Registro",
      error: req.query.error,
      success: req.query.success,
    });
  },

  // POST Register
  postRegister: async (req, res) => {
    try {
      const { first_name, last_name, email, password, age } = req.body;
      const existing = await usersService.getByEmail(email);
      if (existing) return res.redirect("/register?error=Email ya registrado");

      await usersService.create({ first_name, last_name, email, password, age });
      res.redirect("/login?success=Usuario registrado correctamente, ingresa tus datos");
    } catch (err) {
      res.redirect("/register?error=Error al registrar usuario");
    }
  },

  // POST Logout
  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) return res.redirect("/?error=No se pudo cerrar sesión");
      res.clearCookie("connect.sid");
      res.redirect("/login?success=Sesión cerrada correctamente");
    });
  },

  // GET Home / Mis órdenes
  homeView: async (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect("/login?error=Debes iniciar sesión");

    const rawOrders = await ordersService.list({ buyer: user.id });

    res.render("orders/index", {
      title: "Mis Órdenes",
      user,
      orders: rawOrders,
      success: req.query.success,
      error: req.query.error,
    });
  },

  // GET Crear orden
  createOrderView: [
    (req, res) => {
      res.render("orders/create", {
        title: "Crear Orden",
        user: req.session.user,
        error: req.query.error,
        success: req.query.success,
      });
    }
  ],

  // POST Crear orden
  createOrder: [
    async (req, res) => {
      try {
        const user = req.session.user;
        if (!user) return res.redirect("/login?error=Debes iniciar sesión");

        let { items } = req.body;

        // Normalizar items en array si viene como objeto
        if (items && typeof items === "object" && !Array.isArray(items)) {
          items = Object.values(items);
        }

        // Validar y convertir cada item
        items = (items || []).map((i) => {
          if (!i.productId || !mongoose.Types.ObjectId.isValid(i.productId)) {
            throw new Error(`ProductId inválido: ${i.productId}`);
          }
          return {
            productId: new mongoose.Types.ObjectId(i.productId),
            title: i.title,
            qty: parseInt(i.qty, 10),
            unitPrice: parseFloat(i.unitPrice),
          };
        });

        if (!items.length) {
          return res.redirect("/orders/create?error=Debes ingresar al menos un producto");
        }

        // Convertir buyer a ObjectId también
        await ordersService.create({
          buyer: new mongoose.Types.ObjectId(user.id),
          items,
        });

        res.redirect("/?success=Orden creada correctamente");
      } catch (err) {
        console.error("Error al crear orden:", err);
        res.redirect("/orders/create?error=" + encodeURIComponent(err.message));
      }
    },
  ],
};