// app/services/orders.service.js
import { OrderMongoDAO } from "../dao/order.mongo.dao.js";
import { toOrderDTO } from "../dtos/order.dto.js";

const orderDAO = new OrderMongoDAO(); 

export const ordersService = {
    async list(query = {}) {
        const orders = await orderDAO.listAll(query);
        return (orders || []).map(toOrderDTO); 
    },

    async listPaginated(opts) {
        const result = await orderDAO.listPaginated(opts);
        return { ...result, items: result.items.map(toOrderDTO) };
    },

    async get(id) {
        const order = await orderDAO.getById(id);
        return toOrderDTO(order);
    },

    async create(data) {
        const lastOrder = await orderDAO.model.findOne().sort({ createdAt: -1 });
        const lastCode = lastOrder ? parseInt(lastOrder.code.replace("ORD", "")) : 0;
        data.code = "ORD" + String(lastCode + 1).padStart(3, "0");
        const newOrder = await orderDAO.create(data);
        return toOrderDTO(newOrder);
    },

    async update(id, data) {
        const updated = await orderDAO.updateById(id, data);
        return toOrderDTO(updated);
    },

    async remove(id) {
        return await orderDAO.deleteById(id);
    },

    async getByCode(code) {
        const order = await orderDAO.getByCode(code);
        return toOrderDTO(order);
    }
};
