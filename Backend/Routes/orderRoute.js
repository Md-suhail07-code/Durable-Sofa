import express from "express";
import { createOrder, getAllOrders, getMyOrders, getUserOrders, verifyPayment } from "../Controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createOrder);
router.post("/verify", isAuthenticated, verifyPayment);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/user-orders/:userId", isAuthenticated, isAdmin, getUserOrders);
router.get("/all-orders", isAuthenticated, isAdmin, getAllOrders);

export default router;
