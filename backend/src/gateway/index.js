const express = require('express');
const router = express.Router();

const requestTracing = require('./tracing');
const { helmetGateway, corsGateway } = require('./security');
const responseStandardizer = require('./response');
const rateLimiter = require('./limiter');
const healthRoutes = require('./health');

// 1. Mount low-level middleware (tracing, security, standards)
router.use(requestTracing);
router.use(helmetGateway);
router.use(corsGateway);
router.use(responseStandardizer);

// 2. Mount Health check endpoints (bypasses rate limiting)
router.use('/health', healthRoutes);

// 3. Mount Redis Rate Limiting (bypasses internal health endpoint but covers all standard APIs)
router.use(rateLimiter({ max: 200, windowMs: 60 * 1000 })); // default: 200 reqs/min

module.exports = router;
