const Assessment = require("../models/Assessment");
const Question = require("../models/Question");
const User = require("../models/User");
const assessmentService = require("../services/assessment.service");
const aiService = require("../services/ai.service");

class AssessmentController {
  // Get assessments based on user's stage
  async getAssessments(req, res) {
    try {
      const { stage } = req.query;
      const userId = req.user.id;

      const user = await User.findById(userId);
      const userStage = stage || user.educationStage;

      const assessments = await Assessment.find({
        stage: userStage,
        isActive: true,
      }).populate("questions.questionId");

      // Filter out completed assessments if needed
      const completedAssessments = user.assessmentResults.map(
        (r) => r.assessmentId
      );

      const availableAssessments = assessments.filter(
        (assessment) => !completedAssessments.includes(assessment._id)
      );

      res.json({
        success: true,
        data: availableAssessments,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Start an assessment
  async startAssessment(req, res) {
    try {
      const { assessmentId } = req.params;
      const userId = req.user.id;

      const assessment = await Assessment.findById(assessmentId).populate(
        "questions.questionId"
      );

      if (!assessment) {
        return res
          .status(404)
          .json({ success: false, message: "Assessment not found" });
      }

      // Generate personalized questions based on user profile
      const user = await User.findById(userId);
      const personalizedQuestions =
        await assessmentService.generatePersonalizedQuestions(assessment, user);

      res.json({
        success: true,
        data: {
          assessmentId: assessment._id,
          title: assessment.title,
          duration: assessment.duration,
          questions: personalizedQuestions,
          totalQuestions: personalizedQuestions.length,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Submit assessment responses
  async submitAssessment(req, res) {
    try {
      const { assessmentId } = req.params;
      const { responses, timeSpent } = req.body;
      const userId = req.user.id;

      // Calculate scores
      const scores = await assessmentService.calculateScores(
        assessmentId,
        responses
      );

      // Update user with assessment results
      const user = await User.findById(userId);
      user.assessmentResults.push({
        assessmentId,
        responses: new Map(Object.entries(responses)),
        scores,
        completedAt: new Date(),
      });

      user.progress.assessmentsCompleted += 1;
      await user.save();

      // Generate AI-powered insights
      const insights = await aiService.generateAssessmentInsights(user, scores);

      res.json({
        success: true,
        data: {
          scores,
          insights,
          nextSteps: await assessmentService.getNextSteps(user),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get detailed assessment results
  async getAssessmentResults(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate(
        "assessmentResults.assessmentId"
      );

      const detailedResults = await Promise.all(
        user.assessmentResults.map(async (result) => {
          const analysis = await assessmentService.analyzeResult(result);
          return {
            assessment: result.assessmentId,
            scores: result.scores,
            analysis,
            completedAt: result.completedAt,
          };
        })
      );

      res.json({
        success: true,
        data: detailedResults,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AssessmentController();
