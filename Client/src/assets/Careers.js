const Careers = [
  {
    _id: "ca01",
    title: "Software Engineer",
    category: "Engineering",
    description: "Design, develop, and maintain software apps and systems.",
    requiredSkills: [
      {
        skill: "Data Structures & Algorithms",
        proficiency: "Advanced",
        importance: 5,
      },
      {
        skill: "Programming (Python/Java/C++)",
        proficiency: "Advanced",
        importance: 5,
      },
    ],
    educationPath: [
      {
        level: "Bachelor",
        fields: ["Computer Science"],
        duration: "4 years",
        mandatory: true,
      },
    ],
    salaryRange: {
      entry: { min: 600000, max: 1500000 },
      mid: { min: 1500000, max: 3500000 },
      senior: { min: 3500000, max: 8000000 },
    },
    jobRoles: ["SDE-1", "Full Stack Developer"],
    industries: ["IT Services", "Product Companies"],
    growth: {
      demand: "High",
      futureScope: "Excellent growth with AI",
      automationRisk: "Low",
    },
    aptitudeMapping: {
      analytical: 95,
      creative: 60,
      technical: 95,
      communication: 70,
      leadership: 65,
    },
  },
  {
    _id: "ca02",
    title: "Data Scientist",
    category: "Science",
    description:
      "Analyze and model data to extract insights for business decision-making.",
    requiredSkills: [
      { skill: "Python/R", proficiency: "Advanced", importance: 5 },
      { skill: "Machine Learning", proficiency: "Advanced", importance: 5 },
      { skill: "Statistics", proficiency: "Advanced", importance: 4 },
    ],
    educationPath: [
      {
        level: "Bachelor",
        fields: ["Computer Science", "Mathematics"],
        duration: "4 years",
        mandatory: true,
      },
      {
        level: "Master",
        fields: ["Data Science", "AI/ML"],
        duration: "2 years",
        mandatory: false,
      },
    ],
    salaryRange: {
      entry: { min: 800000, max: 2000000 },
      mid: { min: 2000000, max: 4500000 },
      senior: { min: 4500000, max: 10000000 },
    },
    jobRoles: ["Data Scientist", "AI Engineer"],
    industries: ["Technology", "Finance"],
    growth: {
      demand: "High",
      futureScope: "Growing across all sectors.",
      automationRisk: "Low",
    },
    aptitudeMapping: {
      analytical: 95,
      creative: 75,
      technical: 90,
      communication: 80,
      leadership: 70,
    },
  },
  {
    _id: "ca03",
    title: "Chartered Accountant",
    category: "Business",
    description:
      "Handles finances, auditing, and taxation for companies and individuals.",
    requiredSkills: [
      { skill: "Accounting Standards", proficiency: "Advanced", importance: 5 },
      { skill: "Taxation Laws", proficiency: "Advanced", importance: 5 },
      { skill: "Auditing", proficiency: "Advanced", importance: 4 },
    ],
    educationPath: [
      {
        level: "10+2",
        fields: ["Commerce"],
        duration: "2 years",
        mandatory: true,
      },
      {
        level: "Certificate",
        fields: ["CA (Foundation, Inter, Final)"],
        duration: "4-5 years",
        mandatory: true,
      },
    ],
    salaryRange: {
      entry: { min: 700000, max: 1200000 },
      mid: { min: 1200000, max: 2500000 },
      senior: { min: 2500000, max: 6000000 },
    },
    jobRoles: ["Auditor", "Finance Manager"],
    industries: ["Banking", "Consulting"],
    growth: {
      demand: "High",
      futureScope: "Stable, high demand.",
      automationRisk: "Medium",
    },
    aptitudeMapping: {
      analytical: 90,
      creative: 50,
      technical: 80,
      communication: 75,
      leadership: 80,
    },
  },
];
