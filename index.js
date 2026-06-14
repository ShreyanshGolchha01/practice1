import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
const app = express();
app.use(express.json());
connectDB();
app.use(
'/auth',
authRouter
);
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})