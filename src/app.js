require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Import routes
const appointmentRoutes = require('./api/appointment/appointment.routes');
const authRoutes = require('./api/auth/auth.routes');
const doctorRoutes = require('./api/doctor/doctor.routes');

// API Routes
app.use('/api/appointment', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
