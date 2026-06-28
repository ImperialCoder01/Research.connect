import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { createOTP, verifyOTP } from '../services/otp.service.js';
import OTP from '../models/OTP.js';
import {
  sendRegistrationOTPEmail,
  sendLoginOTPEmail,
  sendForgotPasswordOTPEmail,
  sendAccountActivatedEmail,
  sendPasswordChangedEmail,
} from '../services/email.service.js';
import AppError from '../utils/AppError.js';

/**
 * Sign JWT Access Token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

/**
 * Sign JWT Refresh Token
 */
const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Helper to set cookies and send token response
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('token', token, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Hide password
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
};

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role, designation, institution, country } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email is already in use by another account.', 400));
    }

    // 2. Create the user (status defaults to pending_verification, emailVerified defaults to false)
    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'researcher',
      designation: designation || '',
      institution: institution || '',
      country: country || '',
      emailVerified: false,
      status: 'pending_verification',
    });

    // 3. Generate and send email verification OTP
    const otp = await createOTP(user._id, 'EMAIL_VERIFICATION');
    await sendRegistrationOTPEmail(user.email, otp);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. A 6-digit verification code has been sent to your email.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify email verification OTP
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or verification code.', 400));
    }

    if (user.emailVerified) {
      return res.status(200).json({
        status: 'success',
        message: 'Email is already verified. You can log in.',
      });
    }

    // 2. Verify OTP (throws error if invalid/expired/attempts exceeded)
    await verifyOTP(user._id, 'EMAIL_VERIFICATION', otp);

    // 3. Activate user
    user.emailVerified = true;
    user.isVerified = true;
    user.status = 'active';
    await user.save();

    // 4. Send confirmation email
    await sendAccountActivatedEmail(user.email, user.fullName);

    res.status(200).json({
      status: 'success',
      message: 'Your email has been successfully verified. You can now log in.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Resend email verification OTP
 */
export const sendEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    if (user.emailVerified) {
      return next(new AppError('Email is already verified.', 400));
    }

    // Check cooldown (60 seconds)
    const lastOtp = await OTP.findOne({ userId: user._id, purpose: 'EMAIL_VERIFICATION' }).sort({ createdAt: -1 });
    if (lastOtp && (Date.now() - lastOtp.createdAt.getTime() < 60000)) {
      const secondsLeft = Math.ceil((60000 - (Date.now() - lastOtp.createdAt.getTime())) / 1000);
      return next(new AppError(`Please wait ${secondsLeft} seconds before requesting a new code.`, 429));
    }

    const otp = await createOTP(user._id, 'EMAIL_VERIFICATION');
    await sendRegistrationOTPEmail(user.email, otp);

    res.status(200).json({
      status: 'success',
      message: 'A new verification code has been sent to your email.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user (step 1: verify credentials, send OTP)
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    // 2. Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return next(
        new AppError(`This account is temporarily locked. Please try again in ${minutesLeft} minutes.`, 401)
      );
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
        user.loginAttempts = 0;
        await user.save();
        return next(
          new AppError('Too many failed login attempts. Your account has been locked for 15 minutes.', 401)
        );
      }
      await user.save();
      return next(new AppError('Invalid email or password.', 401));
    }

    // Reset login attempts on successful credentials match
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // 4. Check if email is verified
    if (!user.emailVerified) {
      // Send registration verification OTP and inform frontend
      const otp = await createOTP(user._id, 'EMAIL_VERIFICATION');
      await sendRegistrationOTPEmail(user.email, otp);

      return res.status(200).json({
        status: 'success',
        emailVerified: false,
        message: 'Your email is not verified yet. A verification code has been sent to your email.',
      });
    }

    // 5. Generate and send Login OTP
    const otp = await createOTP(user._id, 'LOGIN');
    await sendLoginOTPEmail(user.email, otp);

    res.status(200).json({
      status: 'success',
      emailVerified: true,
      otpRequired: true,
      message: 'A 2-factor verification code has been sent to your email.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify Login OTP and issue JWT
 */
export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or verification code.', 401));
    }

    // Verify OTP
    await verifyOTP(user._id, 'LOGIN', otp);

    // Save last login time
    user.lastLogin = Date.now();
    await user.save();

    // Issue JWT and send response
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * Resend login or registration OTP
 */
export const resendLoginOtp = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    // Check cooldown (60 seconds)
    const lastOtp = await OTP.findOne({ userId: user._id, purpose }).sort({ createdAt: -1 });
    if (lastOtp && (Date.now() - lastOtp.createdAt.getTime() < 60000)) {
      const secondsLeft = Math.ceil((60000 - (Date.now() - lastOtp.createdAt.getTime())) / 1000);
      return next(new AppError(`Please wait ${secondsLeft} seconds before requesting a new code.`, 429));
    }

    // Generate new OTP
    const otp = await createOTP(user._id, purpose);

    // Send email according to purpose
    if (purpose === 'LOGIN') {
      await sendLoginOTPEmail(user.email, otp);
    } else if (purpose === 'EMAIL_VERIFICATION') {
      await sendRegistrationOTPEmail(user.email, otp);
    } else if (purpose === 'PASSWORD_RESET') {
      await sendForgotPasswordOTPEmail(user.email, otp);
    }

    res.status(200).json({
      status: 'success',
      message: 'A new verification code has been sent to your email.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Forgot password (step 1: send reset OTP)
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // To prevent email enumeration, we return success even if email is not found
    const user = await User.findOne({ email });
    if (user) {
      const otp = await createOTP(user._id, 'PASSWORD_RESET');
      await sendForgotPasswordOTPEmail(user.email, otp);
    }

    res.status(200).json({
      status: 'success',
      message: 'If the email exists in our system, a password reset code has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify reset password OTP and return a temporary reset token
 */
export const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or verification code.', 400));
    }

    // Verify OTP
    await verifyOTP(user._id, 'PASSWORD_RESET', otp);

    // Generate a short-lived password reset token (valid for 5 minutes)
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    res.status(200).json({
      status: 'success',
      token: resetToken,
      message: 'Verification code accepted. You can now reset your password.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset password using the temporary reset token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      return next(new AppError('Your reset session has expired. Please request a new code.', 400));
    }

    if (decoded.id !== user._id.toString() || decoded.purpose !== 'password_reset') {
      return next(new AppError('Invalid reset token.', 400));
    }

    // Update password
    user.password = password;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Send confirmation email
    await sendPasswordChangedEmail(user.email);

    res.status(200).json({
      status: 'success',
      message: 'Your password has been reset successfully. You can now log in.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Logout user
 */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Google Sign-In / Sign-Up
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return next(new AppError('Google ID Token is required.', 400));
    }

    // 1. Verify token with Google using built-in fetch
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const response = await fetch(googleVerifyUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google tokeninfo verification failed:', errorText);
      return next(new AppError('Failed to verify Google token.', 401));
    }
    
    const payload = await response.json();

    // Verify client ID matches
    const expectedClientId = process.env.GOOGLE_CLIENT_ID || '959595325668-e5dlgoecao8lvo5k38plolvgv9ua2du1.apps.googleusercontent.com';
    if (payload.aud !== expectedClientId) {
      return next(new AppError('Invalid Google Client ID aud.', 400));
    }

    const { email, name, picture, sub, email_verified } = payload;
    if (!email_verified) {
      return next(new AppError('Google email is not verified.', 400));
    }

    // 2. Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create user with a secure random password
      const randomPassword = crypto.randomBytes(16).toString('hex') + 'Aa1!';
      user = await User.create({
        fullName: name,
        email,
        password: randomPassword,
        googleId: sub,
        profilePhoto: picture || '',
        emailVerified: true,
        isVerified: true,
        status: 'active',
      });
    } else {
      // Update googleId and verify status if not set
      let updated = false;
      if (!user.googleId) {
        user.googleId = sub;
        updated = true;
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
        user.isVerified = true;
        user.status = 'active';
        updated = true;
      }
      if (picture && !user.profilePhoto) {
        user.profilePhoto = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    // 3. Issue JWT directly (bypassing OTP since Google is verified)
    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    return next(new AppError('Failed to authenticate with Google.', 401));
  }
};

/**
 * Get current logged in user details
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
