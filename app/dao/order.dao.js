import { BaseDAO } from "./base.dao.js";
import { User } from "../../config/models/user.model.js";

export class UserMongoDAO extends BaseDAO {
    constructor() { super(User); }

    async getByEmail(email) {
        return await this.model.findOne({ email }).lean();
    }

    async getByIdWithNoPassword(id) {
        return await this.model.findById(id).select("-password").lean();
    }

    async promoteToAdmin(userId) {
        return await this.model.findByIdAndUpdate(userId, { role: "admin" }, { new: true }).lean();
    }
}
