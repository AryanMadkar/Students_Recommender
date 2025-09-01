const Colleges = [
  {
    _id: "c01",
    name: "Indian Institute of Technology Bombay",
    shortName: "IIT Bombay",
    location: {
      state: "Maharashtra",
      city: "Mumbai",
      address: "Powai, Mumbai",
      coordinates: { lat: 19.1334, lng: 72.9133 },
    },
    type: "Central",
    courses: [
      {
        name: "Computer Science and Engineering",
        duration: "4 years",
        fees: { annual: 220000, total: 880000 },
        eligibility: {
          stream: ["Science"],
          minimumPercentage: 75,
          entranceExam: "JEE Advanced",
        },
        cutoffs: [{ year: 2024, category: "General", cutoff: 67 }],
      },
    ],
    ratings: {
      overall: 4.9,
      placement: 5.0,
      infrastructure: 4.8,
      faculty: 4.9,
    },
    placementStats: {
      averagePackage: 2500000,
      highestPackage: 5000000,
      placementPercentage: 99,
      topRecruiters: ["Google", "Microsoft"],
    },
    website: "https://www.iitb.ac.in",
    isActive: true,
  },
  {
    _id: "c02",
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    location: {
      state: "Delhi",
      city: "New Delhi",
      address: "Hauz Khas, New Delhi",
      coordinates: { lat: 28.545, lng: 77.1926 },
    },
    type: "Central",
    courses: [
      {
        name: "Data Science",
        duration: "4 years",
        fees: { annual: 230000, total: 920000 },
        eligibility: {
          stream: ["Science"],
          minimumPercentage: 75,
          entranceExam: "JEE Advanced",
        },
        cutoffs: [{ year: 2024, category: "General", cutoff: 120 }],
      },
    ],
    ratings: {
      overall: 4.8,
      placement: 4.9,
      infrastructure: 4.7,
      faculty: 4.8,
    },
    placementStats: {
      averagePackage: 2300000,
      highestPackage: 4200000,
      placementPercentage: 98,
      topRecruiters: ["Amazon", "Goldman Sachs"],
    },
    website: "https://www.iitd.ac.in",
    isActive: true,
  },
  {
    _id: "c04",
    name: "Shri Ram College of Commerce",
    shortName: "SRCC",
    location: {
      state: "Delhi",
      city: "New Delhi",
      address: "University of Delhi North Campus",
      coordinates: { lat: 28.6867, lng: 77.209 },
    },
    type: "Central",
    courses: [
      {
        name: "Bachelor of Commerce (Hons)",
        duration: "3 years",
        fees: { annual: 30000, total: 90000 },
        eligibility: {
          stream: ["Commerce"],
          minimumPercentage: 90,
          entranceExam: "CUET",
        },
        cutoffs: [{ year: 2024, category: "General", cutoff: 99 }],
      },
    ],
    ratings: {
      overall: 4.7,
      placement: 4.8,
      infrastructure: 4.6,
      faculty: 4.7,
    },
    placementStats: {
      averagePackage: 1000000,
      highestPackage: 2500000,
      placementPercentage: 95,
      topRecruiters: ["Deloitte", "KPMG"],
    },
    website: "https://www.srcc.edu",
    isActive: true,
  },
];
