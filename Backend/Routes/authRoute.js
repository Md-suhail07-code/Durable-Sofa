import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get('/google/callback-test', (req, res) => {
  res.send('CALLBACK ROUTE WORKS');
});


router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.redirect(
        `${process.env.CLIENT_URL}/auth-success?token=${token}`
      );
    } catch (error) {
      console.log("Google Auth Callback Error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=googleFailed`);
    }
  }
);


router.get('/me', isAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;