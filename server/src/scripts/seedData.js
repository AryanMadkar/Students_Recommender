const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Career = require('../models/Career');
const College = require('../models/College');
const Course = require('../models/Course');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');

// Import database connection
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Career.deleteMany({}),
      College.deleteMany({}),
      Course.deleteMany({}),
      Question.deleteMany({}),
      Assessment.deleteMany({})
    ]);
    
    // Read JSON files
    const careersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/careers.json'), 'utf8'));
    const collegesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/colleges.json'), 'utf8'));
    const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/courses.json'), 'utf8'));
    
    // Read question files
    const after10thQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/after10th.json'), 'utf8'));
    const after12thQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/after12th.json'), 'utf8'));
    const ongoingQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/ongoing.json'), 'utf8'));
    
    // Seed careers
    console.log('📈 Seeding careers...');
    await Career.insertMany(careersData);
    console.log(`✅ Inserted ${careersData.length} careers`);
    
    // Seed colleges
    console.log('🏫 Seeding colleges...');
    await College.insertMany(collegesData);
    console.log(`✅ Inserted ${collegesData.length} colleges`);
    
    // Seed courses
    console.log('📚 Seeding courses...');
    await Course.insertMany(coursesData);
    console.log(`✅ Inserted ${coursesData.length} courses`);
    
    // Seed questions
    console.log('❓ Seeding questions...');
    const allQuestions = [...after10thQuestions, ...after12thQuestions, ...ongoingQuestions];
    const insertedQuestions = await Question.insertMany(allQuestions);
    console.log(`✅ Inserted ${allQuestions.length} questions`);
    
    // Create sample assessments
    console.log('📋 Creating sample assessments...');
    const assessments = [
      {
        title: 'After 10th Stream Selection Assessment',
        description: 'Helps students choose the right stream after 10th grade',
        stage: 'after10th',
        type: 'aptitude',
        questions: after10thQuestions.map((_, index) => ({
          questionId: insertedQuestions[index]._id,
          weight: 1
        })),
        duration: 30,
        passingScore: 60,
        isActive: true
      },
      {
        title: 'After 12th Career Guidance Assessment',
        description: 'Comprehensive assessment for career planning after 12th',
        stage: 'after12th',
        type: 'aptitude',
        questions: after12thQuestions.map((_, index) => ({
          questionId: insertedQuestions[after10thQuestions.length + index]._id,
          weight: 1
        })),
        duration: 45,
        passingScore: 60,
        isActive: true
      },
      {
        title: 'Current Student Skill Assessment',
        description: 'Assessment for ongoing students to identify skills and career paths',
        stage: 'ongoing',
        type: 'aptitude',
        questions: ongoingQuestions.map((_, index) => ({
          questionId: insertedQuestions[after10thQuestions.length + after12thQuestions.length + index]._id,
          weight: 1
        })),
        duration: 40,
        passingScore: 60,
        isActive: true
      }
    ];
    
    await Assessment.insertMany(assessments);
    console.log(`✅ Created ${assessments.length} assessments`);
    
    console.log('🎉 Data seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedData();
}

module.exports = seedData;
