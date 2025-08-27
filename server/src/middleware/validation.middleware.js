const { body, param, query, validationResult } = require("express-validator");

// User registration validation
const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("phone")
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid Indian phone number"),
  body("educationStage")
    .isIn(["after10th", "after12th", "ongoing"])
    .withMessage("Invalid education stage"),
];

// User login validation
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Profile update validation
const validateProfileUpdate = [
  body("personalInfo.name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("personalInfo.phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid Indian phone number"),
  body("personalInfo.dateOfBirth")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Please provide a valid date"),
  body("academicInfo.class10.percentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("10th percentage must be between 0 and 100"),
  body("academicInfo.class12.percentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("12th percentage must be between 0 and 100"),
];

// FIXED: Assessment submission validation to match controller expectations
const validateAssessmentSubmission = [
  param("assessmentId").isMongoId().withMessage("Invalid assessment ID"),
  body("responses").isObject().withMessage("Responses must be an object"),
  // FIXED: Accept timeSpent as object with questionId keys and total
  body("timeSpent")
    .optional()
    .isObject()
    .withMessage("Time spent must be an object with question IDs and total"),
  body("timeSpent.total")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total time spent must be a positive integer"),
];

// College search validation
const validateCollegeSearch = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("minRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  query("maxFees")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Max fees must be a positive number"),
];

// Password reset validation
const validatePasswordReset = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateAssessmentSubmission,
  validateCollegeSearch,
  validatePasswordReset,
  handleValidationErrors,
};
