const express = require("express");
const assessmentController = require("../controllers/assessment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { assessmentLimiter } = require("../middleware/rateLimit.middleware");
const {
  validateAssessmentSubmission,
  handleValidationErrors,
} = require("../middleware/validation.middleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get("/", assessmentController.getAssessments);
router.get("/:assessmentId/start", assessmentController.startAssessment);

// FIXED: Add rate limiting and validation to submission
router.post(
  "/:assessmentId/submit",
  assessmentLimiter,
  validateAssessmentSubmission,
  handleValidationErrors,
  assessmentController.submitAssessment
);

router.get("/results", assessmentController.getAssessmentResults);
router.get("/results/:resultId", assessmentController.getAssessmentResult);

module.exports = router;
