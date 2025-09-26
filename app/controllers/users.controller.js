// app/controllers/users.controller.js
import { usersService } from "../services/users.service.js";

export const usersController = {
    list: async (req, res, next) => {
        try {
            res.json(await usersService.list());
        } catch (err) { next(err); }
    },
    get: async (req, res, next) => {
        try {
            res.json(await usersService.get(req.params.id));
        } catch (err) { next(err); }
    },
    create: async (req, res, next) => {
        try {
            res.status(201).json(await usersService.create(req.body));
        } catch (err) { next(err); }
    },
    update: async (req, res, next) => {
        try {
            res.json(await usersService.update(req.params.id, req.body));
        } catch (err) { next(err); }
    },
    remove: async (req, res, next) => {
        try {
            await usersService.remove(req.params.id);
            res.status(204).end();
        } catch (err) { next(err); }
    },
};
