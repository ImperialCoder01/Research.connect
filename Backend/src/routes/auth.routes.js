import { Router } from 'express';
import {
  register,
  login,
  googleLogin,
  verifyEmail,
  sendEmailVerification,
  verifyLoginOtp,
  resendLoginOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  logout,
  getMe,
} from '../controllers/auth.controller.js';
import {
  validateRegister,
  validateLogin,
  validateOTP,
  validateForgotPassword,
  validateResetPassword,
  validateResendOTP,
} from '../validations/auth.validation.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/google-login', googleLogin);
router.post('/verify-email', validateOTP, verifyEmail);
router.post('/send-email-verification', validateResendOTP, sendEmailVerification);
router.post('/verify-login-otp', validateOTP, verifyLoginOtp);
router.post('/resend-login-otp', validateResendOTP, resendLoginOtp);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/verify-reset-otp', validateOTP, verifyResetOtp);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
