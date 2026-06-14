import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();
app.use(
'/auth',
authRouter
);
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
})