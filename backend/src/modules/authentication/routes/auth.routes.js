import { Router } from 'express';
import AuthController from '../controller/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.post('/logout', protect, AuthController.logout);
router.get('/me', protect, AuthController.getCurrentUser);

export default router;
