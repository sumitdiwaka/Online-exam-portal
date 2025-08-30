// src/controllers/resultController.js

const Result = require('../models/Result');

// @desc    Submit a new result
// @route   POST /api/results
const submitResult = async (req, res) => {
  try {
    const { userName, email, score, totalQuestions, subject, class: className } = req.body;

    const newResult = new Result({
      userName,
      email,
      score,
      totalQuestions,
      subject,
      class: className,
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting result', error });
  }
};
const getResultsByEmail = async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameter
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find all results matching the email and sort by the newest first
    const results = await Result.find({ email }).sort({ submittedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error });
  }
};

const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // In a real app, you might want to check if the user is authorized to delete this.
    // For this project, we'll allow the deletion.
    await result.deleteOne();
    
    res.json({ message: 'Result removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting result', error });
  }
};

module.exports = { submitResult, getResultsByEmail, deleteResult };