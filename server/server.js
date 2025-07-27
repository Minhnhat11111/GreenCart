import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

import reviewRouter from './routes/reviewRoute.js'
import couponRouter from './routes/couponRoute.js'
const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS setup: trước mọi thứ
const allowedOrigins = [
  'http://localhost:5173',
  'https://green-cart-dusky-five.vercel.app',
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // cho phép gửi cookie
}));

// ✅ Body parser
app.use(express.json());
app.use(cookieParser());

// ✅ Stripe webhook phải được raw
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ DB và Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Routes
app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/orders', orderRouter);

app.use('/api/review', reviewRouter)
app.use('/api/coupon', couponRouter)
app.listen(port, () => console.log('Server started on PORT : ' + port))
