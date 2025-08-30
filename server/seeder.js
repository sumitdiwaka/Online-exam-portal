// server/seeder.js
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models and DB connection
const Question = require('./src/models/Question');
const connectDB = require('./src/config/db');

// Connect to DB
connectDB();

// Read JSON files
const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/data/questions.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Question.create(questions);
    console.log('✅ Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Question.deleteMany();
    console.log('❌ Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Run functions based on command line arguments
if (process.argv[2] === '-i') { // To import: node seeder -i
  importData();
} else if (process.argv[2] === '-d') { // To delete: node seeder -d
  deleteData();
}