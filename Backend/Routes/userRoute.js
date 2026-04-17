import express from 'express';
import { allUsers, changePassword, deleteProfilePic, forgotPassword, getUserById, login, logout, register, reVerifyEmail, updateUserProfile, verifyEmail, verifyOtp } from '../Controllers/userController.js';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post('/register', register)
router.post('/verify', verifyEmail)
router.post('/reverify', reVerifyEmail)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.post('/forgotpassword', forgotPassword)
router.post('/verifyotp/:email', verifyOtp)
router.post('/changepassword/:email', changePassword)
router.get('/users', isAuthenticated, isAdmin, allUsers)
router.get('/users/me/:userId', getUserById)
router.put('/updateprofile/:userId', isAuthenticated, singleUpload, updateUserProfile)
router.delete('/deleteprofilepic/:userId', isAuthenticated, deleteProfilePic)

export default router;