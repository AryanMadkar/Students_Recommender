const Assessment = require("../models/Assessment");
const Result = require("../models/Result");
const User = require("../models/User");
const assessmentService = require("../services/assessment.service");

class AssessmentController {
  async getAssessments(req, res) {
    try {
      const { stage } = req.query;
      const userId = req.user.id;
      const query = { isActive: true };
      if (stage) query.stage = stage;

      const assessments = await Assessment.find(query)
        .populate("questions.questionId")
        .sort({ createdAt: -1 });
      const userResults = await Result.find({ userId }).distinct(
        "assessmentId"
      );
      const completedAssessmentIds = userResults.map((id) => id.toString());

      const assessmentsWithStatus = assessments.map((assessment) => ({
        ...assessment.toObject(),
        completed: completedAssessmentIds.includes(assessment._id.toString()),
        questionCount: assessment.questions.length,
      }));

      res.json({ success: true, data: assessmentsWithStatus });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

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
      const existingResult = await Result.findOne({ userId, assessmentId });
      if (existingResult) {
        return res
          .status(400)
          .json({ success: false, message: "Assessment already completed" });
      }
      const user = await User.findById(userId);
      const questions = await assessmentService.generatePersonalizedQuestions(
        assessment,
        user
      );
      const questionsForUser = questions.map((q) => ({
        _id: q._id,
        question: q.question,
        type: q.type,
        category: q.category,
        options:
          q.options?.map((opt) => ({ text: opt.text, value: opt.value })) || [],
        difficulty: q.difficulty,
      }));

      res.json({
        success: true,
        data: {
          assessment: {
            _id: assessment._id,
            title: assessment.title,
            description: assessment.description,
            duration: assessment.duration,
            totalQuestions: questionsForUser.length,
          },
          questions: questionsForUser,
          startedAt: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async submitAssessment(req, res) {
    try {
      const { assessmentId } = req.params;
      const { responses, timeSpent } = req.body;
      const userId = req.user.id;

      if (!responses || Object.keys(responses).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Responses are required" });
      }

      const assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        return res
          .status(404)
          .json({ success: false, message: "Assessment not found" });
      }

      const existingResult = await Result.findOne({ userId, assessmentId });
      if (existingResult) {
        return res
          .status(400)
          .json({ success: false, message: "Assessment already submitted" });
      }

      const scores = await assessmentService.calculateScores(
        assessmentId,
        responses
      );
      const result = new Result({
        userId,
        assessmentId,
        responses: Object.entries(responses).map(([questionId, answer]) => ({
          questionId,
          answer,
          timeSpent: timeSpent?.[questionId] || 0,
        })),
        scores,
        totalTimeSpent: timeSpent?.total || 0,
      });
      await result.save();

      await User.findByIdAndUpdate(userId, {
        $inc: { "progress.assessmentsCompleted": 1 },
        $push: {
          assessmentResults: {
            assessmentId,
            scores,
            completedAt: new Date(),
          },
        },
        "progress.lastActive": new Date(),
      });

      const analysis = await assessmentService.analyzeResult(result);

      res.json({
        success: true,
        data: {
          result: {
            _id: result._id,
            scores,
            analysis,
            completedAt: result.completedAt,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAssessmentResults(req, res) {
    try {
      const userId = req.user.id;
      const results = await Result.find({ userId })
        .populate("assessmentId", "title description type")
        .sort({ completedAt: -1 });
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAssessmentResult(req, res) {
    try {
      const { resultId } = req.params;
      const userId = req.user.id;
      const result = await Result.findOne({ _id: resultId, userId })
        .populate("assessmentId", "title description type")
        .populate("responses.questionId");

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Result not found" });
      }

      let analysis = result.analysis;
      if (!analysis || Object.keys(analysis).length === 0) {
        analysis = await assessmentService.analyzeResult(result);
        result.analysis = analysis;
        await result.save();
      }

      res.json({
        success: true,
        data: {
          ...result.toObject(),
          analysis,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AssessmentController();
