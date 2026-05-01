import express from "express";
import { createOrder, verifyPayment } from "../Controllers/orderController.js";
import { isAuthenticated } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, createOrder);
router.post("/verify", isAuthenticated, verifyPayment);

export default router;