import { ordersService } from "../services/orders.service.js";

export const ordersController = {
    list: async (req, res, next) => {
        try {
            res.json(await ordersService.list(req.query));
        } catch (err) { next(err); }
    },
    // Renderiza la vista con Handlebars
    listView: async (req, res, next) => {
        try {
            const { items, total, pages } = await ordersService.list(req.query);

            // Convertimos cada orden a DTO
            const ordersDTO = items.map(toOrderDTO);

            res.render("orders", {
                title: "Lista de Órdenes",
                orders: ordersDTO,
                total,
                pages,
                currentPage: Number(req.query.page) || 1
            });
        } catch (err) { next(err); }
    },
    get: async (req, res, next) => {
        try {
            res.json(await ordersService.get(req.params.id));
        } catch (err) { next(err); }
    },
    create: async (req, res, next) => {
        try {
            res.status(201).json(await ordersService.create(req.body));
        } catch (err) { next(err); }
    },
    update: async (req, res, next) => {
        try {
            res.json(await ordersService.update(req.params.id, req.body));
        } catch (err) { next(err); }
    },
    remove: async (req, res, next) => {
        try {
            await ordersService.remove(req.params.id);
            res.status(204).end();
        } catch (err) { next(err); }
    }
};
