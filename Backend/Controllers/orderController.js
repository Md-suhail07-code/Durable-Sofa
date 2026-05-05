import crypto from "crypto";
import { Order } from "../Models/orderModel.js";
import { Cart } from "../Models/cartModel.js";
import razorpayInstance from "../config/razorpay.js";

export const createOrder = async (req, res) => {
    try {
        const { products, totalPrice, tax, shipping, addressId } = req.body;
        const userId = req.userId;

        const options = {
            amount: Math.round(totalPrice * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        const order = new Order({
            userId,
            products,
            totalPrice,
            tax,
            shipping,
            addressId,
            status: "pending",
            razorpayOrderId: razorpayOrder.id
        });
        await order.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentFailure } = req.body;

        if (paymentFailure) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId },
                { status: "Failed" },
                { new: true }
            );

            return res.status(400).json({
                success: false,
                message: "Payment failed",
                order
            });
        }

        const sign = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSign === razorpaySignature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId },
                { status: "Paid", razorpayPaymentId, razorpaySignature },
                { new: true }
            );

            await Cart.findOneAndUpdate({ userId: req.userId }, { items: [], totalPrice: 0 });

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                order
            });
        }

        const order = await Order.findOneAndUpdate(
            { razorpayOrderId },
            { status: "Failed" },
            { new: true }
        );

        return res.status(400).json({
            success: false,
            message: "Invalid payment signature"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify payment",
            error: error.message
        });
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .populate("products.productID")
        .populate("addressId");
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .populate("products.productID", "name basePrice productImages")
        .populate("userId", "firtsName lastName email");
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message
        });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("products.productID", "name basePrice productImages")
        .populate("userId", "firtsName lastName email");
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}