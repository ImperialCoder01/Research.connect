const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import config
const corsOptions = require('../../config/cors');
const rateLimiterOptions = require('../../config/rateLimiter');

const limiter = rateLimit(rateLimiterOptions);

const securityMiddlewares = [
  helmet(),
  cors(corsOptions),
  limiter
];

module.exports = securityMiddlewares;
