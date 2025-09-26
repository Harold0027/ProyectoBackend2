import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    qty: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    unitPrice: { 
        type: Number, 
        required: true, 
        min: 0 
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    items: { 
        type: [orderItemSchema], 
        default: [] 
    },
    total: { 
        type: Number, 
        min: 0, 
        default: 0 
    },
    status: { 
        type: String, 
        enum: ["pending", "paid", "delivered", "cancelled"], 
        default: "pending", 
        index: true 
    }
}, { timestamps: true });

// 1) Calcular total en create (cubre create + validate inicial)
orderSchema.pre("validate", function (next) {
    const items = Array.isArray(this.items) ? this.items : [];
    this.total = items.reduce(
        (acc, it) => acc + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 
        0
    );
    next();
});

// 2) Calcular total en save (cubre modificaciones manuales y luego .save())
orderSchema.pre("save", function (next) {
    const items = Array.isArray(this.items) ? this.items : [];
    this.total = items.reduce(
        (acc, it) => acc + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 
        0
    );
    next();
});

// 3) Calcular total en updates cuando cambian items (cubre findOneAndUpdate, updateOne, etc)
orderSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate() || {};
    if (update.items) {
        const items = Array.isArray(update.items) ? update.items : [];
        update.total = items.reduce(
            (acc, it) => acc + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 
            0
        );
        this.setUpdate(update);
    }
    next();
});

export const Order = mongoose.model("Order", orderSchema);
