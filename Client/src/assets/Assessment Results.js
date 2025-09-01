const Result = [
  {
    _id: "r01",
    userId: "u01",
    assessmentId: "a01",
    responses: [
      { questionId: "q01", answer: "ai_ml", timeSpent: 23, confidence: 5 },
      { questionId: "q02", answer: 4, timeSpent: 17, confidence: 4 },
    ],
    scores: {
      analytical: 38,
      creative: 20,
      technical: 52,
      communication: 10,
      leadership: 0,
      overall: 60,
    },
    analysis: {
      strengths: ["Technical Skills", "Problem Solving"],
      weaknesses: ["Teamwork"],
      recommendations: ["Participate in hackathons"],
      personalityType: "INTJ",
      learningStyle: "Hands-on",
    },
    aiInsights: {
      careerFit: [
        {
          career: "Software Engineer",
          matchPercentage: 92,
          reasoning: "Strong technical interest",
        },
      ],
      skillGaps: ["Leadership"],
      developmentAreas: ["Communication"],
    },
    totalTimeSpent: 40,
    completedAt: "2025-08-29T21:00:00Z",
  },
  {
    _id: "r02",
    userId: "u02",
    assessmentId: "a02",
    responses: [
      { questionId: "q03", answer: "accounts", timeSpent: 18, confidence: 5 },
      { questionId: "q04", answer: 5, timeSpent: 14, confidence: 4 },
    ],
    scores: {
      analytical: 47,
      creative: 0,
      technical: 18,
      communication: 25,
      leadership: 10,
      overall: 70,
    },
    analysis: {
      strengths: ["Analytical", "Accounts"],
      weaknesses: ["Verbal Reasoning"],
      recommendations: ["Practice case studies"],
      personalityType: "ESTJ",
      learningStyle: "Theory",
    },
    aiInsights: {
      careerFit: [
        {
          career: "Chartered Accountant",
          matchPercentage: 89,
          reasoning: "Strong analytical and commerce skills",
        },
      ],
      skillGaps: ["Verbal"],
      developmentAreas: ["Presentation"],
    },
    totalTimeSpent: 32,
    completedAt: "2025-08-26T15:50:00Z",
  },
];
