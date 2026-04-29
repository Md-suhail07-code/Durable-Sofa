import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);