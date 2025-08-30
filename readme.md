Online Exam System
A full-stack, modern web application designed for students of classes 9 and 10 to take timed, multiple-choice exams in Math and Science. The system provides instant feedback, tracks user performance over time, and features a clean, responsive user interface.

✨ Core Features
Personalized User Dashboard: A beautiful landing page that remembers users and displays their complete history of past exam results.

Timed Exams: Each exam has a fixed duration. The test auto-submits when the timer runs out, ensuring a fair testing environment.

Persistent Exam Sessions: Refreshing the page during an exam won't reset your progress. The timer and your answers are saved, allowing you to continue seamlessly.

Dynamic Question Loading: Fetches 20 random questions from the database based on the user's selected class and subject.

Instant Auto-Evaluation: Upon submission, users immediately see their score, percentage, and a detailed review of every question, including their answer and the correct one.

Advanced Exam Navigation:

Move between questions with "Next" and "Previous" buttons.

Use the interactive Question Palette to jump directly to any question.

The palette visually tracks answered, unanswered, and current questions.

Result Management: Users can view their past performance and have the option to permanently delete any result from their history.

🛠️ Technology Stack
This project is built with the MERN stack and styled with Tailwind CSS.

Area

Technology

Frontend

React.js, React Router, Tailwind CSS, Axios

Backend

Node.js, Express.js

Database

MongoDB with Mongoose

Tools

Vite (Frontend Bundler), Nodemon (Server Auto-Reload), Postman (API Testing)

📂 Project Structure
The project is organized into two main directories: client for the frontend and server for the backend.

online-exam-system/
├── client/         # React Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   └── ...
└── server/         # Node.js Backend
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── models/
    │   └── routes/
    ├── data/       # For seeder script data
    └── ...

🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Make sure you have the following software installed:

Node.js (which includes npm)

MongoDB or a MongoDB Atlas account (recommended)

Postman or another API client for testing.

Backend Setup
Navigate to the server directory:

cd server

Install dependencies:

npm install

Create a .env file in the server root directory. This file will store your secret variables.

Add your MongoDB Connection URI to the .env file. Replace the placeholder with your actual connection string from MongoDB Atlas.

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/onlineExamDB?retryWrites=true&w=majority

Seed the database with questions: The project includes a seeder script to easily populate the database with sample questions.

npm run data:import

Start the backend server:

npm run dev

The server will be running on http://localhost:5000.

Frontend Setup
Open a new terminal and navigate to the client directory:

cd client

Install dependencies:

npm install

Start the frontend development server:

npm run dev

The React application will be running on http://localhost:5173 (or another port if 5173 is busy).

You can now open your browser and interact with the application!

📸 Screenshots
Dashboard
Users are greeted with a personalized dashboard where they can start a new test or review their past performance.

Exam Page
The main exam interface features a question, options, a countdown timer, and the interactive question navigation palette.

Results Page
After submission, users get a detailed breakdown of their score and a question-by-question review.

💡 Future Improvements
This project has a solid foundation, but there are many ways it could be extended:

Admin Panel: Create a secure dashboard for administrators to add/edit questions and view all user results.

User Authentication: Implement a full login/signup system with password protection instead of just using email.

More Question Types: Add support for different types of questions, such as "fill in the blanks" or "match the columns."

Subject Categories: Expand the number of subjects and classes available.

Performance Analytics: Show users charts and graphs of their performance over time for each subject.

License
This project is licensed under the MIT License. See the LICENSE file for details.