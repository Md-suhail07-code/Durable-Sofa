import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/durable-sofa`);
        console.log("MONGODB connected successfully");
    } catch (error) {
        console.log("Error in DB connection", error);
    }
}

export default connectDB;