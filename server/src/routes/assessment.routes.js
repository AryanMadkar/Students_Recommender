const express = require('express');
const assessmentController = require('../controllers/assessment.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateAssessmentSubmission, handleValidationErrors } = require('../middleware/validation.middleware');
const { assessmentLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get available assessments
router.get('/', assessmentController.getAssessments);

// Start specific assessment
router.get('/:assessmentId/start', assessmentController.startAssessment);

// Submit assessment responses
router.post('/:assessmentId/submit', 
  assessmentLimiter,
  validateAssessmentSubmission,
  handleValidationErrors,
  assessmentController.submitAssessment
);

// Get assessment results
router.get('/results', assessmentController.getAssessmentResults);

// Get specific assessment result
router.get('/results/:resultId', assessmentController.getAssessmentResult);

module.exports = router;
