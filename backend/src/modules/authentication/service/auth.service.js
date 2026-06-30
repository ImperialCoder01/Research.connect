import crypto from 'crypto';
import AuthRepository from '../repository/auth.repository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../helper/token.helper.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../helper/email.helper.js';

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 400;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create User
    const user = await AuthRepository.createUser({
      firstName,
      lastName,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
    });

    // Create empty profile for the researcher
    await AuthRepository.createProfile({
      user: user._id,
    });

    // Send verification email (don't await or block, let it run in background and handle error gracefully)
    sendVerificationEmail(user.email, verificationToken).catch((err) => {
      console.error('Failed to send verification email:', err);
    });

    return user;
  }

  async login(email, password) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async refresh(token) {
    if (!token) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      error.code = 'REFRESH_TOKEN_REQUIRED';
      throw error;
    }

    try {
      const decoded = verifyRefreshToken(token);
      const user = await AuthRepository.findById(decoded.id);

      if (!user || user.refreshToken !== token) {
        const error = new Error('Invalid or expired refresh token');
        error.statusCode = 401;
        error.code = 'INVALID_REFRESH_TOKEN';
        throw error;
      }

      // Generate new tokens
      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      // Update refresh token in DB
      user.refreshToken = newRefreshToken;
      await user.save();

      return { user, accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_REFRESH_TOKEN';
      throw error;
    }
  }

  async verifyEmail(token) {
    const user = await AuthRepository.findByVerificationToken(token);
    if (!user) {
      const error = new Error('Verification token is invalid or has expired');
      error.statusCode = 400;
      error.code = 'INVALID_VERIFICATION_TOKEN';
      throw error;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return user;
  }

  async forgotPassword(email) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      // Return true even if user doesn't exist to prevent email enumeration
      return true;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    await user.save();

    sendPasswordResetEmail(user.email, resetToken).catch((err) => {
      console.error('Failed to send password reset email:', err);
    });

    return true;
  }

  async resetPassword(token, password) {
    const user = await AuthRepository.findByResetToken(token);
    if (!user) {
      const error = new Error('Password reset token is invalid or has expired');
      error.statusCode = 400;
      error.code = 'INVALID_RESET_TOKEN';
      throw error;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Clear refresh token to force re-login on all devices after password change
    user.refreshToken = undefined;
    await user.save();

    return true;
  }

  async logout(userId) {
    const user = await AuthRepository.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    return true;
  }
}

export default new AuthService();
