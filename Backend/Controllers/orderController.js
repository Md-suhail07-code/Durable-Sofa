import mongoose from "mongoose";
import crypto from "crypto";
import { Order } from "../Models/orderModel";
import { Cart } from "../Models/cartModel";
import razorpayInstance from "../config/razorpay";

export const createOrder = async (req, res) => {
    try {
        const { products, totalPrice, tax, shipping } = req.body;
        const userId = req.user._id;

        const options = {
            amount: totalPrice * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date().now()}`,
        }

        const razorpayOrder = await razorpayInstance.orders.create(options);

        const order = new Order({
            user: userId,
            products,
            totalPrice,
            tax,
            shipping,
            status: "pending",
            razorpayOrderId: razorpayOrder.id
        });
        await order.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        })
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
            )

            return res.status(400).json({
                success: false,
                message: "Payment failed",
                order
            })
        }

        const sign = razorpayPaymentId + "|" + razorpayOrderId;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSign === razorpaySignature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId },
                { status: "Paid", razorpayPaymentId, razorpaySignature },
                { new: true }
            )

            await Cart.findOneAndUpdate({ userId: order.userId }, { items: [], totalPrice: 0 });

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                order
            })
        }

        const order = await Order.findOneAndUpdate(
            { razorpayOrderId },
            { status: "Failed" },
            { new: true }
        )

        return res.status(400).json({
            success: false,
            message: "Invalid payment signature"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify payment",
            error: error.message
        })
    }
}