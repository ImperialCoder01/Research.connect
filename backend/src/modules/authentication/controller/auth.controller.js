import AuthService from '../service/auth.service.js';
import { UserDTO } from '../dto/user.dto.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validator/auth.validator.js';

// Helper to set refresh token cookie
const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  res.cookie('refreshToken', token, cookieOptions);
};

// Helper to clear refresh token cookie
const clearRefreshTokenCookie = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
  res.clearCookie('refreshToken', cookieOptions);
};

class AuthController {
  register = async (req, res, next) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await AuthService.register(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          user: UserDTO.toResponse(user),
        },
        error: null,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
          },
        });
      }
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await AuthService.login(
        validatedData.email,
        validatedData.password
      );

      // Set refresh token in httpOnly cookie
      setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          user: UserDTO.toResponse(user),
          accessToken,
        },
        error: null,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
          },
        });
      }
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      // Get refresh token from cookie or request body
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const { user, accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(token);

      // Set new refresh token in cookie
      setRefreshTokenCookie(res, newRefreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: UserDTO.toResponse(user),
          accessToken,
        },
        error: null,
      });
    } catch (error) {
      // Clear cookie on refresh failure to clean up stale states
      clearRefreshTokenCookie(res);
      next(error);
    }
  };

  verifyEmail = async (req, res, next) => {
    try {
      const { token } = verifyEmailSchema.parse({ token: req.query.token || req.body.token });
      const user = await AuthService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: {
          user: UserDTO.toResponse(user),
        },
        error: null,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
          },
        });
      }
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      await AuthService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
        data: {},
        error: null,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
          },
        });
      }
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. Please log in with your new password.',
        data: {},
        error: null,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
          },
        });
      }
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (userId) {
        await AuthService.logout(userId);
      }
      
      clearRefreshTokenCookie(res);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: {},
        error: null,
      });
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req, res, next) => {
    try {
      // The user is already attached by the auth middleware
      res.status(200).json({
        success: true,
        message: 'Current user fetched successfully',
        data: {
          user: req.user,
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
