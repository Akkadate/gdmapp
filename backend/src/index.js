const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Database connection
const sequelize = require('./config/database');

// Routes
const patientRoutes = require('./routes/patient.routes');
const glucoseRoutes = require('./routes/glucose.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/glucose', glucoseRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gestational Diabetes Management API' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synchronized.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
