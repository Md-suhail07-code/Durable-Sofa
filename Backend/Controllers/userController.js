import { User } from "../Models/userModel.js";
import { Session } from "../Models/sessionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { verifyMail } from "../emailVerify/verifyMail.js";
import { sendOtp } from "../emailVerify/sendOtp.js";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        verifyMail(token, email);
        newUser.token = token;
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            })
        }

        const token = authHeader.split(" ")[1]; // [Bearer token]
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    success: false,
                    message: "Token has expired"
                });
            }
            res.status(500).json({
                success: false,
                message: "Email verification failed",
                error: error.message
            })
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        user.isVerified = true;
        user.token = null;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Email verification failed",
            error: error.message
        })
    }
}

export const reVerifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        verifyMail(token, email);
        user.token = token;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Verification email sent again successfully",
            token: token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Re-verification failed",
            error: error.message
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized Access"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Verify Your Email to Login"
            });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        user.isLoggedIn = true;
        await user.save();

        const existingSession = await Session.findOne({ user: user._id });
        if (existingSession) {
            await Session.deleteOne({ user: user._id });
        }

        await Session.create({ user: user._id });

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed", error: error.message
        });
    }
}

export const logout = async (req, res) => {
    try {
        const userId = req.userId;
        await Session.deleteMany({ user: userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed", error: error.message
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        sendOtp(otp, email);
        return res.status(200).json({
            success: true,
            message: "OTP sent to your email Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const { email } = req.params;
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP request a new one"
            })
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email } = req.params;
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password -otp -otpExpiry -token');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userIdToUpdate = req.params.userId;
        const loggedInUser = req.user;

        const {
            firstName,
            lastName,
            phoneNo,
            address,
            city,
            pincode
        } = req.body || {};

        if (
            userIdToUpdate !== loggedInUser._id.toString() &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile",
            });
        }

        const user = await User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "profile_pics" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });

            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        user.firstName = firstName ?? user.firstName;
        user.lastName = lastName ?? user.lastName;
        user.phoneNo = phoneNo ?? user.phoneNo;
        user.address = address ?? user.address;
        user.city = city ?? user.city;
        user.pincode = pincode ?? user.pincode;
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export const deleteProfilePic = async (req, res) => {
    try {
        const userIdToUpdate = req.params.userId;
        const loggedInUser = req.user;

        if (userIdToUpdate !== loggedInUser._id.toString() && loggedInUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own profile picture"
            })
        }

        const user = await User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(!user.profilePicPublicId){
            return res.status(400).json({
                success: false,
                message: "No profile picture to delete"
            })
        }

        if (user.profilePicPublicId) {
            await cloudinary.uploader.destroy(user.profilePicPublicId);
        }
        user.profilePic = null;
        user.profilePicPublicId = null;
        await user.save();
        res.status(200).json({
            success: true,
            user,
            message: "Profile picture deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
}