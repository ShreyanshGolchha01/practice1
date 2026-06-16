import jwt from 'jsonwebtoken';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import passport from '../config/passport.js';
import {
    signup,
    login,
    getme,
    refresh,
    logout,
    adminlogin,
    adminsignup,
    uploadFile,
    uploadSingleFile
}
    from '../controllers/authController.js';

const router =
    express.Router();

router.post(
    '/signup',
    signup
);

router.post(
    '/login',
    login
);

router.get(
    '/profile',
    authMiddleware,
    (req, res) => {
        res.json(req.user);
    }
);

router.get(
    '/me',
    authMiddleware,
    getme
);

router.post(
    '/refresh',
    refresh
);

router.post(
    '/logout',
    logout
);
router.post(
    '/admin/signup',
    adminsignup
);
router.post(
    '/admin/login',
    adminlogin
);
router.get(
    '/admin/profile',
    authMiddleware,
    roleMiddleware('admin'),
    (req, res) => {
        res.json({ user: req.user, message: "Admin profile" });
    }
);
router.post(
    '/upload',
    authMiddleware,
    upload.single('file'),
    uploadSingleFile
);
router.post(
    '/uploads',
    authMiddleware,
    upload.array('files', 5),
    uploadFile
);
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const user = req.user;
        const accesstoken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        const refreshtoken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("accesstoken", accesstoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 60 * 60 * 1000 // 1 hour
        });

        res.redirect(`/profile`);
    }
);
export default router;