import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowerDashboard,
} from '../controllers/follow.controller.js';

const router = express.Router();

router.use(protect);

router.post('/follow/:userId', followUser);
router.delete('/unfollow/:userId', unfollowUser);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.get('/dashboard', getFollowerDashboard);

export default router;
