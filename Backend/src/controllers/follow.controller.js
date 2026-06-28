import Follower from '../models/Follower.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import BlockedUser from '../models/BlockedUser.js';
import ResearcherSimilarity from '../models/ResearcherSimilarity.js';
import CollaborationNotification from '../models/CollaborationNotification.js';
import AppError from '../utils/AppError.js';
import { sendRealTimeNotification } from '../services/socket.service.js';
import { sendNewFollowerEmail } from '../services/email.service.js';

export const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { userId } = req.params; // The user to follow (following)

    if (followerId === userId) {
      return next(new AppError('You cannot follow yourself', 400));
    }

    // Check if blocked
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { blocker: followerId, blocked: userId },
        { blocker: userId, blocked: followerId },
      ],
    });

    if (isBlocked) {
      return next(new AppError('Action not allowed. User is blocked.', 403));
    }

    // Check if already following
    const existing = await Follower.findOne({ follower: followerId, following: userId });
    if (existing) {
      return next(new AppError('You are already following this researcher', 400));
    }

    const follow = await Follower.create({
      follower: followerId,
      following: userId,
    });

    const followerUser = await User.findById(followerId);
    const followingUser = await User.findById(userId);

    // Create Notification
    const notif = await CollaborationNotification.create({
      user: userId,
      sender: followerId,
      title: 'New Follower',
      message: `${followerUser.fullName} started following you`,
      type: 'NewFollower',
      relatedEntity: follow._id,
      onModel: 'User',
    });

    // Real-time
    sendRealTimeNotification(userId, 'NEW_FOLLOWER', {
      notification: notif,
      followerId,
    });

    // Send Email
    if (followingUser) {
      await sendNewFollowerEmail(followingUser.email, followerUser.fullName);
    }

    res.status(201).json({
      status: 'success',
      data: follow,
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { userId } = req.params; // The user to unfollow

    const follow = await Follower.findOneAndDelete({ follower: followerId, following: userId });
    if (!follow) {
      return next(new AppError('You are not following this user', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const followers = await Follower.find({ following: userId })
      .populate('follower', 'fullName email')
      .sort({ createdAt: -1 });

    const list = [];
    for (const f of followers) {
      const profile = await Profile.findOne({ user: f.follower._id })
        .select('profilePhoto designation institution country');
      list.push({
        followId: f._id,
        user: f.follower,
        profile,
        followedAt: f.createdAt,
      });
    }

    res.status(200).json({
      status: 'success',
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const following = await Follower.find({ follower: userId })
      .populate('following', 'fullName email')
      .sort({ createdAt: -1 });

    const list = [];
    for (const f of following) {
      const profile = await Profile.findOne({ user: f.following._id })
        .select('profilePhoto designation institution country');
      list.push({
        followId: f._id,
        user: f.following,
        profile,
        followedAt: f.createdAt,
      });
    }

    res.status(200).json({
      status: 'success',
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Followers
    const followers = await Follower.find({ following: userId }).populate('follower', 'fullName email');
    const followersList = [];
    for (const f of followers) {
      const profile = await Profile.findOne({ user: f.follower._id })
        .select('profilePhoto designation institution country');
      if (profile) {
        followersList.push({ user: f.follower, profile, followedAt: f.createdAt });
      }
    }

    // 2. Following
    const following = await Follower.find({ follower: userId }).populate('following', 'fullName email');
    const followingList = [];
    for (const f of following) {
      const profile = await Profile.findOne({ user: f.following._id })
        .select('profilePhoto designation institution country');
      if (profile) {
        followingList.push({ user: f.following, profile, followedAt: f.createdAt });
      }
    }

    // 3. Popular researchers (most followers overall)
    const popularAgg = await Follower.aggregate([
      { $group: { _id: '$following', followerCount: { $sum: 1 } } },
      { $sort: { followerCount: -1 } },
      { $limit: 5 },
    ]);
    const popularList = [];
    for (const item of popularAgg) {
      if (item._id.toString() === userId) continue;
      const user = await User.findById(item._id).select('fullName email');
      const profile = await Profile.findOne({ user: item._id })
        .select('profilePhoto designation institution country');
      if (user && profile) {
        popularList.push({ user, profile, followerCount: item.followerCount });
      }
    }

    // 4. Trending researchers (most followed in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const trendingAgg = await Follower.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$following', followerCount: { $sum: 1 } } },
      { $sort: { followerCount: -1 } },
      { $limit: 5 },
    ]);
    const trendingList = [];
    for (const item of trendingAgg) {
      if (item._id.toString() === userId) continue;
      const user = await User.findById(item._id).select('fullName email');
      const profile = await Profile.findOne({ user: item._id })
        .select('profilePhoto designation institution country');
      if (user && profile) {
        trendingList.push({ user, profile, followerCount: item.followerCount });
      }
    }

    // 5. Suggested researchers (high similarity score, not already following)
    const followingIds = new Set(following.map(f => f.following.toString()));
    followingIds.add(userId);

    const similarities = await ResearcherSimilarity.find({
      $or: [{ researcherA: userId }, { researcherB: userId }],
      similarityScore: { $gte: 30 },
    })
      .sort({ similarityScore: -1 })
      .limit(5);

    const suggestedList = [];
    for (const sim of similarities) {
      const partnerId = sim.researcherA.toString() === userId ? sim.researcherB : sim.researcherA;
      if (followingIds.has(partnerId.toString())) continue;

      const user = await User.findById(partnerId).select('fullName email');
      const profile = await Profile.findOne({ user: partnerId })
        .select('profilePhoto designation institution country bio');

      if (user && profile) {
        suggestedList.push({
          user,
          profile,
          similarityScore: sim.similarityScore,
          matchLevel: sim.matchLevel,
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        followers: followersList,
        following: followingList,
        popular: popularList,
        trending: trendingList,
        suggested: suggestedList,
      },
    });
  } catch (error) {
    next(error);
  }
};
