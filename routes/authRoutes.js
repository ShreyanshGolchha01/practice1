import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    signup,
    login,
    getme,
    refresh
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
export default router;