// app/services/users.service.js
import { UserMongoDAO } from "../dao/user.mongo.dao.js";
import { toUserDTO } from "../dtos/user.dto.js";
import bcrypt from "bcrypt";

const userDAO = new UserMongoDAO();

export const usersService = {
    async list() {
        const users = await userDAO.getAll();
        return users.map(toUserDTO);
    },

    async get(id) {
        const user = await userDAO.getByIdWithNoPassword(id);
        return toUserDTO(user);
    },

    async create(data) {
        const hashed = await bcrypt.hash(data.password, 10);
        const newUser = await userDAO.create({ ...data, password: hashed });
        return toUserDTO(newUser);
    },

    async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const updated = await userDAO.updateById(id, data);
        return toUserDTO(updated);
    },

    async remove(id) {
        return await userDAO.deleteById(id);
    },

    async promoteToAdmin(id) {
        const promoted = await userDAO.promoteToAdmin(id);
        return toUserDTO(promoted);
    },

    async getByEmail(email) {
        return await userDAO.getByEmail(email);
    }
};
