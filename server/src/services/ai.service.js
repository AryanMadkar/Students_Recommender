const { Groq } = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Generate personalized recommendations using Groq
  async generatePersonalizedRecommendations(user) {
    const prompt = this.buildRecommendationPrompt(user);
    
    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert career counselor specializing in Indian education system. Provide detailed, practical recommendations based on student data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "deepseek-r1-distill-llama-70b", // or "llama2-70b-4096" based on your preference
        temperature: 0.7,
        max_tokens: 2000
      });
      
      return this.parseAIRecommendations(response.choices[0].message.content);
    } catch (error) {
      console.error('Groq recommendation generation failed:', error);
      return this.getFallbackRecommendations(user);
    }
  }

  // Generate assessment insights using Groq (alternative implementation)
  async generateAssessmentInsightsWithGroq(user, scores) {
    const prompt = `
      Analyze the following assessment scores and provide insights:
      
      User Stage: ${user.educationStage}
      Academic Performance: ${JSON.stringify(user.academicInfo)}
      Assessment Scores: ${JSON.stringify(scores)}
      
      Provide:
      1. Key strengths and weaknesses
      2. Learning style recommendations
      3. Areas for improvement
      4. Motivational insights
    `;
    
    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an educational psychologist specialized in analyzing student assessment data and providing actionable insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.5,
        max_tokens: 1500
      });
      
      return this.parseInsights(response.choices[0].message.content);
    } catch (error) {
      console.error('Groq insights generation failed:', error);
      return this.getFallbackInsights(scores);
    }
  }

  // Keep original Gemini implementation as backup
  async generateAssessmentInsights(user, scores) {
    const prompt = `
      Analyze the following assessment scores and provide insights:
      
      User Stage: ${user.educationStage}
      Academic Performance: ${JSON.stringify(user.academicInfo)}
      Assessment Scores: ${JSON.stringify(scores)}
      
      Provide:
      1. Key strengths and weaknesses
      2. Learning style recommendations
      3. Areas for improvement
      4. Motivational insights
    `;
    
    try {
      const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      
      return this.parseInsights(result.response.text());
    } catch (error) {
      console.error('AI insights generation failed:', error);
      return this.getFallbackInsights(scores);
    }
  }

  // Enhanced method to try multiple AI providers
  async generateRecommendationsWithFallback(user) {
    // Try Groq first
    try {
      return await this.generatePersonalizedRecommendations(user);
    } catch (groqError) {
      console.error('Groq failed, trying Gemini fallback:', groqError);
      
      // Fallback to Gemini
      try {
        const prompt = this.buildRecommendationPrompt(user);
        const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        
        return this.parseAIRecommendations(result.response.text());
      } catch (geminiError) {
        console.error('Both AI providers failed:', geminiError);
        return this.getFallbackRecommendations(user);
      }
    }
  }

  buildRecommendationPrompt(user) {
    return `
      Student Profile:
      - Education Stage: ${user.educationStage}
      - Academic Record: ${JSON.stringify(user.academicInfo)}
      - Assessment Results: ${JSON.stringify(user.assessmentResults.slice(-3))}
      - Parental Influence: ${JSON.stringify(user.parentalInfluence)}
      - Location: ${user.personalInfo.state}, ${user.personalInfo.city}
      
      Generate personalized recommendations including:
      1. Top 3 career paths with reasoning
      2. Recommended colleges/courses with specific details
      3. Skills to develop with timeline
      4. Action steps for next 6 months
      
      Consider Indian education system, market trends, and student's financial background.
      
      Format your response in a structured manner with clear headings and bullet points.
    `;
  }

  parseAIRecommendations(aiResponse) {
    // Enhanced parsing logic for better structure
    try {
      // You can implement more sophisticated parsing here
      // For now, returning a basic structure
      const sections = aiResponse.split(/\d+\.\s/);
      
      return {
        careerPaths: this.extractCareerPaths(aiResponse),
        colleges: this.extractColleges(aiResponse),
        skills: this.extractSkills(aiResponse),
        actionSteps: this.extractActionSteps(aiResponse),
        rawResponse: aiResponse
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        careerPaths: [],
        colleges: [],
        skills: [],
        actionSteps: [],
        rawResponse: aiResponse
      };
    }
  }

  extractCareerPaths(response) {
    // Implementation to extract career paths from response
    const careerSection = response.match(/career paths?:?\s*(.*?)(?=recommended|skills|action|$)/is);
    return careerSection ? careerSection[1].split('\n').filter(line => line.trim()) : [];
  }

  extractColleges(response) {
    // Implementation to extract colleges from response
    const collegeSection = response.match(/colleges?.*?courses?:?\s*(.*?)(?=skills|action|$)/is);
    return collegeSection ? collegeSection[1].split('\n').filter(line => line.trim()) : [];
  }

  extractSkills(response) {
    // Implementation to extract skills from response
    const skillsSection = response.match(/skills?.*?:?\s*(.*?)(?=action|$)/is);
    return skillsSection ? skillsSection[1].split('\n').filter(line => line.trim()) : [];
  }

  extractActionSteps(response) {
    // Implementation to extract action steps from response
    const actionSection = response.match(/action steps?:?\s*(.*?)$/is);
    return actionSection ? actionSection[1].split('\n').filter(line => line.trim()) : [];
  }

  parseInsights(aiResponse) {
    // Parse insights response
    return {
      strengths: [],
      weaknesses: [],
      learningStyle: '',
      improvements: [],
      motivation: '',
      rawResponse: aiResponse
    };
  }

  getFallbackRecommendations(user) {
    // Rule-based fallback recommendations when AI fails
    return {
      careerPaths: ["Software Engineering", "Data Science", "Product Management"],
      colleges: ["IIT", "BITS Pilani", "VIT"],
      skills: ["Programming", "Problem Solving", "Communication"],
      actionSteps: ["Focus on coding practice", "Build portfolio projects", "Prepare for competitive exams"]
    };
  }

  getFallbackInsights(scores) {
    // Basic insights when AI fails
    return {
      strengths: ["Analytical thinking"],
      weaknesses: ["Time management"],
      learningStyle: "Visual learner",
      improvements: ["Practice more problems"],
      motivation: "Set smaller, achievable goals"
    };
  }
}

module.exports = new AIService();
