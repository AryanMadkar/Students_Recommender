const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get comprehensive dashboard data
router.get('/', dashboardController.getDashboardData);

// Get analytics data
router.get('/analytics', dashboardController.getAnalytics);

// Get progress tracking data
router.get('/progress', dashboardController.getProgressData);

// Get quick actions
router.get('/quick-actions', dashboardController.getQuickActions);

// Get user achievements
router.get('/achievements', dashboardController.getAchievements);

module.exports = router;
