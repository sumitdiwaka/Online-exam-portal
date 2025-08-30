// src/models/Question.js

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    enum: ['Math', 'Science'], // Only allows these two values
    required: true,
  },
  class: {
    type: String,
    enum: ['9', '10'], // Only allows these two values
    required: true,
  },
});

module.exports = mongoose.model('Question', QuestionSchema);