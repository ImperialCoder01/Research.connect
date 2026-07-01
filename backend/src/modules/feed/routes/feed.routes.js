const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed.controller');
const { authMiddleware } = require('../../../common/middlewares/auth.middleware');
const { searchLimiter } = require('../../../config/rateLimiter');
const {
  createPublicationValidator,
  toggleLikeValidator,
  toggleBookmarkValidator,
  moveBookmarkValidator,
  toggleRecommendationValidator,
  addCommentValidator,
  recordShareValidator,
  createDatasetValidator,
  searchValidator
} = require('../validator/feed.validator');

// Optional auth endpoint
router.get('/feed/publication/:id', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  next();
}, feedController.getPublicationById);

// All other endpoints require authentication
router.use(authMiddleware);

// Feeds
router.get('/feed', feedController.getFeed);
router.get('/feed/trending', feedController.getTrending);
router.get('/feed/recommended', feedController.getRecommended);
router.get('/feed/latest', feedController.getLatest);
router.get('/feed/following', feedController.getFollowingFeed);
router.get('/home', feedController.getHome);
router.get('/notifications', feedController.getNotifications);
router.get('/messages', feedController.getMessages);
router.get('/requests', feedController.getRequests);
router.get('/recommendations', feedController.getRecommendations);

// Publications CRUD
router.post('/publication', createPublicationValidator, feedController.createPublication);
router.put('/publication/:id', createPublicationValidator, feedController.updatePublication);
router.delete('/publication/:id', feedController.deletePublication);

// Interactions
router.post('/publication/like', toggleLikeValidator, feedController.toggleLike);
router.post('/publication/bookmark', toggleBookmarkValidator, feedController.toggleBookmark);
router.post('/bookmark/move', moveBookmarkValidator, feedController.moveBookmark);
router.get('/bookmark/folders', feedController.getBookmarkFolders);
router.post('/publication/share', recordShareValidator, feedController.recordShare);
router.post('/publication/recommend', toggleRecommendationValidator, feedController.toggleRecommendation);

// Comments & replies
router.post('/publication/comment', addCommentValidator, feedController.addComment);
router.get('/publication/:publicationId/comments', feedController.getComments);
router.post('/comment/:commentId/like', feedController.toggleLikeComment);

// Follow actions
router.post('/follow/:userId', feedController.toggleFollow);
router.get('/suggested-researchers', feedController.getSuggestedResearchers);
router.get('/following', feedController.getFollowingList);
router.get('/followers', feedController.getFollowersList);

// AI & similar papers
router.get('/publication/:id/similar', feedController.getSimilarPapers);
router.post('/publication/request-full-text', feedController.requestFullText);
router.post('/publication/ai-summary', feedController.getAiSummary);

// Datasets
router.post('/dataset', createDatasetValidator, feedController.createDataset);
router.get('/datasets', feedController.getDatasets);

// Global Search
router.get('/search', searchLimiter, searchValidator, feedController.globalSearch);
router.get('/questions', feedController.getQuestions);
router.get('/projects', feedController.getProjects);
router.get('/events', feedController.getEvents);

module.exports = router;
