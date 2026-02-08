import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Database/db.js';
import userRoute from './Routes/userRoute.js';
import authRoute from './Routes/authRoute.js';
import productRoute from './Routes/productRoute.js'
import cartRoute from './Routes/cartRoute.js';
import './config/passport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/auth',authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);

// http://localhost:5000/api/users/register

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at PORT : ${PORT}`);
});