const express = require('express');
const assessmentController = require('../controllers/assessment.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Make sure all method names match exactly what's exported from controller
router.get('/', assessmentController.getAssessments);
router.get('/:assessmentId/start', assessmentController.startAssessment);
router.post('/:assessmentId/submit', assessmentController.submitAssessment);
router.get('/results', assessmentController.getAssessmentResults);
router.get('/results/:resultId', assessmentController.getAssessmentResult);

module.exports = router;
