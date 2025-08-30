// index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const connectDB = require('./src/config/db');

// Import routes
const questionRoutes = require('./src/routes/questionRoutes');
const resultRoutes = require('./src/routes/resultRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
})); // Use cors
app.use(express.json()); // Use express.json to parse JSON bodies

const PORT = process.env.PORT || 5000;

// Main API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});