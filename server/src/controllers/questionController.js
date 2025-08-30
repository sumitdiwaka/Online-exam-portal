// src/controllers/questionController.js

const Question = require('../models/Question');

// @desc    Get questions based on class and subject
// @route   GET /api/questions
const getQuestions = async (req, res) => {
  try {
    const { class: className, subject } = req.query;

    const questions = await Question.aggregate([
      { $match: { class: className, subject: subject } },
      { $sample: { size: 20 } },
    ]);

    // We will now send the full question object, including the correct answer
    res.json(questions);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
};


// @desc    Add a new question (for admin/testing purposes)
// @route   POST /api/questions
const addQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, subject, class: className } = req.body;
    const newQuestion = new Question({
      questionText,
      options,
      correctAnswer,
      subject,
      class: className,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error adding question', error });
  }
};

module.exports = { getQuestions, addQuestion };