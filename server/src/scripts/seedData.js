const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Assessment = require("../models/Assessment");
const Question = require("../models/Question");
const College = require("../models/College");
const Career = require("../models/Career");
const Course = require("../models/Course");

const connectDB = require("../config/database");

const seedAllData = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    await connectDB();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Assessment.deleteMany({});
    await Question.deleteMany({});
    await College.deleteMany({});
    await Career.deleteMany({});
    await Course.deleteMany({});

    // Seed Questions
    console.log("❓ Seeding questions...");
    const dataPath = path.join(__dirname, "../data");
    const after10thQuestionsData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "questions/after10th.json"), "utf8")
    );
    const after12thQuestionsData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "questions/after12th.json"), "utf8")
    );
    const ongoingQuestionsData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "questions/ongoing.json"), "utf8")
    );
    const allQuestionsData = [
      ...after10thQuestionsData,
      ...after12thQuestionsData,
      ...ongoingQuestionsData,
    ];
    const insertedQuestions = await Question.insertMany(allQuestionsData);
    console.log(`✅ Inserted ${insertedQuestions.length} questions.`);

    // Helper to get question IDs by stage
    const getQuestionIdsByStage = (stage) => {
      return insertedQuestions
        .filter((q) => q.stage.includes(stage))
        .map((q) => ({ questionId: q._id, weight: 1 }));
    };

    // Create Assessments
    console.log("📝 Creating assessments...");
    const assessments = [
      {
        title: "Stream Selection Assessment (After 10th)",
        description: "Comprehensive assessment to help you choose the right stream after 10th grade.",
        stage: "after10th",
        type: "aptitude",
        questions: getQuestionIdsByStage("after10th"),
        duration: 30,
        passingScore: 60,
        isActive: true,
      },
      {
        title: "Career Guidance Assessment (After 12th)",
        description: "Detailed assessment for career planning and college selection after 12th.",
        stage: "after12th",
        type: "aptitude",
        questions: getQuestionIdsByStage("after12th"),
        duration: 45,
        passingScore: 65,
        isActive: true,
      },
      {
        title: "Skill & Career Assessment (Current Students)",
        description: "Assessment for ongoing students to identify skills and optimize career paths.",
        stage: "ongoing",
        type: "aptitude",
        questions: getQuestionIdsByStage("ongoing"),
        duration: 40,
        passingScore: 70,
        isActive: true,
      },
    ];
    const insertedAssessments = await Assessment.insertMany(assessments);
    console.log(`✅ Created ${insertedAssessments.length} assessments.`);

    // Seed Colleges
    console.log("🏫 Seeding colleges...");
    const collegesData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "colleges.json"), "utf8")
    );
    await College.insertMany(collegesData);
    console.log(`✅ Inserted ${collegesData.length} colleges.`);

    // Seed Careers
    console.log("🚀 Seeding careers...");
    const careersData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "careers.json"), "utf8")
    );
    await Career.insertMany(careersData);
    console.log(`✅ Inserted ${careersData.length} careers.`);

    // Seed Courses
    console.log("📚 Seeding courses...");
    const coursesData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "courses.json"), "utf8")
    );
    await Course.insertMany(coursesData);
    console.log(`✅ Inserted ${coursesData.length} courses.`);

    console.log("\n🎉 All data seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedAllData();
}

module.exports = seedAllData;
