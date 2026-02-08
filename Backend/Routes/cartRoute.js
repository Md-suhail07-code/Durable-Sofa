import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../Controllers/cartController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get('/get-cart', isAuthenticated, getCart);
router.post('/add-to-cart', isAuthenticated, addToCart);
router.put('/update-quantity', isAuthenticated, updateQuantity);
router.delete('/remove-item', isAuthenticated, removeFromCart);

export default router;