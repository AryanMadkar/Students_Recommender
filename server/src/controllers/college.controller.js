const College = require('../models/College');
const Course = require('../models/Course');

class CollegeController {
  // Search colleges with filters
  async searchColleges(req, res) {
    try {
      const {
        state,
        city,
        course,
        type,
        minRating,
        maxFees,
        page = 1,
        limit = 20,
        sortBy = 'ratings.overall'
      } = req.query;

      // Build query
      const query = { isActive: true };
      
      if (state) query['location.state'] = new RegExp(state, 'i');
      if (city) query['location.city'] = new RegExp(city, 'i');
      if (type) query.type = type;
      if (minRating) query['ratings.overall'] = { $gte: parseFloat(minRating) };
      
      // Course filter
      if (course) {
        query['courses.name'] = new RegExp(course, 'i');
      }

      // Fees filter
      if (maxFees) {
        query['courses.fees.annual'] = { $lte: parseInt(maxFees) };
      }

      const colleges = await College.find(query)
        .sort({ [sortBy]: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await College.countDocuments(query);

      res.json({
        success: true,
        data: {
          colleges,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalColleges: total
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get college details
  async getCollegeDetails(req, res) {
    try {
      const { collegeId } = req.params;
      
      const college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({ 
          success: false, 
          message: 'College not found' 
        });
      }

      res.json({
        success: true,
        data: college
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Compare colleges
  async compareColleges(req, res) {
    try {
      const { collegeIds } = req.body;
      
      if (!collegeIds || collegeIds.length < 2) {
        return res.status(400).json({ 
          success: false, 
          message: 'Provide at least 2 college IDs for comparison' 
        });
      }

      const colleges = await College.find({ 
        _id: { $in: collegeIds },
        isActive: true 
      }).lean();

      const comparison = {
        colleges: colleges.map(college => ({
          id: college._id,
          name: college.name,
          location: college.location,
          type: college.type,
          ratings: college.ratings,
          placementStats: college.placementStats,
          fees: this.getAverageFees(college.courses)
        })),
        analysis: this.generateComparisonAnalysis(colleges)
      };

      res.json({
        success: true,
        data: comparison
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get college recommendations based on user profile
  async getPersonalizedRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { course, budget, preferredState } = req.query;

      // Build recommendation query based on user preferences
      const query = { isActive: true };
      
      if (course) {
        query['courses.name'] = new RegExp(course, 'i');
      }
      
      if (budget) {
        query['courses.fees.annual'] = { $lte: parseInt(budget) };
      }
      
      if (preferredState) {
        query['location.state'] = preferredState;
      }

      const colleges = await College.find(query)
        .sort({ 'ratings.overall': -1 })
        .limit(10)
        .lean();

      // Add match scores based on user preferences
      const recommendations = colleges.map(college => ({
        ...college,
        matchScore: this.calculateMatchScore(college, { course, budget, preferredState }),
        reasons: this.generateRecommendationReasons(college, { course, budget, preferredState })
      }));

      res.json({
        success: true,
        data: recommendations.sort((a, b) => b.matchScore - a.matchScore)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Helper methods
  getAverageFees(courses) {
    if (!courses || courses.length === 0) return 0;
    const total = courses.reduce((sum, course) => sum + (course.fees?.annual || 0), 0);
    return total / courses.length;
  }

  generateComparisonAnalysis(colleges) {
    return {
      bestRated: colleges.reduce((best, current) => 
        current.ratings.overall > best.ratings.overall ? current : best
      ).name,
      mostAffordable: colleges.reduce((affordable, current) => 
        this.getAverageFees(current.courses) < this.getAverageFees(affordable.courses) ? current : affordable
      ).name,
      bestPlacement: colleges.reduce((best, current) => 
        current.placementStats.averagePackage > best.placementStats.averagePackage ? current : best
      ).name
    };
  }

  calculateMatchScore(college, preferences) {
    let score = 0;
    
    // Course match
    if (preferences.course && college.courses.some(c => 
      c.name.toLowerCase().includes(preferences.course.toLowerCase())
    )) {
      score += 30;
    }
    
    // Budget match
    if (preferences.budget) {
      const avgFees = this.getAverageFees(college.courses);
      if (avgFees <= preferences.budget) {
        score += 25;
      }
    }
    
    // Location match
    if (preferences.preferredState && 
        college.location.state === preferences.preferredState) {
      score += 20;
    }
    
    // Rating bonus
    score += college.ratings.overall * 2.5;
    
    return Math.min(score, 100);
  }

  generateRecommendationReasons(college, preferences) {
    const reasons = [];
    
    if (college.ratings.overall >= 4) {
      reasons.push('Highly rated institution');
    }
    
    if (college.placementStats.placementPercentage >= 80) {
      reasons.push('Excellent placement record');
    }
    
    if (preferences.preferredState && college.location.state === preferences.preferredState) {
      reasons.push('Located in your preferred state');
    }
    
    return reasons;
  }
}

module.exports = new CollegeController();
