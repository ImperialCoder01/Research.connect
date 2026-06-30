import authRoutes from './routes/auth.routes.js';
import { protect, authorize } from './middleware/auth.middleware.js';

export {
  authRoutes,
  protect,
  authorize,
};
