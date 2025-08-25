const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    phone: {
      type: String,
      unique: true,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    dateofBirth: {
      type: Date,
      require: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    EducationStage: {
      type: String,
      enum: ["after10th", "after12th", "ongoing"],
      require: true,
    },
    academicInfo: {
      // For After 10th students
      class10: {
        board: String,
        percentage: Number,
        subjects: [
          {
            name: String,
            marks: Number,
          },
        ],
        year: Number,
      },

      // For After 12th students
      class12: {
        stream: { type: String, enum: ["Science", "Commerce", "Arts"] },
        board: String,
        percentage: Number,
        subjects: [
          {
            name: String,
            marks: Number,
          },
        ],
        year: Number,
      },

      assessmentResults: [
        {
          assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment",
          },
          responses: Map,
          scores: {
            aptitude: Number,
            interest: Number,
            iq: Number,
            personality: Number,
          },
          completedAt: { type: Date, default: Date.now },
        },
      ],

      parentalInfluence: {
        preferredFields: [String],
        supportLevel: { type: Number, min: 1, max: 5 },
        expectations: String,
      },

      recommendations: [
        {
          type: {
            type: String,
            enum: ["college", "course", "career", "skill"],
          },
          data: mongoose.Schema.Types.Mixed,
          confidence: Number,
          generatedAt: { type: Date, default: Date.now },
        },
      ],

      // For Ongoing course students
      currentCourse: {
        degree: String,
        specialization: String,
        college: String,
        year: Number,
        cgpa: Number,
        semester: Number,
      },
    },
    progress: {
      profileCompletion: { type: Number, default: 0 },
      assessmentsCompleted: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User",userSchema)