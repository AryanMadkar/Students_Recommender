const user = [
  {
    _id: "u01",
    personalInfo: {
      name: "Aryan Madkar",
      email: "aryan.madkar@email.com",
      phone: "9876543210",
      dateOfBirth: "2002-06-15",
      gender: "Male",
      state: "Maharashtra",
      city: "Pune",
    },
    educationStage: "ongoing",
    academicInfo: {
      currentCourse: {
        degree: "BTech",
        specialization: "Computer Science and Engineering",
        college: "Indian Institute of Technology Bombay",
        year: 2025,
        cgpa: 8.9,
        semester: 6,
      },
    },
    progress: {
      profileCompletion: 95,
      assessmentsCompleted: 4,
      lastActive: "2025-08-30T18:02:00Z",
    },
    favorites: { colleges: ["c01"], courses: ["co01"], careers: ["ca01"] },
  },
  {
    _id: "u02",
    personalInfo: {
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "8881234567",
      dateOfBirth: "2003-12-01",
      gender: "Female",
      state: "Delhi",
      city: "Delhi",
    },
    educationStage: "after12th",
    academicInfo: {
      class12: {
        stream: "Commerce",
        board: "CBSE",
        percentage: 94,
        subjects: [
          { name: "Accounts", marks: 95 },
          { name: "Economics", marks: 93 },
        ],
        year: 2023,
      },
    },
    progress: {
      profileCompletion: 89,
      assessmentsCompleted: 2,
      lastActive: "2025-08-28T09:17:00Z",
    },
    favorites: { colleges: ["c04"], courses: ["co03"], careers: ["ca03"] },
  },
  {
    _id: "u03",
    personalInfo: {
      name: "Rohan Mehta",
      email: "rohan.mehta@email.com",
      phone: "9876523456",
      dateOfBirth: "2001-04-26",
      gender: "Male",
      state: "Karnataka",
      city: "Bangalore",
    },
    educationStage: "ongoing",
    academicInfo: {
      currentCourse: {
        degree: "Bachelor",
        specialization: "Data Science",
        college: "Indian Institute of Technology Delhi",
        year: 2025,
        cgpa: 9.2,
        semester: 7,
      },
    },
    progress: {
      profileCompletion: 92,
      assessmentsCompleted: 3,
      lastActive: "2025-08-20T12:10:00Z",
    },
    favorites: { colleges: ["c02"], courses: ["co02"], careers: ["ca02"] },
  },
];
