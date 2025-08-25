const recommendationService = require('../services/recommendation.service');
const aiService = require('../services/ai.service');
const User = require('../models/User');

class RecommendationController {
  // Generate comprehensive recommendations
  async generateRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId)
        .populate('assessmentResults.assessmentId');
      
      // Check if user has completed required assessments
      const requiredAssessments = await recommendationService.getRequiredAssessments(user.educationStage);
      const completedAssessments = user.assessmentResults.map(r => r.assessmentId._id.toString());
      
      const missingAssessments = requiredAssessments.filter(
        required => !completedAssessments.includes(required._id.toString())
      );
      
      if (missingAssessments.length > 0) {
        return res.json({
          success: false,
          message: 'Please complete required assessments first',
          missingAssessments
        });
      }
      
      // Generate AI-powered recommendations
      const recommendations = await aiService.generatePersonalizedRecommendations(user);
      
      // Save recommendations to user profile
      user.recommendations = recommendations.map(rec => ({
        ...rec,
        generatedAt: new Date()
      }));
      await user.save();
      
      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get stage-specific guidance
  async getStageGuidance(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      let guidance;
      
      switch (user.educationStage) {
        case 'after10th':
          guidance = await this.getAfter10thGuidance(user);
          break;
        case 'after12th':
          guidance = await this.getAfter12thGuidance(user);
          break;
        case 'ongoing':
          guidance = await this.getOngoingGuidance(user);
          break;
        default:
          throw new Error('Invalid education stage');
      }
      
      res.json({
        success: true,
        data: guidance
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // After 10th guidance
  async getAfter10thGuidance(user) {
    const assessmentScores = this.getLatestScores(user);
    
    // Stream recommendations based on aptitude and interest
    const streamRecommendations = await recommendationService.recommendStreams(
      user.academicInfo.class10,
      assessmentScores,
      user.parentalInfluence
    );
    
    // College recommendations for each stream
    const collegeRecommendations = await Promise.all(
      streamRecommendations.map(async (stream) => ({
        stream: stream.name,
        colleges: await recommendationService.getCollegesForStream(stream.name, user.location)
      }))
    );
    
    return {
      stage: 'after10th',
      primaryRecommendations: streamRecommendations,
      collegeOptions: collegeRecommendations,
      nextSteps: [
        'Complete aptitude assessment if not done',
        'Research colleges for recommended streams',
        'Discuss options with parents/counselors',
        'Plan for entrance exams if required'
      ]
    };
  }

  // After 12th guidance
  async getAfter12thGuidance(user) {
    const assessmentScores = this.getLatestScores(user);
    const stream = user.academicInfo.class12.stream;
    
    // Course recommendations based on stream and scores
    const courseRecommendations = await recommendationService.recommendCourses(
      stream,
      user.academicInfo.class12,
      assessmentScores
    );
    
    // College recommendations with cutoff analysis
    const collegeRecommendations = await recommendationService.getCollegeRecommendations(
      courseRecommendations,
      user.academicInfo.class12.percentage,
      user.location
    );
    
    // Entrance exam guidance
    const examGuidance = await recommendationService.getEntranceExamGuidance(courseRecommendations);
    
    return {
      stage: 'after12th',
      courseRecommendations,
      collegeRecommendations,
      examGuidance,
      nextSteps: [
        'Apply for entrance exams',
        'Research college admission processes',
        'Prepare application documents',
        'Consider backup options'
      ]
    };
  }

  // Ongoing course guidance
  async getOngoingGuidance(user) {
    const assessmentScores = this.getLatestScores(user);
    const currentCourse = user.academicInfo.currentCourse;
    
    // Skill development roadmap
    const skillRoadmap = await recommendationService.generateSkillRoadmap(
      currentCourse,
      assessmentScores
    );
    
    // Internship recommendations
    const internshipRecommendations = await recommendationService.getInternshipRecommendations(
      currentCourse,
      user.location
    );
    
    // Placement preparation
    const placementPrep = await recommendationService.getPlacementPreparation(currentCourse);
    
    return {
      stage: 'ongoing',
      skillRoadmap,
      internshipRecommendations,
      placementPrep,
      nextSteps: [
        'Complete skill assessments',
        'Start building portfolio projects',
        'Apply for relevant internships',
        'Begin placement preparation'
      ]
    };
  }

  getLatestScores(user) {
    if (user.assessmentResults.length === 0) return {};
    
    return user.assessmentResults.reduce((latest, current) => {
      Object.keys(current.scores).forEach(key => {
        if (!latest[key] || current.completedAt > latest.completedAt) {
          latest[key] = current.scores[key];
          latest.completedAt = current.completedAt;
        }
      });
      return latest;
    }, {});
  }
}

module.exports = new RecommendationController();
