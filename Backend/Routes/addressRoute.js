import express from "express";
import { addAddress, deleteAddress, getAddresses, getDefaultAddress, updateAddress } from "../Controllers/addressController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js"

const router = express.Router();

router.post("/add", isAuthenticated, addAddress)
router.get("/getAllAddresses", isAuthenticated, getAddresses)
router.put("/update/:id", isAuthenticated, updateAddress)
router.get("/getDefaultAddress", isAuthenticated, getDefaultAddress)
router.delete("/delete/:id", isAuthenticated, deleteAddress)


export default router;