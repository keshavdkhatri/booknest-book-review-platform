const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'BookNest Backend Server is running smoothly',
    timestamp: new Date()
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
