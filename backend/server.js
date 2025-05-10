const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const userRoutes = require('./routes/userRoutes');
const academicYearRoutes = require('./routes/academicYearRoutes');
const branchRoutes = require('./routes/branchRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const urlRoutes = require('./routes/urlRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));
app.use(express.json());
// app.use();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/urls', urlRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('Loading bookRoutes');
console.log('Loaded bookRoutes');
console.log('Loading subjectRoutes');
