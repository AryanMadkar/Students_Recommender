
=== HEALTH CHECK ===
Status: 200
Body: {
  "success": true,
  "message": "PathPilot API is running",
  "timestamp": "2025-09-06T08:19:15.628Z",
  "uptime": 2.2802475
}

=== AUTH: REGISTER ===
Status: 201
Body: {
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJiZWU4NDlhMGYwYTZlNTgyZDcyYWEiLCJpYXQiOjE3NTcxNDY3NTYsImV4cCI6MTc1Nzc1MTU1Nn0.0yERQ6lHTV36feSws5t6DMM5pGn9OwRrSPiOPNoQj50",
    "user": {
      "id": "68bbee849a0f0a6e582d72aa",
      "name": "Aryan844233",
      "email": "aryanmadkar70@example.com",
      "educationStage": "ongoing"
    }
  }
}

=== AUTH: LOGIN ===
Status: 200
Body: {
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJiZWU4NDlhMGYwYTZlNTgyZDcyYWEiLCJpYXQiOjE3NTcxNDY3NTksImV4cCI6MTc1Nzc1MTU1OX0.cmXE5XWAPdaRYUPRTuJoWsEjM3_G9EvpO9x-_Y1Nl3U",
    "user": {
      "id": "68bbee849a0f0a6e582d72aa",
      "name": "Aryan844233",
      "email": "aryanmadkar70@example.com",
      "educationStage": "ongoing",
      "profileCompletion": 0
    }
  }
}
✅ Token obtained: eyJhbGciOiJIUzI1NiIs...

=== AUTH: ME ===
Status: 200
Body: {
  "success": true,
  "data": {
    "personalInfo": {
      "name": "Aryan844233",
      "email": "aryanmadkar70@example.com",
      "phone": "9876543210"
    },
    "favorites": {
      "colleges": [],
      "courses": [],
      "careers": []
    },
    "academicInfo": {
      "class10": {
        "subjects": []
      },
      "class12": {
        "subjects": []
      }
    },
    "parentalInfluence": {
      "preferredFields": []
    },
    "progress": {
      "profileCompletion": 0,
      "assessmentsCompleted": 0,
      "lastActive": "2025-09-06T08:19:19.797Z"
    },
    "_id": "68bbee849a0f0a6e582d72aa",
    "educationStage": "ongoing",
    "assessmentResults": [],
    "recommendations": [],
    "createdAt": "2025-09-06T08:19:16.093Z",
    "updatedAt": "2025-09-06T08:19:19.798Z",
    "__v": 0
  }
}

=== AUTH: VALIDATE TOKEN ===
Status: 200
Body: {
  "success": true,
  "data": {
    "user": {
      "id": "68bbee849a0f0a6e582d72aa",
      "name": "Aryan844233",
      "email": "aryanmadkar70@example.com",
      "educationStage": "ongoing",
      "profileCompletion": 0
    }
  }
}

=== USERS: PROFILE GET ===
Status: 200
Body: {
  "success": true,
  "data": {
    "personalInfo": {
      "name": "Aryan844233",
      "email": "aryanmadkar70@example.com",
      "phone": "9876543210"
    },
    "favorites": {
      "colleges": [],
      "courses": [],
      "careers": []
    },
    "academicInfo": {
      "class10": {
        "subjects": []
      },
      "class12": {
        "subjects": []
      }
    },
    "parentalInfluence": {
      "preferredFields": []
    },
    "progress": {
      "profileCompletion": 0,
      "assessmentsCompleted": 0,
      "lastActive": "2025-09-06T08:19:19.797Z"
    },
    "_id": "68bbee849a0f0a6e582d72aa",
    "educationStage": "ongoing",
    "assessmentResults": [],
    "recommendations": [],
    "createdAt": "2025-09-06T08:19:16.093Z",
    "updatedAt": "2025-09-06T08:19:19.798Z",
    "__v": 0
  }
}

=== USERS: PROFILE UPDATE ===
Status: 500
Body: {
  "success": false,
  "message": "Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: manproject.users index: personalInfo.email_1 dup key: { personalInfo.email: null }"
}

=== ASSESSMENTS: LIST ===
Status: 200
Body: {
  "success": true,
  "data": []
}

=== COLLEGES: SEARCH (PUBLIC) ===
Status: 200
Body: {
  "success": true,
  "data": {
    "colleges": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 0,
      "totalColleges": 0
    }
  }
}

=== COLLEGES: PERSONALIZED RECS (AUTH) ===
Status: 200
Body: {
  "success": true,
  "data": []
}

=== RECOMMENDATIONS: GENERATE (AUTH) ===
Status: 200
Body: {
  "success": true,
  "data": [
    {
      "type": "career",
      "title": "Software Engineer",
      "matchPercentage": 85,
      "description": "Based on your technical aptitude and interests"
    }
  ]
}

=== RECOMMENDATIONS: GUIDANCE (AUTH) ===
Status: 200
Body: {
  "success": true,
  "data": {
    "stage": "ongoing",
    "recommendations": [
      "Complete your profile",
      "Take assessments"
    ],
    "nextSteps": [
      "Explore career options",
      "Research colleges"
    ]
  }
}

=== RECOMMENDATIONS: CAREERS (AUTH) ===
Status: 200
Body: {
  "success": true,
  "data": [
    {
      "title": "Software Engineer",
      "matchPercentage": 90,
      "salaryRange": "8-25 LPA",
      "description": "Develop software applications"
    },
    {
      "title": "Data Scientist",
      "matchPercentage": 85,
      "salaryRange": "12-30 LPA",
      "description": "Analyze data and build ML models"
    }
  ]
}

=== DASHBOARD: OVERVIEW (AUTH) ===
Status: 500
Body: {
  "success": false,
  "message": "Cannot read properties of undefined (reading 'getUserStats')"
}

=== USERS: PREFERENCES GET (AUTH) ===
Status: 200
Body: {
  "success": true,
  "data": {
    "notifications": true,
    "emailUpdates": true,
    "theme": "light"
  }
}

✅ All smoke tests completed successfully!
PS D:\man_project\server\src\tests>