const Courses = [
  {
    _id: "co01",
    name: "Computer Science and Engineering",
    shortName: "CSE",
    type: "Bachelor",
    category: "Engineering",
    duration: "4 years",
    eligibility: {
      academicRequirement: "12th with PCM",
      minimumMarks: 75,
      requiredSubjects: ["Maths", "Physics", "Chemistry"],
      entranceExams: ["JEE Main", "JEE Advanced"],
      ageLimit: { min: 17, max: 30 },
    },
    careerProspects: [
      {
        jobRole: "Software Engineer",
        averageSalary: 1200000,
        industries: ["IT Services"],
      },
      {
        jobRole: "Data Scientist",
        averageSalary: 1500000,
        industries: ["Tech"],
      },
    ],
    skills: {
      technical: ["Algorithms", "Web Development"],
      soft: ["Communication", "Problem Solving"],
      tools: ["Git", "Linux"],
    },
    colleges: ["c01", "c02"],
    statistics: {
      averagePlacement: 96,
      averagePackage: 1700000,
      topRecruiters: ["Google", "Microsoft"],
    },
  },
  {
    _id: "co02",
    name: "Data Science",
    shortName: "DS",
    type: "Bachelor",
    category: "Science",
    duration: "4 years",
    eligibility: {
      academicRequirement: "12th with PCM",
      minimumMarks: 75,
      requiredSubjects: ["Maths", "Physics", "Computer Science"],
      entranceExams: ["JEE Main", "JEE Advanced"],
      ageLimit: { min: 17, max: 30 },
    },
    careerProspects: [
      {
        jobRole: "Data Scientist",
        averageSalary: 1500000,
        industries: ["Tech"],
      },
    ],
    skills: {
      technical: ["Python", "ML"],
      soft: ["Problem Solving"],
      tools: ["Jupyter", "TensorFlow"],
    },
    colleges: ["c02"],
    statistics: {
      averagePlacement: 93,
      averagePackage: 1550000,
      topRecruiters: ["Amazon", "Goldman Sachs"],
    },
  },
  {
    _id: "co03",
    name: "Bachelor of Commerce",
    shortName: "B.Com",
    type: "Bachelor",
    category: "Commerce",
    duration: "3 years",
    eligibility: {
      academicRequirement: "12th with Commerce",
      minimumMarks: 55,
      requiredSubjects: ["Accounts", "Economics"],
      entranceExams: ["CUET"],
      ageLimit: { min: 17, max: 28 },
    },
    careerProspects: [
      {
        jobRole: "Chartered Accountant",
        averageSalary: 900000,
        industries: ["Banking"],
      },
      {
        jobRole: "Financial Analyst",
        averageSalary: 700000,
        industries: ["Finance"],
      },
    ],
    skills: {
      technical: ["Accounting", "Financial Analysis"],
      soft: ["Attention to Detail"],
      tools: ["Excel", "Tally"],
    },
    colleges: ["c04"],
    statistics: {
      averagePlacement: 89,
      averagePackage: 850000,
      topRecruiters: ["Deloitte", "KPMG"],
    },
  },
];
