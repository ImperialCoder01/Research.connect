const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    error: {
      code: 'TOO_MANY_REQUESTS'
    }
  }
});

const securityMiddlewares = [
  helmet(),
  cors(corsOptions),
  limiter
];

module.exports = securityMiddlewares;
