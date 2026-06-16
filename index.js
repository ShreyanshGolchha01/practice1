import './config/env.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import passport from './config/passport.js';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());
connectDB();
app.use(
    '/auth',
    authRouter
);

app.use((req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
});

app.use(
    errorMiddleware
);
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
})