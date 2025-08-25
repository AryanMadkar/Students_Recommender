const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Recommendation = require('../models/Recommendation');
const Result = require('../models/Result');

class DashboardController {
  // Get comprehensive dashboard data
  async getDashboardData(req, res) {
    try {
      const userId = req.user.id;
      
      const [user, recentResults, recommendations] = await Promise.all([
        User.findById(userId).populate('assessmentResults.assessmentId'),
        Result.find({ userId }).sort({ completedAt: -1 }).limit(5).populate('assessmentId'),
        Recommendation.find({ userId }).sort({ createdAt: -1 }).limit(5)
      ]);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const dashboardData = {
        overview: {
          profileCompletion: user.progress.profileCompletion,
          assessmentsCompleted: user.progress.assessmentsCompleted,
          stage: user.educationStage,
          lastActive: user.progress.lastActive
        },
        stats: await this.getUserStats(userId),
        recentActivity: await this.getRecentActivity(userId),
        quickActions: this.getQuickActions(user),
        recommendations: recommendations.slice(0, 3),
        progress: await this.getProgressData(userId)
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    const [assessmentCount, recommendationCount, user] = await Promise.all([
      Result.countDocuments({ userId }),
      Recommendation.countDocuments({ userId }),
      User.findById(userId)
    ]);

    return {
      assessmentsCompleted: assessmentCount,
      recommendationsGenerated: recommendationCount,
      profileCompletion: user.progress.profileCompletion,
      accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) // days
    };
  }

  // Get recent user activity
  async getRecentActivity(userId) {
    const activities = [];

    // Recent assessments
    const recentResults = await Result.find({ userId })
      .sort({ completedAt: -1 })
      .limit(3)
      .populate('assessmentId');

    recentResults.forEach(result => {
      activities.push({
        type: 'assessment_completed',
        title: `Completed ${result.assessmentId?.title || 'Assessment'}`,
        date: result.completedAt,
        score: result.scores.overall
      });
    });

    // Recent recommendations
    const recentRecommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(2);

    recentRecommendations.forEach(rec => {
      activities.push({
        type: 'recommendation_generated',
        title: `New ${rec.type} recommendations`,
        date: rec.createdAt,
        count: rec.recommendations?.length || 0
      });
    });

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // **MISSING METHOD 1: Get quick actions based on user stage and progress**
  async getQuickActions(user) {
    const actions = [];

    // Profile completion
    if (user.progress.profileCompletion < 100) {
      actions.push({
        title: 'Complete Profile',
        description: 'Finish setting up your profile for better recommendations',
        action: 'complete_profile',
        priority: 'high',
        url: '/profile'
      });
    }

    // Assessment completion
    if (user.progress.assessmentsCompleted === 0) {
      actions.push({
        title: 'Take First Assessment',
        description: 'Start with an aptitude test to get personalized recommendations',
        action: 'start_assessment',
        priority: 'high',
        url: '/assessments'
      });
    }

    // Stage-specific actions
    switch (user.educationStage) {
      case 'after10th':
        actions.push({
          title: 'Explore Streams',
          description: 'Discover which stream suits you best',
          action: 'explore_streams',
          priority: 'medium',
          url: '/recommendations/streams'
        });
        break;
      case 'after12th':
        actions.push({
          title: 'Find Colleges',
          description: 'Search and compare colleges for your preferred courses',
          action: 'search_colleges',
          priority: 'medium',
          url: '/colleges'
        });
        break;
      case 'ongoing':
        actions.push({
          title: 'Skill Roadmap',
          description: 'Get a personalized skill development plan',
          action: 'create_roadmap',
          priority: 'medium',
          url: '/recommendations/roadmap'
        });
        break;
    }

    return actions.slice(0, 4); // Return top 4 actions
  }

  // **MISSING METHOD 2: Get progress tracking data**
  async getProgressData(userId) {
    try {
      const user = await User.findById(userId);
      const results = await Result.find({ userId }).sort({ completedAt: 1 });

      // Calculate progress over time
      const progressPoints = results.map((result, index) => ({
        assessment: index + 1,
        overallScore: result.scores.overall,
        date: result.completedAt,
        skills: {
          analytical: result.scores.analytical,
          creative: result.scores.creative,
          technical: result.scores.technical,
          communication: result.scores.communication,
          leadership: result.scores.leadership
        }
      }));

      return {
        milestones: this.getMilestones(user),
        skillProgress: progressPoints,
        nextGoals: this.getNextGoals(user),
        achievements: this.getUserAchievements(user, results)
      };
    } catch (error) {
      throw error;
    }
  }

  // **MISSING METHOD 3: Get user milestones**
  getMilestones(user) {
    const milestones = [
      { 
        title: 'Profile Created', 
        completed: true, 
        date: user.createdAt,
        description: 'Welcome to PathPilot!'
      },
      { 
        title: 'Profile Completed', 
        completed: user.progress.profileCompletion === 100,
        description: 'Complete profile setup'
      },
      { 
        title: 'First Assessment', 
        completed: user.progress.assessmentsCompleted > 0,
        description: 'Take your first aptitude assessment'
      },
      { 
        title: 'Recommendations Generated', 
        completed: user.recommendations?.length > 0,
        description: 'Get personalized career recommendations'
      }
    ];

    return milestones;
  }

  // **MISSING METHOD 4: Get next goals for user**
  getNextGoals(user) {
    const goals = [];

    if (user.progress.assessmentsCompleted < 3) {
      goals.push('Complete 3 comprehensive assessments');
    }

    if (!user.recommendations || user.recommendations.length === 0) {
      goals.push('Generate first set of recommendations');
    }

    goals.push('Explore 5 recommended colleges/courses');
    goals.push('Create action plan for next 6 months');

    return goals;
  }

  // **MISSING METHOD 5: Get user achievements**
  getUserAchievements(user, results) {
    const achievements = [];

    if (user.progress.profileCompletion === 100) {
      achievements.push({ 
        title: 'Profile Master', 
        icon: '🏆',
        description: 'Completed profile setup',
        earnedAt: user.updatedAt
      });
    }

    if (results.length >= 5) {
      achievements.push({ 
        title: 'Assessment Expert', 
        icon: '🎯',
        description: 'Completed 5+ assessments',
        earnedAt: results[4]?.completedAt
      });
    }

    if (results.some(r => r.scores.overall >= 90)) {
      achievements.push({ 
        title: 'High Achiever', 
        icon: '⭐',
        description: 'Scored 90%+ in an assessment',
        earnedAt: results.find(r => r.scores.overall >= 90)?.completedAt
      });
    }

    if (user.progress.assessmentsCompleted >= 3) {
      achievements.push({
        title: 'Dedicated Learner',
        icon: '📚',
        description: 'Completed multiple assessments',
        earnedAt: results[2]?.completedAt
      });
    }

    return achievements;
  }

  // **MISSING METHOD 6: Get analytics data for admin/user insights**
  async getAnalytics(req, res) {
    try {
      const userId = req.user.id;
      
      const analytics = {
        assessmentPerformance: await this.getAssessmentAnalytics(userId),
        skillTrends: await this.getSkillTrends(userId),
        recommendationEffectiveness: await this.getRecommendationAnalytics(userId),
        timeSpentAnalysis: await this.getTimeAnalytics(userId)
      };

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // **MISSING METHOD 7: Get assessment analytics**
  async getAssessmentAnalytics(userId) {
    const results = await Result.find({ userId }).sort({ completedAt: 1 });
    
    if (results.length === 0) {
      return {
        totalAssessments: 0,
        averageScore: 0,
        improvement: 0,
        categoryStrengths: {}
      };
    }

    return {
      totalAssessments: results.length,
      averageScore: results.reduce((sum, r) => sum + r.scores.overall, 0) / results.length,
      improvement: this.calculateImprovement(results),
      categoryStrengths: this.calculateCategoryStrengths(results)
    };
  }

  // **MISSING METHOD 8: Get skill trends**
  async getSkillTrends(userId) {
    const results = await Result.find({ userId }).sort({ completedAt: 1 });
    
    return results.map(result => ({
      date: result.completedAt,
      skills: result.scores
    }));
  }

  // **MISSING METHOD 9: Get recommendation analytics**
  async getRecommendationAnalytics(userId) {
    const recommendations = await Recommendation.find({ userId });
    
    return {
      totalRecommendations: recommendations.length,
      byType: this.groupRecommendationsByType(recommendations),
      averageConfidence: this.calculateAverageConfidence(recommendations)
    };
  }

  // **MISSING METHOD 10: Get time analytics**
  async getTimeAnalytics(userId) {
    const results = await Result.find({ userId });
    
    return {
      totalTimeSpent: results.reduce((sum, r) => sum + (r.totalTimeSpent || 0), 0),
      averageTimePerAssessment: results.length > 0 
        ? results.reduce((sum, r) => sum + (r.totalTimeSpent || 0), 0) / results.length 
        : 0,
      assessmentsByDay: this.getAssessmentsByDay(results)
    };
  }

  // Helper methods
  calculateImprovement(results) {
    if (results.length < 2) return 0;
    
    const first = results[0].scores.overall;
    const latest = results[results.length - 1].scores.overall;
    return ((latest - first) / first) * 100;
  }

  calculateCategoryStrengths(results) {
    if (results.length === 0) return {};
    
    const latestResult = results[results.length - 1];
    const scores = latestResult.scores;
    
    return Object.keys(scores)
      .filter(key => key !== 'overall')
      .sort((a, b) => scores[b] - scores[a])
      .reduce((strengths, skill) => {
        strengths[skill] = scores[skill];
        return strengths;
      }, {});
  }

  groupRecommendationsByType(recommendations) {
    const grouped = {};
    recommendations.forEach(rec => {
      grouped[rec.type] = (grouped[rec.type] || 0) + 1;
    });
    return grouped;
  }

  calculateAverageConfidence(recommendations) {
    if (recommendations.length === 0) return 0;
    
    return recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / recommendations.length;
  }

  getAssessmentsByDay(results) {
    const byDay = {};
    results.forEach(result => {
      const day = result.completedAt.toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
    });
    return byDay;
  }

  // **MISSING METHOD 11: Route handler for progress data**
  async getProgressDataRoute(req, res) {
    try {
      const userId = req.user.id;
      const progressData = await this.getProgressData(userId);
      
      res.json({
        success: true,
        data: progressData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // **MISSING METHOD 12: Route handler for quick actions**
  async getQuickActionsRoute(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const quickActions = await this.getQuickActions(user);
      
      res.json({
        success: true,
        data: quickActions
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // **MISSING METHOD 13: Route handler for achievements**
  async getAchievements(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      const results = await Result.find({ userId });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const achievements = this.getUserAchievements(user, results);
      
      res.json({
        success: true,
        data: achievements
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new DashboardController();
