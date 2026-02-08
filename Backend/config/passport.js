import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { User } from '../Models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();



const getGoogleProfilePic = (photos) => {
  if (!photos || !photos.length) return "";

  const url = photos[0].value;

  // Force high-res safely
  if (url.includes("=s")) {
    return url.replace(/=s\d+-c/, "=s400-c");
  }

  return url;
};



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const googleProfilePic = getGoogleProfilePic(profile.photos);

        let user = await User.findOne({ googleId });

        if (!user) {
          user = await User.create({
            googleId,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email,
            googleProfilePic,
            profilePic: googleProfilePic,
            authProvider: "google",
            isVerified: true,
            isLoggedIn: true,
          });
        } else {
          user.isLoggedIn = true;
          user.googleProfilePic = googleProfilePic;
          if(user.profilePic === ""){
            user.profilePic = googleProfilePic;
          }
          await user.save();
        }
        return cb(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error);
        return cb(error, null);
      }
    }
  )
);
