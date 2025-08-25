const express = require('express');
const recommendationController = require('../controllers/recommendation.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Generate comprehensive recommendations
router.post('/generate', 
  aiLimiter,
  recommendationController.generateRecommendations
);

// Get stage-specific guidance
router.get('/guidance', recommendationController.getStageGuidance);

// Get career path recommendations
router.get('/careers', recommendationController.getCareerRecommendations);

// Get college recommendations
router.get('/colleges', recommendationController.getCollegeRecommendations);

// Get skill roadmap
router.get('/roadmap', recommendationController.getSkillRoadmap);

// Provide feedback on recommendations
router.post('/:recommendationId/feedback', recommendationController.provideFeedback);

module.exports = router;
