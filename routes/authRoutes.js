import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
    signup,
    login,
    getme,
    refresh,
    logout,
    adminlogin,
    adminsignup
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
export default router;