const Assessment = [
  {
    _id: "a01",
    title: "Ongoing Tech Skills Assessment",
    description: "Evaluate skills for BTech students.",
    stage: "ongoing",
    type: "aptitude",
    duration: 20,
    passingScore: 60,
    questions: [
      { questionId: "q01", weight: 1 },
      { questionId: "q02", weight: 1 },
    ],
    scoringCriteria: {
      categories: [
        { name: "analytical", weight: 40, questionIds: ["q01"] },
        { name: "technical", weight: 60, questionIds: ["q02"] },
      ],
    },
    isActive: true,
  },
  {
    _id: "a02",
    title: "Commerce Aptitude Test",
    description: "Assesses basic commerce and logical reasoning.",
    stage: "after12th",
    type: "aptitude",
    duration: 30,
    passingScore: 50,
    questions: [
      { questionId: "q03", weight: 1 },
      { questionId: "q04", weight: 1 },
    ],
    scoringCriteria: {
      categories: [
        { name: "analytical", weight: 50, questionIds: ["q03"] },
        { name: "business", weight: 50, questionIds: ["q04"] },
      ],
    },
    isActive: true,
  },
];
