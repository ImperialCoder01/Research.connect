import { verifyAccessToken } from '../helper/token.helper.js';

export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token is missing',
      error: {
        code: 'UNAUTHORIZED',
        details: 'Access token is required to access this resource.',
      },
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach user info (id, email, role) to request
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    
    let message = 'Not authorized, token failed';
    let code = 'UNAUTHORIZED';
    
    if (error.name === 'TokenExpiredError') {
      message = 'Access token has expired';
      code = 'TOKEN_EXPIRED';
    }

    return res.status(401).json({
      success: false,
      message,
      error: {
        code,
        details: error.message,
      },
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this route`,
        error: {
          code: 'FORBIDDEN',
          details: 'You do not have the required permissions to perform this action.',
        },
      });
    }
    next();
  };
};
