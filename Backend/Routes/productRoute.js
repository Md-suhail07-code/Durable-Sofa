import express from "express"
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../Controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post('/add', isAuthenticated, isAdmin, multipleUpload, addProduct)
router.get('/get-products', getAllProducts)
router.get('/getProduct/:_id', getProduct)
router.delete('/delete-products/:productId', isAuthenticated, isAdmin, deleteProduct)
router.put('/update-products/:productId', isAuthenticated, isAdmin, multipleUpload, updateProduct)

export default router