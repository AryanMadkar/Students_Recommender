const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["multiple_choice", "rating", "ranking", "text", "boolean"],
      required: true,
    },
    // CORRECTED: Expanded the enum to include all categories from your data files.
    category: {
      type: String,
      enum: [
        "interest",
        "analytical",
        "creative",
        "technical",
        "communication",
        "leadership",
        "personality",
        "academic",
        "iq",
      ],
      required: true,
    },
    subcategory: String,
    options: [
      {
        text: String,
        value: mongoose.Schema.Types.Mixed,
        weight: Number,
      },
    ],
    correctAnswer: mongoose.Schema.Types.Mixed,
    explanation: String,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    stage: [
      {
        type: String,
        enum: ["after10th", "after12th", "ongoing"],
      },
    ],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
